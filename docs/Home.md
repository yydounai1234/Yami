# Yami

使用 **SoundTouch** 提供的变声核心逻辑，通过 **audioContenxt** 将音频资源、音频文件或音频流进行实时变声处理。

本库 wsola 算法以及插值算法借鉴了 [SoundTouchJS](https://github.com/cutterbl/SoundTouchJS) 中的实现，与 [SoundTouchJS](https://github.com/cutterbl/SoundTouchJS) 相比本库的优点在于：

- 1.支持 Typescript
- 2.支持原生 ESM
- 3.支持麦克风设备实时变声
- 4.接口更简洁

缺点在于：

- 1.不支持变速

> 由于使用 **ScriptProcessorNode** 的音频数据输入进行实时变声处理，所以不支持变速功能，如果需要使用到变速功能并且不使用音频流，可以使用 [SoundTouchJS](https://github.com/cutterbl/SoundTouchJS)。

## DEMO

- [在线 DEMO](https://yydounai1234.github.io/yami-voice/)
- 下载源码

```text
git clone git@github.com:yydounai1234/Yami.git
yarn install
yarn dev
```

## 安装

### NPM

```text
yarn add yami-voice
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/gh/yydounai1234/Yami/dist/Yami.umd.cjs"></script>
<script>
    // ...
</script> 
```

### ESM

```html
<script type="importmap">
  {
    "imports": {
      "Yami": "https://cdn.jsdelivr.net/gh/yydounai1234/Yami/dist/Yami.cjs"
    }
  }
</script>
<script type="module">
    // ...
</script> 
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

具体的使用文档指南可以查看 [Yami](https://yydounai1234.github.io/Yami/)。

## LICENSE

由于部分代码借鉴了 [SoundTouchJS](https://github.com/cutterbl/SoundTouchJS)，其采用了 LGPL，故本库也采用 LGPL 协议。
