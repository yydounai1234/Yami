/**
 * SoundTouch 类
 * @remarks 与原生 SoundTouch 类似，将输入数据通过 Strech 与 Transposer 类实现
 */

import RateTransposer from './transposer'
import { testFloatEqual } from './utils'
import Stretch from './strech'
export default class SoundTouch {
  private _rate = 0
  private _tempo = 0
  private virtualPitch = 1
  private virtualRate = 1
  private virtualTempo = 1
  private transposer = new RateTransposer()
  private stretch = new Stretch()
  constructor() {
    this.calculateEffectiveRateAndTempo()
  }

  get rate() {
    return this._rate
  }

  set rate(rate) {
    this.virtualRate = rate
    this.calculateEffectiveRateAndTempo()
  }

  set rateChange(rateChange: number) {
    this._rate = 1.0 + 0.01 * rateChange
  }

  get tempo() {
    return this._tempo
  }

  set tempo(tempo) {
    this.virtualTempo = tempo
    this.calculateEffectiveRateAndTempo()
  }

  set tempoChange(tempoChange: number) {
    this.tempo = 1.0 + 0.01 * tempoChange
  }

  set pitch(pitch: number) {
    this.virtualPitch = pitch
    this.calculateEffectiveRateAndTempo()
  }

  set pitchOctaves(pitchOctaves: number) {
    this.pitch = Math.exp(0.69314718056 * pitchOctaves)
    this.calculateEffectiveRateAndTempo()
  }

  set pitchSemitones(pitchSemitones: number) {
    this.pitchOctaves = pitchSemitones / 12.0
  }

  /**
   * 计算 rate 与 tempo
   * @remarks rate 为调整采样率，tempo 为 overlap 
   */
  calculateEffectiveRateAndTempo() {
    const previousTempo = this._tempo
    const previousRate = this._rate

    this._tempo = this.virtualTempo / this.virtualPitch
    this._rate = this.virtualRate * this.virtualPitch

    if (testFloatEqual(this._tempo, previousTempo)) {
      this.stretch.tempo = this._tempo
    }
    if (testFloatEqual(this._rate, previousRate)) {
      this.transposer.rate = this._rate
    }
  }

  /**
   * 处理数据
   * @param pcm - 音频原始数据
   * @returns 处理后的数据
   */
  process(pcm: Float32Array): Float32Array {
    if (this.rate > 1) {
      const intermediateBuffer = this.stretch.process(pcm)
      return this.transposer.process(intermediateBuffer)
    } else {
      const intermediateBuffer = this.transposer.process(pcm)
      return this.stretch.process(intermediateBuffer)
    }
  }
}
