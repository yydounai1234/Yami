<template>
	<v-app>
		<v-app-bar color="teal-darken-4" image="https://picsum.photos/1920/1080?random" title="Yami">
		</v-app-bar>
		<v-main scrollable>
			<v-container>
				<v-row dense>
					<v-col sm="6">
						<v-card title="链接播放">
							<v-card-item style="min-height:300px">
								<v-text-field label="播放地址" v-model="audioUrl"></v-text-field>
								<v-slider v-model="urlVolume" step="0.1" color="green" label="音量" :max="2"
									prepend-icon="mdi-volume-high"></v-slider>
								<v-slider v-model="urlPitch" step="0.1" color="green" label="声调" :max="2"
									prepend-icon="mdi-microphone"></v-slider>
								<v-slider v-model="urlProgress" label="进度" :max="urlDuration" color="green"
									prepend-icon="mdi-progress-clock" @click="changeProgress"></v-slider>
								<canvas id="aa" width="480" height="360"></canvas>
								<canvas id="bb" width="480" height="360"></canvas>
							</v-card-item>
							<v-card-actions>
								<v-btn @click="playURLSource" color="secondary" variant="flat"> 播放 </v-btn>
								<v-btn @click="resumeURLSource" color="green" variant="flat"> 继续 </v-btn>
								<v-btn @click="pauseURLSource" color="error" variant="flat"> 暂停 </v-btn>
								<v-btn @click="stopURLSource" color="error" variant="flat"> 停止 </v-btn>
							</v-card-actions>
						</v-card>
					</v-col>
					<v-col sm="6">
						<v-card title="麦克风播放">
							<v-card-item style="min-height:300px">
								<p class="mb-5 text-body-2">建议使用耳机使用该功能，否则可能会导致啸叫</p>
								<v-slider v-model="micoPhoneVolume" step="0.1" color="green" label="音量" :max="2"
									prepend-icon="mdi-volume-high"></v-slider>
								<v-slider v-model="micoPhonePitch" step="0.1" color="green" label="声调" :max="2"
									prepend-icon="mdi-microphone"></v-slider>
							</v-card-item>
							<v-card-actions>
								<v-btn @click="playMicoPhoneSource" color="secondary" variant="flat"> 播放 </v-btn>
								<v-btn @click="stopMicoPhoneSource" color="error" variant="flat"> 停止 </v-btn>
							</v-card-actions>
						</v-card>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
	</v-app>
</template>
<script setup lang='ts'>
import { Yami } from '../lib/main'
import type { Track } from '../lib/main'
import { ref, watch } from 'vue'

let urlTrack: Track | null = null
let micoPhoneTrack: Track | null = null
let yami: Yami | null = null
let timer: ReturnType<typeof setInterval>

const currentTime = ref(0)
const audioUrl = ref('https://m10.music.126.net/20221206184352/debb3a842668faefaea6c22462b9c4b4/ymusic/1ec1/443b/2fe2/d7bce637483ad91c832bd036a7dc5e3c.mp3')
const urlVolume = ref(1)
const urlProgress = ref(0)
const urlPitch = ref(1.25)
const urlDuration = ref(0)
const micoPhoneVolume = ref(1)
const micoPhonePitch = ref(1.6)

/** 监听 url 音调 */
watch(urlPitch, (newVal) => {
	urlTrack && (urlTrack.pitch = newVal)
})

/** 监听 url 音量 */
watch(urlVolume, (newVal) => {
	urlTrack && (urlTrack.volume = newVal)
})

/** 监听 micoPhone 音调 */
watch(micoPhonePitch, (newVal) => {
	micoPhoneTrack && (micoPhoneTrack.pitch = newVal)
})

/** 监听 micoPhone 音量 */
watch(micoPhoneVolume, (newVal) => {
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
	urlTrack.drawTimeDomain(document.getElementById("aa")!)
	urlTrack.drawFrequencyDomain(document.getElementById("bb")!)
}

const stopURLSource = async () => {
	clearInterval(timer)
	urlTrack && urlTrack.release()
}

const playMicoPhoneSource = async () => {
	let _yami = yami ?? new Yami()
	micoPhoneTrack = await _yami.createMicrophoneTrack()
	micoPhoneTrack.pitch = micoPhonePitch.value
	micoPhoneTrack.volume = micoPhoneVolume.value
	micoPhoneTrack.play()
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