/**
 * Stretch 类
 */
import { checkLimits } from './utils'
import SampleBuffer from './sampleBuffer'
import * as CONSTANT from './constant'

export default class Stretch {
  /**
   * 速率
   */
  private _tempo = 1
  /**
   * 是否自动计算一帧的时长
   */
  private autoSeqSetting = true
  /**
   * 是否自动计算搜索范围
   */
  private autoSeekSetting = true
  /**
   * 合帧长度
   */
  private overlapLength = 0
  /**
   * 参考帧
   */
  private midBuffer = new Float32Array()
  /**
   * 中间帧（计算正相关）
   */
  private refMidBuffer = new Float32Array()
  /**
   * 采样率
   */
  private sampleRate = 44100

  /**
   * 相邻帧时长
   */
  private overlapMs = CONSTANT.DEFAULT_OVERLAP_MS

  /**
   * 一帧的时长
   */
  private sequenceMs = CONSTANT.DEFAULT_SEQUENCE_MS

  /**
   * 检索最佳帧的范围
   */
  private seekWindowMs = CONSTANT.DEFAULT_SEEKWINDOW_MS

  /**
   * 一帧的大小
   * @remarks 即采样率与一帧的时长的乘积
   */
  private seekWindowLength = 0

  /**
   * 搜索窗大小
   * @remarks 即采样率与搜索时长的乘积
   */
  private seekLength = 0
  /**
   * 一次算法所需要的最小数据量
   */
  private sampleReq = 0
  /**
   * 跳帧
   */
  private nominalSkip = 0
  /**
   * 跳帧位置
   */
  private skipFract = 0
  /**
   * 输入数据
   */
  private inputBuffer = new SampleBuffer()
  /**
   * 输出数据
   */
  private outputBuffer = new SampleBuffer()

  constructor() {
    this.setParameters(
      44100,
      CONSTANT.DEFAULT_SEQUENCE_MS,
      CONSTANT.DEFAULT_SEEKWINDOW_MS,
      CONSTANT.DEFAULT_OVERLAP_MS
    )
  }
  /**
   * 设置 wsola 算法参数
   * @param sampleRate - 采样率
   * @param sequenceMs - 一帧的时长
   * @param seekWindowMs - 检索最佳帧的范围
   * @param overlapMs - 相邻两帧重叠时长
   */
  setParameters(
    sampleRate: number,
    sequenceMs: number,
    seekWindowMs: number,
    overlapMs: number
  ) {
    if (sampleRate > 0) {
      this.sampleRate = sampleRate
    }
    if (overlapMs > 0) {
      this.overlapMs = overlapMs
    }
    if (sequenceMs > 0) {
      this.sequenceMs = sequenceMs
      this.autoSeqSetting = false
    } else {
      this.autoSeqSetting = true
    }
    if (seekWindowMs > 0) {
      this.seekWindowMs = seekWindowMs
      this.autoSeekSetting = false
    } else {
      this.autoSeekSetting = true
    }
    this.calculateSequenceParameters()
    this.calculateOverlapLength(this.overlapMs)
    // 根据速率确定分帧间隔
    this.tempo = this._tempo
  }

  /**
   * 计算帧的相关数据
   * @remarks 根据采样率与帧长计算每一帧的采样点，同时参数自动计算帧长与检索范围
   */
  calculateSequenceParameters() {
    if (this.autoSeqSetting) {
      let seq = CONSTANT.AUTOSEQ_C + CONSTANT.AUTOSEQ_K * this._tempo
      seq = checkLimits(seq, CONSTANT.AUTOSEQ_AT_MAX, CONSTANT.AUTOSEQ_AT_MIN)
      this.sequenceMs = Math.floor(seq + 0.5)
    }
    if (this.autoSeekSetting) {
      let seek = CONSTANT.AUTOSEEK_C + CONSTANT.AUTOSEEK_K * this._tempo
      seek = checkLimits(
        seek,
        CONSTANT.AUTOSEEK_AT_MAX,
        CONSTANT.AUTOSEEK_AT_MIN
      )
      this.seekWindowMs = Math.floor(seek + 0.5)
    }
    this.seekWindowLength = Math.floor(
      (this.sampleRate * this.sequenceMs) / 1000
    )
    this.seekLength = Math.floor((this.sampleRate * this.seekWindowMs) / 1000)
  }

  /**
   * 计算帧重叠长度
   * @remarks 由于通过参考帧寻找最佳帧只需要 overlap 部分，所以 midBuffer 只需要 overlap 长度
   */
  calculateOverlapLength(overlapInMsec = 0) {
    let newOvl = (this.sampleRate * overlapInMsec) / 1000
    newOvl = newOvl < 16 ? 16 : newOvl
    // must be divisible by 8 我日
    newOvl -= newOvl % 8
    this.overlapLength = newOvl
    this.refMidBuffer = new Float32Array(this.overlapLength * 2)
    this.midBuffer = new Float32Array(this.overlapLength * 2)
  }

