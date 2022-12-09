/**
 * Track 类
 * @remarks 将每一个音频细分为一个音频轨
 */
import SoundTouch from './sound'
import SampleBuffer from './sampleBuffer'
import * as CONSTANT from './constant'
/**
 * 音频轨类型
 * @public
 */
export enum TrackType {
  /**
   * 输入为 url 链接
   */
  URL = 'URL',
  /**
   * 输入为音频文件
   */
  BUFFER = 'BUFFER',
  /**
   * 输入为音频流
   */
  MICROPHONE = 'MICROPHONE',
}
const BUFFER_SIZE = CONSTANT.BUFFER_SIZE

const isAudioBufferSourceNode = (
  type: AudioBufferSourceNode | MediaStreamAudioSourceNode
): type is AudioBufferSourceNode => {
  return type instanceof AudioBufferSourceNode
}

const isAudioBuffer = (
  type: AudioBuffer | MediaStream
): type is AudioBuffer => {
  return type instanceof AudioBuffer
}
/**
 * 音频类
 * @public
 * @remarks 主要用于播放音频以及获取音频内容
 */
export default class Track {
  private sourceDuration = {
    startTime: 0,
    pauseTime: 0,
    lastPauseTime: 0,
    offsetTime: 0,
  }
  private bufferSize = BUFFER_SIZE
  private sourceNode:
    | AudioBufferSourceNode
    | MediaStreamAudioSourceNode
    | undefined
  private scriptNode: ScriptProcessorNode | undefined
  private soundTouch = new SoundTouch()
  private processBuffer = new SampleBuffer()
  private gainNode: GainNode | undefined
  private analyserNode: AnalyserNode | undefined
  constructor(
    private source: AudioBuffer | MediaStream,
    private audioContext: AudioContext,
    public type: TrackType
  ) {
    this.init()
  }

  init() {
    if (isAudioBuffer(this.source)) {
      this.sourceNode = this.audioContext.createBufferSource()
      this.sourceNode.buffer = this.source
      this.sourceNode.addEventListener('ended', () => {
        this.release()
      })
    } else {
      this.sourceNode = this.audioContext.createMediaStreamSource(this.source)
    }
    this.scriptNode = this.audioContext.createScriptProcessor(
      this.bufferSize,
      2,
      2
    )
    this.analyserNode = this.audioContext.createAnalyser()
    this.sourceNode.connect(this.analyserNode)
    this.analyserNode.connect(this.scriptNode)
    this.gainNode = this.audioContext.createGain()
    this.scriptNode.connect(this.gainNode)
    this.gainNode.connect(this.audioContext.destination)
  }

  /**
   * 获取变调
   */
  get pitch() {
    return this.soundTouch.pitch
  }

  set pitch(newVal: number) {
    this.soundTouch.pitch = newVal
  }

  /** 获取傅立叶变化窗口大小 */
  set fftSize(newVal: number) {
    this.analyserNode && (this.analyserNode.fftSize = newVal)
  }

  get fftSize() {
    return this.analyserNode ? this.analyserNode.fftSize : -1
  }

  /**
   * 获取音量
   */
  get volume() {
    return this.gainNode ? this.gainNode.gain.value : -1
  }

  set volume(newVal: number) {
    this.gainNode && (this.gainNode.gain.value = newVal)
  }

  /**
   * 获取音频时长
   */
  get duration() {
    if (isAudioBuffer(this.source)) {
      return this.source.duration
    } else {
      return -1
    }
  }

  /**
   * 获取当前时间
   */
  get currentTime() {
    let baseTime = this.audioContext.currentTime
    if (this.sourceDuration.lastPauseTime) {
      baseTime = this.sourceDuration.lastPauseTime
    }
    const currentTime =
      this.sourceDuration.offsetTime +
      baseTime -
      this.sourceDuration.startTime -
      this.sourceDuration.pauseTime
    return currentTime
  }

