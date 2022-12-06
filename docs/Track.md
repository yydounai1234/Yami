# Class: Track

音频类

**`Remarks`**

主要用于播放音频以及获取音频内容

## Table of contents

### Constructors

- [constructor](../wiki/Track#constructor)

### Properties

- [audioContext](../wiki/Track#audiocontext)
- [bufferSize](../wiki/Track#buffersize)
- [gainNode](../wiki/Track#gainnode)
- [processBuffer](../wiki/Track#processbuffer)
- [scriptNode](../wiki/Track#scriptnode)
- [soundTouch](../wiki/Track#soundtouch)
- [source](../wiki/Track#source)
- [sourceDuration](../wiki/Track#sourceduration)
- [sourceNode](../wiki/Track#sourcenode)
- [type](../wiki/Track#type)

### Accessors

- [currentTime](../wiki/Track#currenttime)
- [duration](../wiki/Track#duration)
- [pitch](../wiki/Track#pitch)
- [volume](../wiki/Track#volume)

### Methods

- [init](../wiki/Track#init)
- [pause](../wiki/Track#pause)
- [play](../wiki/Track#play)
- [process](../wiki/Track#process)
- [release](../wiki/Track#release)
- [resetSourceDuration](../wiki/Track#resetsourceduration)
- [resume](../wiki/Track#resume)
- [seek](../wiki/Track#seek)

## Constructors

### constructor

• **new Track**(`source`, `audioContext`, `type`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `AudioBuffer` \| `MediaStream` |
| `audioContext` | `AudioContext` |
| `type` | [`TrackType`](../wiki/TrackType) |

#### Defined in

[track.ts:60](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L60)

## Properties

### audioContext

• `Private` **audioContext**: `AudioContext`

#### Defined in

[track.ts:62](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L62)

___

### bufferSize

• `Private` **bufferSize**: `number` = `BUFFER_SIZE`

#### Defined in

[track.ts:51](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L51)

___

### gainNode

• `Private` **gainNode**: `undefined` \| `GainNode`

#### Defined in

[track.ts:59](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L59)

___

### processBuffer

• `Private` **processBuffer**: `default`

#### Defined in

[track.ts:58](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L58)

___

### scriptNode

• `Private` **scriptNode**: `undefined` \| `ScriptProcessorNode`

#### Defined in

[track.ts:56](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L56)

___

### soundTouch

• `Private` **soundTouch**: `default`

#### Defined in

[track.ts:57](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L57)

___

### source

• `Private` **source**: `AudioBuffer` \| `MediaStream`

#### Defined in

[track.ts:61](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L61)

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

[track.ts:45](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L45)

___

### sourceNode

• `Private` **sourceNode**: `undefined` \| `AudioBufferSourceNode` \| `MediaStreamAudioSourceNode`

#### Defined in

[track.ts:52](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L52)

___

### type

• **type**: [`TrackType`](../wiki/TrackType)

#### Defined in

[track.ts:63](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L63)

## Accessors

### currentTime

• `get` **currentTime**(): `number`

获取当前时间

#### Returns

`number`

#### Defined in

[track.ts:125](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L125)

___

### duration

• `get` **duration**(): `number`

获取音频时长

#### Returns

`number`

#### Defined in

[track.ts:114](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L114)

___

### pitch

• `get` **pitch**(): `number`

获取变调

#### Returns

`number`

#### Defined in

[track.ts:92](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L92)

• `set` **pitch**(`newVal`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newVal` | `number` |

#### Returns

`void`

#### Defined in

[track.ts:96](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L96)

___

### volume

• `get` **volume**(): `number`

获取音量

#### Returns

`number`

#### Defined in

[track.ts:103](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L103)

• `set` **volume**(`newVal`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newVal` | `number` |

#### Returns

`void`

#### Defined in

[track.ts:107](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L107)

## Methods

### init

▸ **init**(): `void`

#### Returns

`void`

#### Defined in

[track.ts:68](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L68)

___

### pause

▸ **pause**(): `void`

暂停

#### Returns

`void`

#### Defined in

[track.ts:196](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L196)

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

[track.ts:141](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L141)

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

[track.ts:220](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L220)

___

### release

▸ **release**(): `void`

释放资源

#### Returns

`void`

#### Defined in

[track.ts:241](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L241)

___

### resetSourceDuration

▸ `Private` **resetSourceDuration**(): `void`

#### Returns

`void`

#### Defined in

[track.ts:257](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L257)

___

### resume

▸ **resume**(): `void`

恢复

#### Returns

`void`

#### Defined in

[track.ts:184](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L184)

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

[track.ts:209](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/track.ts#L209)
