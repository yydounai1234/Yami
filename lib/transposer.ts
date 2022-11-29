/**
 * RateTransposer 类
 */
export default class RateTransposer {
  private _rate = 1
  private slopeCount = 0
  /**
   * 上一个左声道的采样值
   */
  private prevSampleL = 0
  /**
   * 上一个右声道的采样值
   */
  private prevSampleR = 0
  constructor() {
    this.reset()
  }
  reset() {
    this.slopeCount = 0
    this.prevSampleL = 0
    this.prevSampleR = 0
  }

  /**
   * 设置变速
   */
  set rate(newVal) {
    this._rate = newVal
  }

  /**
   * 获取变速
   */
  get rate() {
    return this._rate
  }

  /**
   * 处理数据
   * @remarks 变速变调
   * @param pcm - pcm 音频数据
   * @returns 变速变调后的数据
   */
  process(pcm: Float32Array) {
    const frames = pcm.length / 2
    const src = pcm
    const dest = new Float32Array(~~(pcm.length / this.rate))
    let used = 0
    let i = 0
    while (this.slopeCount < 1.0) {
      dest[2 * i] =
        (1.0 - this.slopeCount) * this.prevSampleL + this.slopeCount * src[0]
      dest[2 * i + 1] =
        (1.0 - this.slopeCount) * this.prevSampleR + this.slopeCount * src[1]
      i = i + 1
      this.slopeCount += this.rate
    }
    this.slopeCount -= 1.0
    if (frames !== 1) {
      out: while (true) {
        while (this.slopeCount > 1.0) {
          this.slopeCount -= 1.0
          used = used + 1
          if (used >= frames - 1) {
            break out
          }
        }
        const srcIndex = 2 * used
        dest[2 * i] =
          (1.0 - this.slopeCount) * src[srcIndex] +
          this.slopeCount * src[srcIndex + 2]
        dest[2 * i + 1] =
          (1.0 - this.slopeCount) * src[srcIndex + 1] +
          this.slopeCount * src[srcIndex + 3]
        i = i + 1
        this.slopeCount += this.rate
      }
    }
    this.prevSampleL = src[2 * frames - 2]
    this.prevSampleR = src[2 * frames - 1]
    return dest
  }
}
