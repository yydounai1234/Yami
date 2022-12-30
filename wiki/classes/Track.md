[yami-voice](../README.md) / [Exports](../modules.md) / Track

# Class: Track

音频类

**`Remarks`**

主要用于播放音频以及获取音频内容

## Table of contents

### Constructors

- [constructor](Track.md#constructor)

### Properties

- [analyserNode](Track.md#analysernode)
- [audioContext](Track.md#audiocontext)
- [bufferSize](Track.md#buffersize)
- [gainNode](Track.md#gainnode)
- [processBuffer](Track.md#processbuffer)
- [scriptNode](Track.md#scriptnode)
- [soundTouch](Track.md#soundtouch)
- [source](Track.md#source)
- [sourceDuration](Track.md#sourceduration)
- [sourceNode](Track.md#sourcenode)
- [streamDestinationNode](Track.md#streamdestinationnode)
- [type](Track.md#type)

### Accessors

- [currentTime](Track.md#currenttime)
- [duration](Track.md#duration)
- [fftSize](Track.md#fftsize)
- [pitch](Track.md#pitch)
- [stream](Track.md#stream)
- [volume](Track.md#volume)

### Methods

- [getFrequencyDomainData](Track.md#getfrequencydomaindata)
- [getTimeDomainData](Track.md#gettimedomaindata)
- [init](Track.md#init)
- [pause](Track.md#pause)
- [play](Track.md#play)
- [process](Track.md#process)
- [release](Track.md#release)
- [resetSourceDuration](Track.md#resetsourceduration)
- [resume](Track.md#resume)
- [seek](Track.md#seek)

## Constructors

### constructor

• **new Track**(`source`, `audioContext`, `type`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `AudioBuffer` \| `MediaStream` |
| `audioContext` | `AudioContext` |
| `type` | [`TrackType`](../enums/TrackType.md) |

#### Defined in

[track.ts:62](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L62)

## Properties

### analyserNode

• `Private` **analyserNode**: `undefined` \| `AnalyserNode`

#### Defined in

[track.ts:60](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L60)

___

### audioContext

• `Private` **audioContext**: `AudioContext`

#### Defined in

[track.ts:64](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L64)

___

### bufferSize

• `Private` **bufferSize**: `number` = `BUFFER_SIZE`

#### Defined in

[track.ts:51](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L51)

___

### gainNode

• `Private` **gainNode**: `undefined` \| `GainNode`

#### Defined in

[track.ts:59](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L59)

___

### processBuffer

• `Private` **processBuffer**: `default`

#### Defined in

[track.ts:58](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L58)

___

### scriptNode

• `Private` **scriptNode**: `undefined` \| `ScriptProcessorNode`

#### Defined in

[track.ts:56](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L56)

___

### soundTouch

• `Private` **soundTouch**: `default`

#### Defined in

[track.ts:57](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L57)

___

### source

• `Private` **source**: `AudioBuffer` \| `MediaStream`

#### Defined in

[track.ts:63](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L63)

___

### sourceDuration

• `Private` **sourceDuration**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `lastPauseTime` | `number` |
| `offsetTime` | `number` |
| `pauseTime` | `number` |
| `startTime` | `number` |

#### Defined in

[track.ts:45](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L45)

___

### sourceNode

• `Private` **sourceNode**: `undefined` \| `AudioBufferSourceNode` \| `MediaStreamAudioSourceNode`

#### Defined in

[track.ts:52](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L52)

___

### streamDestinationNode

• `Private` **streamDestinationNode**: `undefined` \| `MediaStreamAudioDestinationNode`

#### Defined in

[track.ts:61](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L61)

___

### type

• **type**: [`TrackType`](../enums/TrackType.md)

#### Defined in

[track.ts:65](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L65)

## Accessors

### currentTime

• `get` **currentTime**(): `number`

获取当前时间

#### Returns

`number`

#### Defined in

[track.ts:150](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L150)

___

### duration

• `get` **duration**(): `number`

获取音频时长

#### Returns

`number`

#### Defined in

[track.ts:132](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L132)

___

### fftSize

• `get` **fftSize**(): `number`

#### Returns

`number`

#### Defined in

[track.ts:114](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L114)

• `set` **fftSize**(`newVal`): `void`

获取傅立叶变化窗口大小

#### Parameters

| Name | Type |
| :------ | :------ |
| `newVal` | `number` |

#### Returns

`void`

#### Defined in

[track.ts:110](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L110)

___

### pitch

• `get` **pitch**(): `number`

获取变调

#### Returns

`number`

#### Defined in

[track.ts:101](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L101)

• `set` **pitch**(`newVal`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newVal` | `number` |

#### Returns

`void`

#### Defined in

[track.ts:105](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L105)

___

### stream

• `get` **stream**(): `undefined` \| `MediaStream`

获取流

#### Returns

`undefined` \| `MediaStream`

#### Defined in

[track.ts:143](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L143)

___

### volume

• `get` **volume**(): `number`

获取音量

#### Returns

`number`

#### Defined in

[track.ts:121](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L121)

• `set` **volume**(`newVal`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newVal` | `number` |

#### Returns

`void`

#### Defined in

[track.ts:125](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L125)

## Methods

### getFrequencyDomainData

▸ **getFrequencyDomainData**(): `Uint8Array`

绘制频域图片

#### Returns

`Uint8Array`

#### Defined in

[track.ts:301](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L301)

___

### getTimeDomainData

▸ **getTimeDomainData**(): `Uint8Array`

绘制时域图片

#### Returns

`Uint8Array`

#### Defined in

[track.ts:287](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L287)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Defined in

[track.ts:70](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L70)

___

### pause

▸ **pause**(): `void`

暂停

#### Returns

`void`

#### Defined in

[track.ts:221](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L221)

___

### play

▸ **play**(`offset?`): `Promise`<`void`\>

播放

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `offset` | `number` | `0` |

#### Returns

`Promise`<`void`\>

#### Defined in

[track.ts:166](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L166)

___

### process

▸ **process**(): `Float32Array`

获取数据

**`Remarks`**

该接口会造成 UI/JS 线程阻塞

#### Returns

`Float32Array`

获取处理后的数据

#### Defined in

[track.ts:245](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L245)

___

### release

▸ **release**(): `void`

释放资源

#### Returns

`void`

#### Defined in

[track.ts:266](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L266)

___

### resetSourceDuration

▸ `Private` **resetSourceDuration**(): `void`

重置

#### Returns

`void`

#### Defined in

[track.ts:315](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L315)

___

### resume

▸ **resume**(): `void`

恢复

#### Returns

`void`

#### Defined in

[track.ts:209](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L209)

___

### seek

▸ **seek**(`time`): `void`

seek

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `time` | `number` | seek 指定时间 |

#### Returns

`void`

#### Defined in

[track.ts:234](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/track.ts#L234)
