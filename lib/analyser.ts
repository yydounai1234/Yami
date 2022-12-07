const WIDTH = 480
const HEIGHT = 360

/**
 * 绘制时域数据
 */
export const drawTimeDomain = (
  analyser: AnalyserNode,
  canvas: HTMLCanvasElement
) => {
    const WIDTH = canvas.width
  const HEIGHT = canvas.height
  analyser.fftSize = 256
  const canvasCtx = canvas.getContext('2d')
  if (canvasCtx !== null) {
    const bufferLength = analyser.fftSize
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteTimeDomainData(dataArray)
    const _drawTimeDomain = () => {
      requestAnimationFrame(_drawTimeDomain)

      analyser.getByteTimeDomainData(dataArray)

      canvasCtx.fillStyle = 'rgb(255, 255, 255)'
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

      canvasCtx.lineWidth = 5
      canvasCtx.strokeStyle = 'rgb(100, 218, 198)'

      canvasCtx.beginPath()

      var sliceWidth = (WIDTH * 1.0) / bufferLength
      var x = 0

      for (var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0
        var y = (v * HEIGHT) / 2

        if (i === 0) {
          canvasCtx.moveTo(x, y)
        } else {
          canvasCtx.lineTo(x, y)
        }

        x += sliceWidth
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2)
      canvasCtx.stroke()
    }
    _drawTimeDomain()
  }
}

/**
 * 绘制频域数据
 */
export const drawFrequencyDomain = (
  analyser: AnalyserNode,
  canvas: HTMLCanvasElement
) => {
  const WIDTH = canvas.width
  const HEIGHT = canvas.height
  analyser.fftSize = 256
  const canvasCtx = canvas.getContext('2d')
  if (canvasCtx !== null) {
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)
    const _drawFrequencyDomain = () => {
      requestAnimationFrame(_drawFrequencyDomain)
      analyser.getByteFrequencyData(dataArray)

      canvasCtx.fillStyle = 'rgb(255, 255, 255)'
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

      const barWidth = (WIDTH / bufferLength) * 2.5
      let barHeight = 0
      let x = 0

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i]

        canvasCtx.fillStyle = 'rgb(' + (barHeight) + ',218,198)'
        canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2)

        x += barWidth + 1
      }
    }
    _drawFrequencyDomain()
  }
}
