<template>
  <div class="bg-gray-900 text-white rounded-lg shadow-xl p-6 max-w-md mx-auto">
    <!-- Current Track Info -->
    <div class="mb-6">
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
          <i class="bi bi-vinyl text-2xl text-blue-400"></i>
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-lg">{{ currentTrack?.name || 'No track selected' }}</h3>
          <p class="text-gray-400 text-sm">{{ currentTrack?.artist || 'Select a track to play' }}</p>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mb-6">
      <div class="relative">
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div 
            class="bg-blue-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        <div class="flex justify-between text-xs text-gray-400 mt-1">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>
    </div>

    <!-- Playback Controls -->
    <div class="flex items-center justify-center space-x-6 mb-6">
      <!-- Previous -->
      <button
        @click="player.managePlayer('previous')"
        :disabled="!hasPrevious"
        class="p-2 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <i class="bi bi-skip-backward-fill text-xl"></i>
      </button>

      <!-- Play/Pause -->
      <button
        @click="player.managePlayer('toggle')"
        :disabled="!currentTrack"
        class="p-3 bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <i 
          :class="isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill'"
          class="text-2xl"
        ></i>
      </button>

      <!-- Next -->
      <button
        @click="player.managePlayer('next')"
        :disabled="!hasNext"
        class="p-2 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <i class="bi bi-skip-forward-fill text-xl"></i>
      </button>
    </div>

    <!-- Additional Controls -->
    <div class="flex items-center justify-between mb-4">
      <!-- Volume -->
      <div class="flex items-center space-x-2">
        <i class="bi bi-volume-up text-gray-400"></i>
        <input
          v-model="localVolume"
          @input="player.managePlayer('setVolume', parseFloat(localVolume))"
          type="range"
          min="0"
          max="1"
          step="0.1"
          class="w-24 accent-blue-500"
        />
      </div>

      <!-- Controls Row -->
      <div class="flex items-center space-x-3">
        <!-- Shuffle -->
        <button
          @click="player.managePlayer('toggleShuffle')"
          :class="shuffle ? 'text-blue-500' : 'text-gray-400'"
          class="hover:text-white transition-colors"
        >
          <i class="bi bi-shuffle"></i>
        </button>

        <!-- Repeat -->
        <button
          @click="player.managePlayer('toggleRepeat')"
          :class="repeat !== 'none' ? 'text-blue-500' : 'text-gray-400'"
          class="hover:text-white transition-colors"
        >
          <i 
            :class="repeat === 'one' ? 'bi bi-repeat-1' : repeat === 'all' ? 'bi bi-repeat' : 'bi bi-repeat'"
          ></i>
        </button>

        <!-- Favorite -->
        <button
          @click="player.managePlayer('toggleFavorite', currentTrack)"
          :disabled="!currentTrack"
          :class="isFavorite(currentTrack?.id) ? 'text-red-500' : 'text-gray-400'"
          class="hover:text-white disabled:opacity-50 transition-colors"
        >
          <i class="bi bi-heart-fill"></i>
        </button>

        <!-- Playlist Toggle -->
        <button
          @click="player.managePlayer('togglePlaylist')"
          :class="showPlaylist ? 'text-blue-500' : 'text-gray-400'"
          class="hover:text-white transition-colors"
        >
          <i class="bi bi-music-note-list"></i>
        </button>
      </div>
    </div>

    <!-- Playlist -->
    <div v-if="showPlaylist" class="border-t border-gray-700 pt-4">
      <h4 class="text-sm font-semibold mb-3 text-gray-400">Playlist</h4>
      <div class="max-h-40 overflow-y-auto space-y-2">
        <div
          v-for="(track, index) in playlist"
          :key="track.id"
          @click="playTrack(track, index)"
          :class="currentTrack?.id === track.id ? 'bg-gray-700' : 'hover:bg-gray-800'"
          class="flex items-center justify-between p-2 rounded cursor-pointer transition-colors"
        >
          <div class="flex items-center space-x-3">
            <span class="text-gray-400 text-sm w-6">{{ index + 1 }}</span>
            <div>
              <p class="text-sm font-medium">{{ track.name }}</p>
              <p class="text-xs text-gray-400">{{ track.artist }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-400">{{ formatTime(track.duration) }}</span>
            <button
              @click.stop="player.managePlayer('removeFromPlaylist', track.id)"
              class="text-gray-400 hover:text-red-500 transition-colors"
            >
              <i class="bi bi-x-circle text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-4">
      <i class="bi bi-arrow-repeat animate-spin text-2xl text-blue-500"></i>
      <p class="text-sm text-gray-400 mt-2">Loading track...</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { usePlayer } from '@/stores/player'
import { useProducts } from '@/stores/products'

const player = usePlayer()
const products = useProducts()

// Get player info from store
const {
  currentTrack,
  isPlaying,
  isLoading,
  volume,
  currentTime,
  duration,
  progress,
  hasNext,
  hasPrevious,
  repeat,
  shuffle,
  showPlaylist,
  playlist
} = player.playerInfo

// Local volume for reactive input (different name to avoid conflict)
const localVolume = ref(volume)

// Watch for volume changes
watch(localVolume, (newVolume) => {
  player.managePlayer('setVolume', newVolume)
})

// Check if track is favorite
const isFavorite = (trackId) => {
  return player.favorites.some(fav => fav.id === trackId)
}

// Play specific track
const playTrack = (track, index) => {
  player.currentIndex = index
  player.managePlayer('load', track)
  player.managePlayer('play')
}

// Format time in MM:SS
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Initialize with vinyl products as playlist
const initializePlaylist = () => {
  const vinylTracks = products.productInfo.all.map(product => ({
    id: product.id,
    name: product.name,
    artist: product.artist,
    duration: product.duration || 240, // Default 4 minutes
    audioUrl: product.audioUrl,
    image: product.image
  }))
  player.managePlayer('setPlaylist', vinylTracks)
}

// Initialize on mount
initializePlaylist()

// Simulate time progress (in real app, this would come from audio element)
setInterval(() => {
  if (isPlaying && currentTrack && !isLoading) {
    player.updateTime(currentTime + 1, duration)
  }
}, 1000)
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Custom range slider styling */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: #4b5563;
  height: 4px;
  border-radius: 2px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #3b82f6;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  margin-top: -6px;
}

input[type="range"]::-moz-range-track {
  background: #4b5563;
  height: 4px;
  border-radius: 2px;
}

input[type="range"]::-moz-range-thumb {
  background: #3b82f6;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  border: none;
}
</style>