  /**
   * 播放
   */
  async play(offset = 0) {
    let playFlag = this.type === TrackType.MICROPHONE
    if (this.scriptNode) {
      this.scriptNode.onaudioprocess = async (audioProcessingEvent) => {
        const outputBuffer = audioProcessingEvent.outputBuffer
        const inputBuffer = audioProcessingEvent.inputBuffer
        const buffer = new Float32Array(this.bufferSize * 2)
        const left = inputBuffer.getChannelData(0)
        const right =
          inputBuffer.numberOfChannels > 1
            ? inputBuffer.getChannelData(1)
            : inputBuffer.getChannelData(0)

        for (let i = 0; i < buffer.length; i++) {
          buffer[i * 2] = left[i]
          buffer[i * 2 + 1] = right[i]
        }

        const processBuffer = this.soundTouch.process(buffer)
        this.processBuffer.putSamples(processBuffer, 0, -1)
        if (playFlag) {
          this.processBuffer.receiveSamples(buffer, this.bufferSize)
          for (let i = 0; i < buffer.length; i++) {
            outputBuffer.getChannelData(0)[i] = buffer[i * 2]
            outputBuffer.getChannelData(1)[i] = buffer[i * 2 + 1]
          }
        } else {
          if (this.processBuffer.frameCount >= this.bufferSize * 2) {
            playFlag = true
          }
        }
      }
    }
    if (this.sourceNode && isAudioBufferSourceNode(this.sourceNode)) {
      this.sourceDuration.startTime = this.audioContext.currentTime
      this.sourceDuration.offsetTime = offset
      this.sourceNode.start(0, offset)
    }
  }

  /**
   * 恢复
   */
  public resume() {
    if (this.sourceNode && isAudioBufferSourceNode(this.sourceNode)) {
      this.sourceNode.playbackRate.value = 1
      this.sourceDuration.pauseTime +=
        this.audioContext.currentTime - this.sourceDuration.lastPauseTime
      this.sourceDuration.lastPauseTime = 0
    }
  }

  /**
   * 暂停
   */
  public pause() {
    if (this.sourceNode && isAudioBufferSourceNode(this.sourceNode)) {
      this.sourceNode.playbackRate.value = Number.MIN_VALUE
      if (!this.sourceDuration.lastPauseTime) {
        this.sourceDuration.lastPauseTime = this.audioContext.currentTime
      }
    }
  }

  /**
   * seek
   * @param time seek 指定时间
   */
  seek(time: number) {
    this.release()
    this.init()
    this.play(time)
  }

  /**
   * 获取数据
   * @remarks 该接口会造成 UI/JS 线程阻塞
   * @returns 获取处理后的数据
   */
  process(): Float32Array {
    if (isAudioBuffer(this.source)) {
      const source = new Float32Array(this.source.length * 2)
      const left = this.source.getChannelData(0)
      const right =
        this.source.numberOfChannels > 1
          ? this.source.getChannelData(1)
          : this.source.getChannelData(0)
      for (let i = 0; i < source.length; i++) {
        source[i * 2] = left[i]
        source[i * 2 + 1] = right[i]
      }
      return this.soundTouch.process(source)
    } else {
      return new Float32Array()
    }
  }

  /**
   *  释放资源
   */
  release() {
    if (this.sourceNode) {
      this.gainNode && this.gainNode.disconnect()
      this.analyserNode && this.analyserNode.disconnect()
      this.sourceNode.disconnect()
      this.scriptNode && this.scriptNode.disconnect()
      if (!isAudioBufferSourceNode(this.sourceNode)) {
        this.sourceNode.mediaStream.getTracks().forEach((track) => {
          track.stop()
        })
      } else {
        this.resetSourceDuration()
        this.sourceNode.onended = null
      }
    }
  }

  /**
   * 绘制时域图片
   */
  getTimeDomainData(): Uint8Array {
    if (this.analyserNode) {
      const bufferLength = this.analyserNode.fftSize
      const dataArray = new Uint8Array(bufferLength)
      this.analyserNode.getByteTimeDomainData(dataArray)
      return dataArray
    } else {
      throw "error"
    }
  }

  /**
   * 绘制频域图片
   */
  getFrequencyDomainData(): Uint8Array {
    if (this.analyserNode) {
      const bufferLength = this.analyserNode.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      this.analyserNode.getByteFrequencyData(dataArray)
      return dataArray
    } else {
      throw "error"
    }
  }

  private resetSourceDuration(): void {
    this.processBuffer = new SampleBuffer()
    this.sourceDuration = {
      offsetTime: 0,
      startTime: 0,
      lastPauseTime: 0,
      pauseTime: 0,
    }
  }
}