  /**
   * 设置速率
   */
  set tempo(newTempo) {
    this._tempo = newTempo
    this.calculateSequenceParameters()
    // Calculate ideal skip length (according to tempo value) 我日
    this.nominalSkip =
      this._tempo * (this.seekWindowLength - this.overlapLength)
    // 分析帧间隔
    let intskip = Math.floor(this.nominalSkip + 0.5)
    // 完成一次 wsola 算法迭代需要的数据量
    this.sampleReq =
      Math.max(intskip + this.overlapLength, this.seekWindowLength) +
      this.seekLength
  }

  /**
   * 获取速率
   */
  get tempo() {
    return this._tempo
  }

  /**
   * 寻找最佳匹配帧的位置
   * @remarks 最佳匹配帧的位置
   */
  seekBestOverlapPosition() {
    this.preCalculateCorrelationReferenceStereo()
    let bestCorrelation = Number.MIN_VALUE
    let bestOffset = 0
    let correlationOffset = 0
    let tempOffset = 0
    for (let scanCount = 0; scanCount < 4; scanCount = scanCount + 1) {
      let j = 0
      while (CONSTANT.SCAN_OFFSETS[scanCount][j]) {
        tempOffset = correlationOffset + CONSTANT.SCAN_OFFSETS[scanCount][j]
        if (tempOffset >= this.seekLength) {
          break
        }
        let correlation = this.calculateCrossCorrelationStereo(
          2 * tempOffset,
          this.refMidBuffer
        )
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation
          bestOffset = tempOffset
        }
        j = j + 1
      }
      correlationOffset = bestOffset
    }
    return bestOffset
  }

  /**
   * 处理对比帧
   * @remarks 调整振幅以便更快的处理相关性
   */
  preCalculateCorrelationReferenceStereo() {
    for (let i = 0; i < this.overlapLength; i = i + 1) {
      let temp = i * (this.overlapLength - i)
      let context = i * 2
      this.refMidBuffer[context] = this.midBuffer[context] * temp
      this.refMidBuffer[context + 1] = this.midBuffer[context + 1] * temp
    }
  }

  /**
   * 计算相关性
   * @param mixingPosition - 对比位置
   * @param compare - 对比帧
   * @returns 相关性值
   */
  calculateCrossCorrelationStereo(
    mixingPosition: number,
    compare: Float32Array
  ) {
    const mixing = this.inputBuffer.vector
    mixingPosition += this.inputBuffer.startIndex
    let correlation = 0
    const calcLength = 2 * this.overlapLength
    for (let i = 2; i < calcLength; i = i + 2) {
      let mixingOffset = i + mixingPosition
      correlation +=
        mixing[mixingOffset] * compare[i] +
        mixing[mixingOffset + 1] * compare[i + 1]
    }
    return correlation
  }

  /**
   * 合帧
   * @param overlapPosition - 合帧位置
   */
  overlap(overlapPosition: number) {
    let inputPosition = 2 * overlapPosition
    const input = this.inputBuffer.vector
    inputPosition += this.inputBuffer.startIndex

    const output = this.outputBuffer.vector
    const outputPosition = this.outputBuffer.endIndex

    const frameScale = 1 / this.overlapLength

    for (let i = 0; i < this.overlapLength; i = i + 1) {
      let tempFrame = (this.overlapLength - i) * frameScale
      let fi = i * frameScale
      let context = 2 * i
      let inputOffset = context + inputPosition
      let outputOffset = context + outputPosition
      output[outputOffset + 0] =
        input[inputOffset + 0] * fi + this.midBuffer[context + 0] * tempFrame
      output[outputOffset + 1] =
        input[inputOffset + 1] * fi + this.midBuffer[context + 1] * tempFrame
    }
  }

  /**
   * 变速不变调
   * @param pcm - pcm 变速变调处理后的音频数据
   * @returns 处理后的数据
   */
  process(pcm: Float32Array): Float32Array {
    this.outputBuffer = new SampleBuffer()
    this.inputBuffer.putSamples(pcm, 0, -1)
    while (this.inputBuffer.frameCount >= this.sampleReq) {
      /** overlap 部分 */
      const offset = this.seekBestOverlapPosition()
      this.outputBuffer.ensureAdditionalCapacity(this.overlapLength)
      this.overlap(Math.floor(offset))
      this.outputBuffer.put(this.overlapLength)
      /** 剩余部分 */
      let temp = this.seekWindowLength - 2 * this.overlapLength
      if (temp > 0) {
        this.outputBuffer.putBuffer(
          this.inputBuffer,
          offset + this.overlapLength,
          temp
        )
      }
      /** 下一次参考帧 overlap 部分 */
      const start =
        this.inputBuffer.startIndex +
        2 * (offset + this.seekWindowLength - this.overlapLength)
      this.midBuffer.set(
        this.inputBuffer.vector.subarray(start, start + 2 * this.overlapLength)
      )
      /** 计算输入跳过的部分位置 */
      this.skipFract += this.nominalSkip
      const overlapSkip = ~~this.skipFract
      this.skipFract -= overlapSkip
      this.inputBuffer.receive(overlapSkip)
    }
    return this.outputBuffer.vector
  }
}
