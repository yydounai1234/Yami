var U = Object.defineProperty;
var x = (a, t, e) => t in a ? U(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var r = (a, t, e) => (x(a, typeof t != "symbol" ? t + "" : t, e), e);
class N {
  constructor() {
    r(this, "_rate", 1);
    r(this, "slopeCount", 0);
    r(this, "prevSampleL", 0);
    r(this, "prevSampleR", 0);
    this.reset();
  }
  reset() {
    this.slopeCount = 0, this.prevSampleL = 0, this.prevSampleR = 0;
  }
  set rate(t) {
    this._rate = t;
  }
  get rate() {
    return this._rate;
  }
  process(t) {
    const e = t.length / 2, s = t, i = new Float32Array(~~(t.length / this.rate));
    let o = 0, n = 0;
    for (; this.slopeCount < 1; )
      i[2 * n] = (1 - this.slopeCount) * this.prevSampleL + this.slopeCount * s[0], i[2 * n + 1] = (1 - this.slopeCount) * this.prevSampleR + this.slopeCount * s[1], n = n + 1, this.slopeCount += this.rate;
    if (this.slopeCount -= 1, e !== 1) {
      t:
        for (; ; ) {
          for (; this.slopeCount > 1; )
            if (this.slopeCount -= 1, o = o + 1, o >= e - 1)
              break t;
          const h = 2 * o;
          i[2 * n] = (1 - this.slopeCount) * s[h] + this.slopeCount * s[h + 2], i[2 * n + 1] = (1 - this.slopeCount) * s[h + 1] + this.slopeCount * s[h + 3], n = n + 1, this.slopeCount += this.rate;
        }
    }
    return this.prevSampleL = s[2 * e - 2], this.prevSampleR = s[2 * e - 1], i;
  }
}
const g = (a, t) => (a > t ? a - t : t - a) > 1e-10, B = (a, t, e) => a < t ? t : a > e ? e : a;
class l {
  constructor() {
    r(this, "_vector", new Float32Array());
    r(this, "_position", 0);
    r(this, "_frameCount", 0);
  }
  get vector() {
    return this._vector;
  }
  get position() {
    return this._position;
  }
  get startIndex() {
    return this._position * 2;
  }
  get frameCount() {
    return this._frameCount;
  }
  get endIndex() {
    return (this._position + this._frameCount) * 2;
  }
  clear() {
    this.receive(this._frameCount), this.rewind();
  }
  put(t) {
    this._frameCount += t;
  }
  putSamples(t, e, s) {
    e = e || 0;
    const i = e * 2;
    s >= 0 || (s = (t.length - i) / 2);
    const o = s * 2;
    this.ensureCapacity(s + this._frameCount);
    const n = this.endIndex;
    this.vector.set(
      t.subarray(i, i + o),
      n
    ), this._frameCount += s;
  }
  putBuffer(t, e, s = 0) {
    e = e || 0, s >= 0 || (s = t.frameCount - e), this.putSamples(t.vector, t.position + e, s);
  }
  receive(t) {
    (!(t >= 0) || t > this._frameCount) && (t = this.frameCount), this._frameCount -= t, this._position += t;
  }
  receiveSamples(t, e = 0) {
    const s = e * 2, i = this.startIndex;
    t.set(this._vector.subarray(i, i + s)), this.receive(e);
  }
  ensureCapacity(t = 0) {
    const e = ~~(t * 2);
    if (this._vector.length < e) {
      const s = new Float32Array(e);
      s.set(this._vector.subarray(this.startIndex, this.endIndex)), this._vector = s, this._position = 0;
    } else
      this.rewind();
  }
  ensureAdditionalCapacity(t = 0) {
    this.ensureCapacity(this._frameCount + t);
  }
  rewind() {
    this._position > 0 && (this._vector.set(this._vector.subarray(this.startIndex, this.endIndex)), this._position = 0);
  }
}
const I = 0, E = I, P = 0, A = P, L = 8, d = 0.5, T = 2, m = 125, k = 50, M = (k - m) / (T - d), F = m - M * d, v = 25, R = 15, y = (R - v) / (T - d), b = v - y * d, w = [
  [
    124,
    186,
    248,
    310,
    372,
    434,
    496,
    558,
    620,
    682,
    744,
    806,
    868,
    930,
    992,
    1054,
    1116,
    1178,
    1240,
    1302,
    1364,
    1426,
    1488,
    0
  ],
  [
    -100,
    -75,
    -50,
    -25,
    25,
    50,
    75,
    100,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ],
  [
    -20,
    -15,
    -10,
    -5,
    5,
    10,
    15,
    20,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ],
  [-4, -3, -2, -1, 1, 2, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
], D = 16384;
class q {
  constructor() {
    r(this, "_tempo", 1);
    r(this, "autoSeqSetting", !0);
    r(this, "autoSeekSetting", !0);
    r(this, "overlapLength", 0);
    r(this, "midBuffer", new Float32Array());
    r(this, "refMidBuffer", new Float32Array());
    r(this, "sampleRate", 44100);
    r(this, "overlapMs", L);
    r(this, "sequenceMs", E);
    r(this, "seekWindowMs", A);
    r(this, "seekWindowLength", 0);
    r(this, "seekLength", 0);
    r(this, "sampleReq", 0);
    r(this, "nominalSkip", 0);
    r(this, "skipFract", 0);
    r(this, "inputBuffer", new l());
    r(this, "outputBuffer", new l());
    this.setParameters(
      44100,
      E,
      A,
      L
    );
  }
  setParameters(t, e, s, i) {
    t > 0 && (this.sampleRate = t), i > 0 && (this.overlapMs = i), e > 0 ? (this.sequenceMs = e, this.autoSeqSetting = !1) : this.autoSeqSetting = !0, s > 0 ? (this.seekWindowMs = s, this.autoSeekSetting = !1) : this.autoSeekSetting = !0, this.calculateSequenceParameters(), this.calculateOverlapLength(this.overlapMs), this.tempo = this._tempo;
  }
  calculateSequenceParameters() {
    if (this.autoSeqSetting) {
      let t = F + M * this._tempo;
      t = B(t, k, m), this.sequenceMs = Math.floor(t + 0.5);
    }
    if (this.autoSeekSetting) {
      let t = b + y * this._tempo;
      t = B(
        t,
        R,
        v
      ), this.seekWindowMs = Math.floor(t + 0.5);
    }
    this.seekWindowLength = Math.floor(
      this.sampleRate * this.sequenceMs / 1e3
    ), this.seekLength = Math.floor(this.sampleRate * this.seekWindowMs / 1e3);
  }
  calculateOverlapLength(t = 0) {
    let e = this.sampleRate * t / 1e3;
    e = e < 16 ? 16 : e, e -= e % 8, this.overlapLength = e, this.refMidBuffer = new Float32Array(this.overlapLength * 2), this.midBuffer = new Float32Array(this.overlapLength * 2);
  }
  set tempo(t) {
    this._tempo = t, this.calculateSequenceParameters(), this.nominalSkip = this._tempo * (this.seekWindowLength - this.overlapLength);
    let e = Math.floor(this.nominalSkip + 0.5);
    this.sampleReq = Math.max(e + this.overlapLength, this.seekWindowLength) + this.seekLength;
  }
  get tempo() {
    return this._tempo;
  }
  seekBestOverlapPosition() {
    this.preCalculateCorrelationReferenceStereo();
    let t = Number.MIN_VALUE, e = 0, s = 0, i = 0;
    for (let o = 0; o < 4; o = o + 1) {
      let n = 0;
      for (; w[o][n] && (i = s + w[o][n], !(i >= this.seekLength)); ) {
        let h = this.calculateCrossCorrelationStereo(
          2 * i,
          this.refMidBuffer
        );
        h > t && (t = h, e = i), n = n + 1;
      }
      s = e;
    }
    return e;
  }
  preCalculateCorrelationReferenceStereo() {
    for (let t = 0; t < this.overlapLength; t = t + 1) {
      let e = t * (this.overlapLength - t), s = t * 2;
      this.refMidBuffer[s] = this.midBuffer[s] * e, this.refMidBuffer[s + 1] = this.midBuffer[s + 1] * e;
    }
  }
  calculateCrossCorrelationStereo(t, e) {
    const s = this.inputBuffer.vector;
    t += this.inputBuffer.startIndex;
    let i = 0;
    const o = 2 * this.overlapLength;
    for (let n = 2; n < o; n = n + 2) {
      let h = n + t;
      i += s[h] * e[n] + s[h + 1] * e[n + 1];
    }
    return i;
  }
  overlap(t) {
    let e = 2 * t;
    const s = this.inputBuffer.vector;
    e += this.inputBuffer.startIndex;
    const i = this.outputBuffer.vector, o = this.outputBuffer.endIndex, n = 1 / this.overlapLength;
    for (let h = 0; h < this.overlapLength; h = h + 1) {
      let c = (this.overlapLength - h) * n, u = h * n, f = 2 * h, _ = f + e, C = f + o;
      i[C + 0] = s[_ + 0] * u + this.midBuffer[f + 0] * c, i[C + 1] = s[_ + 1] * u + this.midBuffer[f + 1] * c;
    }
  }
  process(t) {
    for (this.outputBuffer = new l(), this.inputBuffer.putSamples(t, 0, -1); this.inputBuffer.frameCount >= this.sampleReq; ) {
      const e = this.seekBestOverlapPosition();
      this.outputBuffer.ensureAdditionalCapacity(this.overlapLength), this.overlap(Math.floor(e)), this.outputBuffer.put(this.overlapLength);
      let s = this.seekWindowLength - 2 * this.overlapLength;
      s > 0 && this.outputBuffer.putBuffer(
        this.inputBuffer,
        e + this.overlapLength,
        s
      );
      const i = this.inputBuffer.startIndex + 2 * (e + this.seekWindowLength - this.overlapLength);
      this.midBuffer.set(
        this.inputBuffer.vector.subarray(i, i + 2 * this.overlapLength)
      ), this.skipFract += this.nominalSkip;
      const o = ~~this.skipFract;
      this.skipFract -= o, this.inputBuffer.receive(o);
    }
    return this.outputBuffer.vector;
  }
}
class W {
  constructor() {
    r(this, "_rate", 0);
    r(this, "_tempo", 0);
    r(this, "virtualPitch", 1);
    r(this, "virtualRate", 1);
    r(this, "virtualTempo", 1);
    r(this, "transposer", new N());
    r(this, "stretch", new q());
    this.calculateEffectiveRateAndTempo();
  }
  get rate() {
    return this._rate;
  }
  set rate(t) {
    this.virtualRate = t, this.calculateEffectiveRateAndTempo();
  }
  set rateChange(t) {
    this._rate = 1 + 0.01 * t;
  }
  get tempo() {
    return this._tempo;
  }
  set tempo(t) {
    this.virtualTempo = t, this.calculateEffectiveRateAndTempo();
  }
  set tempoChange(t) {
    this.tempo = 1 + 0.01 * t;
  }
  set pitch(t) {
    this.virtualPitch = t, this.calculateEffectiveRateAndTempo();
  }
  set pitchOctaves(t) {
    this.pitch = Math.exp(0.69314718056 * t), this.calculateEffectiveRateAndTempo();
  }
  set pitchSemitones(t) {
    this.pitchOctaves = t / 12;
  }
  calculateEffectiveRateAndTempo() {
    const t = this._tempo, e = this._rate;
    this._tempo = this.virtualTempo / this.virtualPitch, this._rate = this.virtualRate * this.virtualPitch, g(this._tempo, t) && (this.stretch.tempo = this._tempo), g(this._rate, e) && (this.transposer.rate = this._rate);
  }
  process(t) {
    if (this.rate > 1) {
      const e = this.stretch.process(t);
      return this.transposer.process(e);
    } else {
      const e = this.transposer.process(t);
      return this.stretch.process(e);
    }
  }
}
var p = /* @__PURE__ */ ((a) => (a.URL = "URL", a.BUFFER = "BUFFER", a.MICROPHONE = "MICROPHONE", a))(p || {});
const K = D, Q = (a) => a instanceof AudioBufferSourceNode, O = (a) => a instanceof AudioBuffer;
class S {
  constructor(t, e, s) {
    r(this, "bufferSize", K);
    r(this, "sourceNode");
    r(this, "scriptNode");
    r(this, "soundTouch", new W());
    r(this, "processBuffer", new l());
    this.source = t, this.audioContext = e, this.type = s, O(this.source) ? (this.sourceNode = this.audioContext.createBufferSource(), this.sourceNode.buffer = this.source) : this.sourceNode = this.audioContext.createMediaStreamSource(this.source), this.scriptNode = this.audioContext.createScriptProcessor(
      this.bufferSize,
      2,
      2
    ), this.sourceNode.connect(this.scriptNode), this.scriptNode.connect(this.audioContext.destination);
  }
  set pitch(t) {
    this.soundTouch.pitch = t;
  }
  get pitch() {
    return this.soundTouch.pitch;
  }
  async play() {
    let t = !1;
    this.scriptNode.onaudioprocess = async (e) => {
      const s = e.outputBuffer, i = e.inputBuffer, o = new Float32Array(this.bufferSize * 2), n = i.getChannelData(0), h = i.numberOfChannels > 1 ? i.getChannelData(1) : i.getChannelData(0);
      for (let u = 0; u < o.length; u++)
        o[u * 2] = n[u], o[u * 2 + 1] = h[u];
      const c = this.soundTouch.process(o);
      if (this.processBuffer.putSamples(c, 0, -1), t) {
        this.processBuffer.receiveSamples(o, this.bufferSize);
        for (let u = 0; u < o.length; u++)
          s.getChannelData(0)[u] = o[u * 2], s.getChannelData(1)[u] = o[u * 2 + 1];
      } else
        this.processBuffer.frameCount >= this.bufferSize * 2 && (t = !0);
    }, Q(this.sourceNode) && this.sourceNode.start();
  }
  process() {
    if (O(this.source)) {
      const t = new Float32Array(this.source.length * 2), e = this.source.getChannelData(0), s = this.source.numberOfChannels > 1 ? this.source.getChannelData(1) : this.source.getChannelData(0);
      for (let i = 0; i < t.length; i++)
        t[i * 2] = e[i], t[i * 2 + 1] = s[i];
      return this.soundTouch.process(t);
    } else
      return new Float32Array();
  }
}
class H {
  constructor() {
    r(this, "audioContext", new AudioContext());
  }
  async createURLTrack(t) {
    return new Promise(async (e) => {
      const i = await (await fetch(t)).arrayBuffer();
      this.audioContext.decodeAudioData(i, async (o) => {
        const n = new S(o, this.audioContext, p.URL);
        e(n);
      });
    });
  }
  async createBufferTrack(t) {
    return new Promise(async (e) => {
      this.audioContext.decodeAudioData(t, async (s) => {
        const i = new S(
          s,
          this.audioContext,
          p.BUFFER
        );
        e(i);
      });
    });
  }
  async createMicrophoneTrack(t = !0) {
    return new Promise(async (e) => {
      const s = await navigator.mediaDevices.getUserMedia({
        audio: t,
        video: !1
      }), i = new S(s, this.audioContext, p.MICROPHONE);
      e(i);
    });
  }
}
export {
  S as Track,
  H as Yami
};
