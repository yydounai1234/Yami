
import { Yami } from '../lib/main'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button">链接播放</button>
    </div>
    <div class="card">
      <button id="counter2" type="button">麦克风播放</button>
    </div>
  </div>
`

document.getElementById('counter')?.addEventListener('click', async () => {
  const yami = new Yami()
  const track = await yami.createURLTrack('/bensound-actionable.mp3')
  track.pitch = 1.6
  track.play()
})

document.getElementById('counter2')?.addEventListener('click', async () => {
  const yami = new Yami()
  const track = await yami.createMicrophoneTrack()
  track.pitch = 0.7
  track.play()
})
