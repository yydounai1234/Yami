var x = Object.defineProperty;
var D = (a, t, e) => t in a ? x(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var r = (a, t, e) => (D(a, typeof t != "symbol" ? t + "" : t, e), e);
class U {
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
    let n = 0, o = 0;
    for (; this.slopeCount < 1; )
      i[2 * o] = (1 - this.slopeCount) * this.prevSampleL + this.slopeCount * s[0], i[2 * o + 1] = (1 - this.slopeCount) * this.prevSampleR + this.slopeCount * s[1], o = o + 1, this.slopeCount += this.rate;
    if (this.slopeCount -= 1, e !== 1) {
      t:
        for (; ; ) {
          for (; this.slopeCount > 1; )
            if (this.slopeCount -= 1, n = n + 1, n >= e - 1)
              break t;
          const h = 2 * n;
          i[2 * o] = (1 - this.slopeCount) * s[h] + this.slopeCount * s[h + 2], i[2 * o + 1] = (1 - this.slopeCount) * s[h + 1] + this.slopeCount * s[h + 3], o = o + 1, this.slopeCount += this.rate;
        }
    }
    return this.prevSampleL = s[2 * e - 2], this.prevSampleR = s[2 * e - 1], i;
  }
}
const B = (a, t) => (a > t ? a - t : t - a) > 1e-10, N = (a, t, e) => a < t ? t : a > e ? e : a;
class c {
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
    const n = s * 2;
    this.ensureCapacity(s + this._frameCount);
    const o = this.endIndex;
    this.vector.set(
      t.subarray(i, i + n),
      o
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
const P = 0, E = P, I = 0, A = I, L = 8, m = 0.5, O = 2, S = 125, k = 50, R = (k - S) / (O - m), F = S - R * m, C = 25, M = 15, y = (M - C) / (O - m), b = C - y * m, w = [
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
], q = 16384;
class W {
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
    r(this, "inputBuffer", new c());
    r(this, "outputBuffer", new c());
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
      let t = F + R * this._tempo;
      t = N(t, k, S), this.sequenceMs = Math.floor(t + 0.5);
    }
    if (this.autoSeekSetting) {
      let t = b + y * this._tempo;
      t = N(
        t,
        M,
        C
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
    for (let n = 0; n < 4; n = n + 1) {
      let o = 0;
      for (; w[n][o] && (i = s + w[n][o], !(i >= this.seekLength)); ) {
        let h = this.calculateCrossCorrelationStereo(
          2 * i,
          this.refMidBuffer
        );
        h > t && (t = h, e = i), o = o + 1;
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
    const n = 2 * this.overlapLength;
    for (let o = 2; o < n; o = o + 2) {
      let h = o + t;
      i += s[h] * e[o] + s[h + 1] * e[o + 1];
    }
    return i;
  }
  overlap(t) {
    let e = 2 * t;
    const s = this.inputBuffer.vector;
    e += this.inputBuffer.startIndex;
    const i = this.outputBuffer.vector, n = this.outputBuffer.endIndex, o = 1 / this.overlapLength;
    for (let h = 0; h < this.overlapLength; h = h + 1) {
      let l = (this.overlapLength - h) * o, f = h * o, u = 2 * h, _ = u + e, T = u + n;
      i[T + 0] = s[_ + 0] * f + this.midBuffer[u + 0] * l, i[T + 1] = s[_ + 1] * f + this.midBuffer[u + 1] * l;
    }
  }
  process(t) {
    for (this.outputBuffer = new c(), this.inputBuffer.putSamples(t, 0, -1); this.inputBuffer.frameCount >= this.sampleReq; ) {
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
      const n = ~~this.skipFract;
      this.skipFract -= n, this.inputBuffer.receive(n);
    }
    return this.outputBuffer.vector;
  }
}
class K {
  constructor() {
    r(this, "_rate", 0);
    r(this, "_tempo", 0);
    r(this, "virtualPitch", 1);
    r(this, "virtualRate", 1);
    r(this, "virtualTempo", 1);
    r(this, "transposer", new U());
    r(this, "stretch", new W());
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
    this._tempo = this.virtualTempo / this.virtualPitch, this._rate = this.virtualRate * this.virtualPitch, B(this._tempo, t) && (this.stretch.tempo = this._tempo), B(this._rate, e) && (this.transposer.rate = this._rate);
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
var d = /* @__PURE__ */ ((a) => (a.URL = "URL", a.BUFFER = "BUFFER", a.MICROPHONE = "MICROPHONE", a))(d || {});
const Q = q, p = (a) => a instanceof AudioBufferSourceNode, g = (a) => a instanceof AudioBuffer;
class v {
  constructor(t, e, s) {
    r(this, "sourceDuration", {
      startTime: 0,
      pauseTime: 0,
      lastPauseTime: 0,
      offsetTime: 0
    });
    r(this, "bufferSize", Q);
    r(this, "sourceNode");
    r(this, "scriptNode");
    r(this, "soundTouch", new K());
    r(this, "processBuffer", new c());
    r(this, "gainNode");
    this.source = t, this.audioContext = e, this.type = s, this.init();
  }
  init() {
    g(this.source) ? (this.sourceNode = this.audioContext.createBufferSource(), this.sourceNode.buffer = this.source, this.sourceNode.addEventListener("ended", () => {
      this.release();
    })) : this.sourceNode = this.audioContext.createMediaStreamSource(this.source), this.scriptNode = this.audioContext.createScriptProcessor(
      this.bufferSize,
      2,
      2
    ), this.sourceNode.connect(this.scriptNode), this.gainNode = this.audioContext.createGain(), this.scriptNode.connect(this.gainNode), this.gainNode.connect(this.audioContext.destination);
  }
  get pitch() {
    return this.soundTouch.pitch;
  }
  set pitch(t) {
    this.soundTouch.pitch = t;
  }
  get volume() {
    return this.gainNode ? this.gainNode.gain.value : -1;
  }
  set volume(t) {
    this.gainNode && (this.gainNode.gain.value = t);
  }
  get duration() {
    return g(this.source) ? this.source.duration : -1;
  }
  get currentTime() {
    let t = this.audioContext.currentTime;
    return this.sourceDuration.lastPauseTime && (t = this.sourceDuration.lastPauseTime), this.sourceDuration.offsetTime + t - this.sourceDuration.startTime - this.sourceDuration.pauseTime;
  }
  async play(t = 0) {
    let e = !1;
    this.scriptNode && (this.scriptNode.onaudioprocess = async (s) => {
      const i = s.outputBuffer, n = s.inputBuffer, o = new Float32Array(this.bufferSize * 2), h = n.getChannelData(0), l = n.numberOfChannels > 1 ? n.getChannelData(1) : n.getChannelData(0);
      for (let u = 0; u < o.length; u++)
        o[u * 2] = h[u], o[u * 2 + 1] = l[u];
      const f = this.soundTouch.process(o);
      if (this.processBuffer.putSamples(f, 0, -1), e) {
        this.processBuffer.receiveSamples(o, this.bufferSize);
        for (let u = 0; u < o.length; u++)
          i.getChannelData(0)[u] = o[u * 2], i.getChannelData(1)[u] = o[u * 2 + 1];
      } else
        this.processBuffer.frameCount >= this.bufferSize * 2 && (e = !0);
    }), this.sourceNode && p(this.sourceNode) && (this.sourceDuration.startTime = this.audioContext.currentTime, this.sourceDuration.offsetTime = t, this.sourceNode.start(0, t));
  }
  resume() {
    this.sourceNode && p(this.sourceNode) && (this.sourceNode.playbackRate.value = 1, this.sourceDuration.pauseTime += this.audioContext.currentTime - this.sourceDuration.lastPauseTime, this.sourceDuration.lastPauseTime = 0);
  }
  pause() {
    this.sourceNode && p(this.sourceNode) && (this.sourceNode.playbackRate.value = Number.MIN_VALUE, this.sourceDuration.lastPauseTime || (this.sourceDuration.lastPauseTime = this.audioContext.currentTime));
  }
  seek(t) {
    this.release(), this.init(), this.play(t);
  }
  process() {
    if (g(this.source)) {
      const t = new Float32Array(this.source.length * 2), e = this.source.getChannelData(0), s = this.source.numberOfChannels > 1 ? this.source.getChannelData(1) : this.source.getChannelData(0);
      for (let i = 0; i < t.length; i++)
        t[i * 2] = e[i], t[i * 2 + 1] = s[i];
      return this.soundTouch.process(t);
    } else
      return new Float32Array();
  }
  release() {
    this.sourceNode && (this.gainNode && this.gainNode.disconnect(), this.sourceNode.disconnect(), this.scriptNode && this.scriptNode.disconnect(), p(this.sourceNode) ? (this.resetSourceDuration(), this.sourceNode.onended = null) : this.sourceNode.mediaStream.getTracks().forEach((t) => {
      t.stop();
    }));
  }
  resetSourceDuration() {
    this.processBuffer = new c(), this.sourceDuration = {
      offsetTime: 0,
      startTime: 0,
      lastPauseTime: 0,
      pauseTime: 0
    };
  }
}
class V {
  async createURLTrack(t) {
    return new Promise(async (e) => {
      const s = new AudioContext(), n = await (await fetch(t)).arrayBuffer();
      s.decodeAudioData(n, async (o) => {
        const h = new v(o, s, d.URL);
        e(h);
      });
    });
  }
  async createBufferTrack(t) {
    return new Promise(async (e) => {
      const s = new AudioContext();
      s.decodeAudioData(t, async (i) => {
        const n = new v(
          i,
          s,
          d.BUFFER
        );
        e(n);
      });
    });
  }
  async createMicrophoneTrack(t = !0) {
    return new Promise(async (e) => {
      const s = new AudioContext(), i = await navigator.mediaDevices.getUserMedia({
        audio: t,
        video: !1
      }), n = new v(i, s, d.MICROPHONE);
      e(n);
    });
  }
}
export {
  v as Track,
  V as Yami
};
