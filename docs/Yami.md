# Class: Yami

Yaml 类

**`Remarks`**

主要用于创建各种音频轨

## Table of contents

### Constructors

- [constructor](../wiki/Yami#constructor)

### Methods

- [createBufferTrack](../wiki/Yami#createbuffertrack)
- [createMicrophoneTrack](../wiki/Yami#createmicrophonetrack)
- [createURLTrack](../wiki/Yami#createurltrack)

## Constructors

### constructor

• **new Yami**()

## Methods

### createBufferTrack

▸ **createBufferTrack**(`buffer`): `Promise`<[`Track`](../wiki/Track)\>

根据 buffer 创建音频轨

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buffer` | `ArrayBuffer` | 音频数据 |

#### Returns

`Promise`<[`Track`](../wiki/Track)\>

音频轨

#### Defined in

[yami.ts:30](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/yami.ts#L30)

___

### createMicrophoneTrack

▸ **createMicrophoneTrack**(`config?`): `Promise`<[`Track`](../wiki/Track)\>

根据麦克风创建音频轨

**`See`**

[MediaTrackConstraints - Wikipedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `config` | `boolean` \| `MediaTrackConstraints` | `true` | 音频配置项 |

#### Returns

`Promise`<[`Track`](../wiki/Track)\>

音频轨

#### Defined in

[yami.ts:48](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/yami.ts#L48)

___

### createURLTrack

▸ **createURLTrack**(`url`): `Promise`<[`Track`](../wiki/Track)\>

根据 url 创建音频轨

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | 音频地址 |

#### Returns

`Promise`<[`Track`](../wiki/Track)\>

音频轨

#### Defined in

[yami.ts:14](https://github.com/yydounai1234/Baga/blob/2cd48e4/lib/yami.ts#L14)
