/**
 * Track 类
 * @remarks 将每一个音频细分为一个音频轨
 */
import SoundTouch from './sound'
import SampleBuffer from './sampleBuffer'
/**
 * 音频轨类型
 * @public
 */
export enum TrackType {
  URL = 'URL',
  BUFFER = 'BUFFER',
  MICROPHONE = 'MICROPHONE',
}
const BUFFER_SIZE = 16384

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
 * @public
 */
export default class Track {
  private bufferSize = BUFFER_SIZE
  private sourceNode: AudioBufferSourceNode | MediaStreamAudioSourceNode
  private scriptNode: ScriptProcessorNode
  private soundTouch = new SoundTouch()
  private processBuffer = new SampleBuffer()
  constructor(
    private source: AudioBuffer | MediaStream,
    private audioContext: AudioContext,
    public type: TrackType
  ) {
    if (isAudioBuffer(this.source)) {
      this.sourceNode = this.audioContext.createBufferSource()
      this.sourceNode.buffer = this.source
    } else {
      this.sourceNode = this.audioContext.createMediaStreamSource(this.source)
    }
    this.scriptNode = this.audioContext.createScriptProcessor(
      this.bufferSize,
      2,
      2
    )
    this.sourceNode.connect(this.scriptNode)
    this.scriptNode.connect(this.audioContext.destination)
  }

  set pitch(newVal: number) {
    this.soundTouch.pitch = newVal
  }

  /**
   * 获取变调
   */
  get pitch() {
    return this.soundTouch.pitch
  }

  /**
   * 播放
   */
  async play() {
    let playFlag = false
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
    isAudioBufferSourceNode(this.sourceNode) && this.sourceNode.start()
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
      throw '麦克风流不允许获取数据'
    }
  }
}
