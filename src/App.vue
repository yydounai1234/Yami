<template>
  <v-app>
    <v-app-bar
      color="teal-darken-4"
      image="https://picsum.photos/1920/1080?random"
      title="Yami"
    >
    </v-app-bar>
    <v-main scrollable>
      <v-container>
        <v-row dense>
          <v-col sm="6">
            <v-card title="链接播放">
              <v-card-item style="min-height: 300px">
                <v-text-field
                  label="播放地址"
                  v-model="audioUrl"
                ></v-text-field>
                <v-slider
                  v-model="urlVolume"
                  step="0.1"
                  color="green"
                  label="音量"
                  :max="2"
                  prepend-icon="mdi-volume-high"
                ></v-slider>
                <v-slider
                  v-model="urlPitch"
                  step="0.1"
                  color="green"
                  label="声调"
                  :max="2"
                  prepend-icon="mdi-microphone"
                ></v-slider>
                <v-slider
                  v-model="urlProgress"
                  label="进度"
                  :max="urlDuration"
                  color="green"
                  prepend-icon="mdi-progress-clock"
                  @click="changeProgress"
                ></v-slider>
              </v-card-item>
              <v-card-actions>
                <v-btn @click="playURLSource" color="secondary" variant="flat">
                  播放
                </v-btn>
                <v-btn @click="resumeURLSource" color="green" variant="flat">
                  继续
                </v-btn>
                <v-btn @click="pauseURLSource" color="error" variant="flat">
                  暂停
                </v-btn>
                <v-btn @click="stopURLSource" color="error" variant="flat">
                  停止
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col sm="6">
            <v-card title="麦克风播放">
              <v-card-item style="min-height: 300px">
                <audio style="margin-bottom: 30px" controls ref="microPhoneAudioRef" autoplay></audio>
                <v-slider
                  v-model="microPhoneVolume"
                  step="0.1"
                  color="green"
                  label="音量"
                  :max="2"
                  prepend-icon="mdi-volume-high"
                ></v-slider>
                <v-slider
                  v-model="microPhonePitch"
                  step="0.1"
                  color="green"
                  label="声调"
                  :max="2"
                  prepend-icon="mdi-microphone"
                ></v-slider>
              </v-card-item>
              <v-card-actions>
                <v-btn
                  @click="playMicoPhoneSource"
                  color="secondary"
                  variant="flat"
                >
                  播放
                </v-btn>
                <v-btn
                  @click="stopMicoPhoneSource"
                  color="error"
                  variant="flat"
                >
                  停止
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col sm="12">
            <canvas
              ref="urlTimeRef"
              style="width: 100%; height: 100px"
            ></canvas>
          </v-col>
          <v-col sm="12">
            <canvas
              ref="urlFrequencyRef"
              style="width: 100%; height: 200px"
            ></canvas>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
import { Yami } from '../lib/main'
import type { Track } from '../lib/main'
import { ref, watch } from 'vue'

const WIDTH = 480
const HEIGHT = 360

let urlTrack: Track | null = null
let micoPhoneTrack: Track | null = null
let yami: Yami | null = null
let timer: ReturnType<typeof setInterval>
const microPhoneAudioRef = ref<HTMLAudioElement>()
const audioUrl = ref('./440278627.mp3')
const urlVolume = ref(1)
const urlProgress = ref(0)
const urlPitch = ref(1.25)
const urlDuration = ref(0)
const microPhoneVolume = ref(1)
const microPhonePitch = ref(1.6)
const urlTimeRef = ref<HTMLCanvasElement>()
const urlFrequencyRef = ref<HTMLCanvasElement>()

/** 监听 url 音调 */
watch(urlPitch, (newVal) => {
  urlTrack && (urlTrack.pitch = newVal)
})

/** 监听 url 音量 */
watch(urlVolume, (newVal) => {
  urlTrack && (urlTrack.volume = newVal)
})

/** 监听 micoPhone 音调 */
watch(microPhonePitch, (newVal) => {
  micoPhoneTrack && (micoPhoneTrack.pitch = newVal)
})

/** 监听 micoPhone 音量 */
watch(microPhoneVolume, (newVal) => {
  micoPhoneTrack && (micoPhoneTrack.volume = newVal)
})

const playURLSource = async () => {
  urlTrack && urlTrack.release()
  clearInterval(timer)
  let _yami = yami ?? new Yami()
  urlTrack = await _yami.createURLTrack(audioUrl.value)
  urlTrack.pitch = urlPitch.value
  urlTrack.volume = urlVolume.value
  urlDuration.value = urlTrack.duration
  timer = setInterval(() => {
    urlTrack && (urlProgress.value = urlTrack.currentTime)
  }, 1000)
  urlTrack.play()
}

const stopURLSource = async () => {
  clearInterval(timer)
  urlTrack && urlTrack.release()
}

const playMicoPhoneSource = async () => {
  let _yami = yami ?? new Yami()
  micoPhoneTrack = await _yami.createMicrophoneTrack()
  micoPhoneTrack.pitch = microPhonePitch.value
  micoPhoneTrack.volume = microPhoneVolume.value
  micoPhoneTrack.play()
  if (microPhoneAudioRef.value && micoPhoneTrack.stream) {
    microPhoneAudioRef.value.srcObject = micoPhoneTrack.stream
  }
}

const resumeURLSource = () => {
  urlTrack && urlTrack.resume()
}

const pauseURLSource = () => {
  urlTrack && urlTrack.pause()
}

const stopMicoPhoneSource = async () => {
  micoPhoneTrack && micoPhoneTrack.release()
}

const changeProgress = () => {
  urlTrack && urlTrack.seek(urlProgress.value)
}
</script>
