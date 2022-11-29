/**
 * FIFO buffer 类
 * @remarks 主要用于 wsola 算法需要预测下一帧，每次 audio input 长度不等于 audio output 长度
 */
export default class SampleBuffer {
  public _vector = new Float32Array()
  public _position = 0
  public _frameCount = 0

  /**
   *  buffer 内容
   */
  get vector() {
    return this._vector
  }

  /**
   * 当前位置
   */
  get position() {
    return this._position
  }

  /**
   * 当前 buffer 初始位置
   */
  get startIndex() {
    return this._position * 2
  }

  /**
   * 当前 buffer 所有的帧数
   */
  get frameCount() {
    return this._frameCount
  }

  /**
   * 当前 buffer 的结束位置
   */
  get endIndex() {
    return (this._position + this._frameCount) * 2
  }

  /**
   * 清楚数据
   */
  clear() {
    this.receive(this._frameCount)
    this.rewind()
  }

  /**
   * 新增当前 buffer 帧数
   * @param numFrames 帧数
   */
  put(numFrames: number) {
    this._frameCount += numFrames
  }

  /**
   * 添加 buffer
   * @param samples 添加的 buffer
   * @param position 添加 buffer 的位置
   * @param numFrames 添加的 buffer 的帧数
   */
  putSamples(samples: Float32Array, position: number, numFrames: number) {
    position = position || 0
    const sourceOffset = position * 2
    if (!(numFrames >= 0)) {
      numFrames = (samples.length - sourceOffset) / 2
    }
    const numSamples = numFrames * 2

    this.ensureCapacity(numFrames + this._frameCount)

    const destOffset = this.endIndex
    this.vector.set(
      samples.subarray(sourceOffset, sourceOffset + numSamples),
      destOffset
    )

    this._frameCount += numFrames
  }

  /**
   * 添加 SampleBuffer
   * @param buffer 添加的 SampleBuffer
   * @param position 添加 SampleBuffer 的位置
   * @param numFrames 添加的 SampleBuffer 的帧数
   */
  putBuffer(buffer: SampleBuffer, position: number, numFrames = 0) {
    position = position || 0
    if (!(numFrames >= 0)) {
      numFrames = buffer.frameCount - position
    }
    this.putSamples(buffer.vector, buffer.position + position, numFrames)
  }

  /**
   * 调整当前 buffer 位置以及帧数
   * @param numFrames 帧数
   */
  receive(numFrames: number) {
    if (!(numFrames >= 0) || numFrames > this._frameCount) {
      numFrames = this.frameCount
    }
    this._frameCount -= numFrames
    this._position += numFrames
  }

  /**
   * 流出 bufer
   * @param output 输出的 buffer
   * @param numFrames 输出的 buffer 帧数
   */
  receiveSamples(output: Float32Array, numFrames = 0) {
    const numSamples = numFrames * 2
    const sourceOffset = this.startIndex
    output.set(this._vector.subarray(sourceOffset, sourceOffset + numSamples))
    this.receive(numFrames)
  }

  /**
   * 确保所添加的帧数与原有数据是否满足 buffer 大小
   * @param numFrames 帧数
   */
  ensureCapacity(numFrames = 0) {
    const minLength = ~~(numFrames * 2)
    if (this._vector.length < minLength) {
      const newVector = new Float32Array(minLength)
      newVector.set(this._vector.subarray(this.startIndex, this.endIndex))
      this._vector = newVector
      this._position = 0
    } else {
      this.rewind()
    }
  }

  /**
   * 确保所添加的帧数是否满足 buffer 大小
   * @param numFrames 
   */
  ensureAdditionalCapacity(numFrames = 0) {
    this.ensureCapacity(this._frameCount + numFrames)
  }

  /**
   * 清楚不必要的 buffer 内容
   */
  rewind() {
    if (this._position > 0) {
      this._vector.set(this._vector.subarray(this.startIndex, this.endIndex))
      this._position = 0
    }
  }
}
