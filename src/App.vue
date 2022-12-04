<template>
	<v-app>
		<v-app-bar color="teal-darken-4" image="https://picsum.photos/1920/1080?random" title="Yami">
		</v-app-bar>
		<v-main>
			<v-container>
				<v-row dense>
					<v-col cols="12">
						<v-card title="链接播放">
							<v-card-item>
								<div>3131</div>
							</v-card-item>
							<v-card-actions>
								<v-btn @click="playURLSource"> 播放 </v-btn>
								<v-btn @click="stopURLSource"> 停止 </v-btn>
							</v-card-actions>
						</v-card>
					</v-col>
					<v-col cols="12">
						<v-card title="麦克风播放">
							<v-card-item>
								<div>3131</div>
							</v-card-item>
							<v-card-actions>
								<v-btn @click="playMicoPhoneSource">
									播放
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
	</v-app>
</template>
<script setup lang="ts">
import { Yami } from '../lib/main'
import type { Track } from '../lib/main'

let urlTrack: Track | null = null
let micoPhoneTrack: Track | null = null

const playURLSource = async () => {
	const yami = new Yami()
	urlTrack = await yami.createURLTrack('/bensound-actionable.mp3')
	urlTrack.pitch = 1.6
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


</script>