import Track, { TrackType } from './track'
/**
 * Yaml 类
 * @public
 * @remarks 主要用于创建各种音频轨
 */
export default class Yami {
  private audioContext = new AudioContext()

  /**
   * 根据 url 创建音频轨
   * @param url - 音频地址
   * @returns 音频轨
   */
  async createURLTrack(url: string): Promise<Track> {
    return new Promise(async (resolve) => {
      const response = await fetch(url)
      const buffer = await response.arrayBuffer()
      this.audioContext.decodeAudioData(buffer, async (audioBuffer) => {
        const track = new Track(audioBuffer, this.audioContext, TrackType.URL)
        resolve(track)
      })
    })
  }
  /**
   * 根据 buffer 创建音频轨
   * @param buffer - 音频数据
   * @returns 音频轨
   */
  async createBufferTrack(buffer: ArrayBuffer): Promise<Track> {
    return new Promise(async (resolve) => {
      this.audioContext.decodeAudioData(buffer, async (audioBuffer) => {
        const track = new Track(
          audioBuffer,
          this.audioContext,
          TrackType.BUFFER
        )
        resolve(track)
      })
    })
  }
  /**
   * 根据麦克风创建音频轨
   * @param config - 音频配置项 @see [MediaTrackConstraints - Wikipedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints)
   * @returns 音频轨
   */
  async createMicrophoneTrack(config: MediaTrackConstraints | boolean = true): Promise<Track> {
    return new Promise(async (resolve) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: config,
        video: false,
      })
      const track = new Track(stream, this.audioContext, TrackType.MICROPHONE)
      resolve(track)
    })
  }
}
