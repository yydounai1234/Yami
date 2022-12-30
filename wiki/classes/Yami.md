[yami-voice](../README.md) / [Exports](../modules.md) / Yami

# Class: Yami

Yaml 类

**`Remarks`**

主要用于创建各种音频轨

## Table of contents

### Constructors

- [constructor](Yami.md#constructor)

### Methods

- [createBufferTrack](Yami.md#createbuffertrack)
- [createMicrophoneTrack](Yami.md#createmicrophonetrack)
- [createURLTrack](Yami.md#createurltrack)

## Constructors

### constructor

• **new Yami**()

## Methods

### createBufferTrack

▸ **createBufferTrack**(`buffer`): `Promise`<[`Track`](Track.md)\>

根据 buffer 创建音频轨

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buffer` | `ArrayBuffer` | 音频数据 |

#### Returns

`Promise`<[`Track`](Track.md)\>

音频轨

#### Defined in

[yami.ts:30](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/yami.ts#L30)

___

### createMicrophoneTrack

▸ **createMicrophoneTrack**(`config?`): `Promise`<[`Track`](Track.md)\>

根据麦克风创建音频轨

**`See`**

[MediaTrackConstraints - Wikipedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `config` | `boolean` \| `MediaTrackConstraints` | `true` | 音频配置项 |

#### Returns

`Promise`<[`Track`](Track.md)\>

音频轨

#### Defined in

[yami.ts:48](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/yami.ts#L48)

___

### createURLTrack

▸ **createURLTrack**(`url`): `Promise`<[`Track`](Track.md)\>

根据 url 创建音频轨

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | 音频地址 |

#### Returns

`Promise`<[`Track`](Track.md)\>

音频轨

#### Defined in

[yami.ts:14](https://github.com/yydounai1234/Yami/blob/3b9828c/lib/yami.ts#L14)
