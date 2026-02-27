<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="text-center mb-6">
      <div v-if="currentTrack" class="space-y-4">
        <div class="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
          <i class="bi bi-vinyl text-gray-600 text-4xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900">{{ currentTrack.name || 'No Track' }}</h3>
        <p class="text-sm text-gray-600">{{ currentTrack.artist || 'Unknown Artist' }}</p>
      </div>
      <div v-else class="text-center py-8">
        <i class="bi bi-music-note text-4xl text-gray-400"></i>
        <p class="mt-2 text-gray-600">No track playing</p>
      </div>
    </div>
    
    <!-- Player Controls -->
    <div class="flex justify-center items-center space-x-4 mb-6">
      <button
        @click="previousTrack"
        :disabled="!hasPrevious"
        class="p-3 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
      >
        <i class="bi bi-skip-start-fill"></i>
      </button>
      
      <button
        @click="togglePlay"
        class="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700"
      >
        <i :class="isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill'"></i>
      </button>
      
      <button
        @click="nextTrack"
        :disabled="!hasNext"
        class="p-3 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
      >
        <i class="bi bi-skip-end-fill"></i>
      </button>
    </div>
    
    <!-- Progress Bar -->
    <div v-if="currentTrack" class="space-y-2">
      <div class="flex justify-between text-sm text-gray-600">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(duration) }}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>
    
    <!-- Volume Control -->
    <div v-if="currentTrack" class="flex items-center space-x-4">
      <i class="bi bi-volume-down text-gray-600"></i>
      <input
        v-model="volume"
        type="range"
        min="0"
        max="100"
        class="flex-1"
      />
      <i class="bi bi-volume-up text-gray-600"></i>
      <span class="text-sm text-gray-600">{{ Math.round(volume) }}%</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayer } from '@/stores/player'

const player = usePlayer()

const currentTrack = computed(() => player.playerInfo.currentTrack)
const isPlaying = computed(() => player.playerInfo.isPlaying)
const currentTime = computed(() => player.playerInfo.currentTime)
const duration = computed(() => player.playerInfo.duration)
const volume = computed(() => player.playerInfo.volume * 100)
const hasPrevious = computed(() => player.playerInfo.hasPrevious)
const hasNext = computed(() => player.playerInfo.hasNext)
const progressPercentage = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

const formatTime = (seconds) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const togglePlay = () => {
  if (isPlaying.value) {
    player.managePlayer('pause')
  } else {
    player.managePlayer('play')
  }
}

const previousTrack = () => {
  player.managePlayer('previous')
}

const nextTrack = () => {
  player.managePlayer('next')
}
</script>
