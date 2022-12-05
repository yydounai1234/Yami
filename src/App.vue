<template>
	<v-app>
		<v-app-bar color="teal-darken-4" image="https://picsum.photos/1920/1080?random" title="Yami">
		</v-app-bar>
		<v-main>
			<v-container>
				<v-row dense>
					<v-col cols="6">
						<v-card title="链接播放">
							<v-card-item style="min-height:250px">
								<v-text-field label="播放地址" v-model="audioUrl"></v-text-field>
								<v-slider v-model="urlVolume" step="0.1" color="green" label="音量" :max="10"
									prepend-icon="mdi-volume-high"></v-slider>
								<v-slider v-model="urlPitch" step="0.1" color="green" label="音调" :max="2"
									prepend-icon="mdi-volume-high"></v-slider>
								<v-slider v-model="urlProgress" label="进度" color="green" prepend-icon="mdi-volume-high"></v-slider>
							</v-card-item>
							<v-card-actions>
								<v-btn @click="playURLSource" color="secondary" variant="flat"> 播放 </v-btn>
								<v-btn @click="stopURLSource" color="error" variant="flat"> 停止 </v-btn>
							</v-card-actions>
						</v-card>
					</v-col>
					<v-col cols="6">
						<v-card title="麦克风播放">
							<v-card-item style="min-height:250px">
								<v-slider v-model="currentTime" prepend-icon="mdi-volume-high"></v-slider>
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

const currentTime = ref(0)
const audioUrl = ref('/bensound-actionable.mp3')
const urlVolume = ref(1)
const urlProgress = ref(0)
const urlPitch = ref(1)

watch(urlPitch, (newVal) => {
	urlTrack && (urlTrack.pitch = newVal)
})

const playURLSource = async () => {
	let _yami = yami ?? new Yami()
	urlTrack = await _yami.createURLTrack(audioUrl.value)
	urlTrack.pitch = urlPitch.value
	urlTrack.play()
}

const stopURLSource = async () => {
	// todo
}

const playMicoPhoneSource = async () => {
	const yami = new Yami()
	micoPhoneTrack = await yami.createMicrophoneTrack()
	micoPhoneTrack.pitch = 0.7
	micoPhoneTrack.play()
}

const stopMicoPhoneSource = async () => {
	// todo
}


</script>