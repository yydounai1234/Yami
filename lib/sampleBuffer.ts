export default class SampleBuffer {
  public _vector = new Float32Array()
  public _position = 0
  public _frameCount = 0

  get vector() {
    return this._vector
  }

  get position() {
    return this._position
  }

  get startIndex() {
    return this._position * 2
  }

  get frameCount() {
    return this._frameCount
  }

  get endIndex() {
    return (this._position + this._frameCount) * 2
  }

  clear() {
    this.receive(this._frameCount)
    this.rewind()
  }

  put(numFrames: number) {
    this._frameCount += numFrames
  }

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

  putBuffer(buffer: SampleBuffer, position: number, numFrames = 0) {
    position = position || 0
    if (!(numFrames >= 0)) {
      numFrames = buffer.frameCount - position
    }
    this.putSamples(buffer.vector, buffer.position + position, numFrames)
  }

  receive(numFrames: number) {
    if (!(numFrames >= 0) || numFrames > this._frameCount) {
      numFrames = this.frameCount
    }
    this._frameCount -= numFrames
    this._position += numFrames
  }

  receiveSamples(output: Float32Array, numFrames = 0) {
    const numSamples = numFrames * 2
    const sourceOffset = this.startIndex
    output.set(this._vector.subarray(sourceOffset, sourceOffset + numSamples))
    this.receive(numFrames)
  }

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

  ensureAdditionalCapacity(numFrames = 0) {
    this.ensureCapacity(this._frameCount + numFrames)
  }

  rewind() {
    if (this._position > 0) {
      this._vector.set(this._vector.subarray(this.startIndex, this.endIndex))
      this._position = 0
    }
  }
}
