# Yami

使用 **SoundTouch** 提供的变声核心逻辑，通过 **audioContenxt** 将音频资源、音频文件或音频流进行实时变声处理。

> 由于使用 **ScriptProcessorNode** 的音频数据输入进行实时变声处理，所以不支持变速功能，如果需要使用到变速功能并且不使用音频流，可以使用 [SoundTouchJS](https://github.com/cutterbl/SoundTouchJS)。变速变调算法以及变速不变调算法 C 实现参考 [soundtouch](https://github.com/rspeyer/soundtouch)。


## 安装

### NPM

```text
yarn add Yami
```

### CDN

```html
<script src="./Yaml.umd.js"></script>
```

### ESM

```html
<script src="./Yaml.js"></script>
```

## 使用方法

- 初始化类库

```javascript
const yami = new Yami()
```

- 创建音频轨

```javascript
// 根据 url 地址创建音频轨
const urlTrack = await yami.createURLTrack('/test.mp3')

// 根据 buffer 创建音频轨
const fileBuffer = new ArrayBuffer()
const bufferTrack = await yami.createBufferTrack(fileBuffer)

// 创建设备麦克风输入的音频轨
const microphoneTrack = await yami.createMicrophoneTrack()
```

- 设置变调参数

```javascript
track.pitch = 0.7
```

- 开始播放

```javascript
track.play()
```

## 使用文档

具体的使用文档指南可以查看 [Yaml](https://yydounai1234.com)。