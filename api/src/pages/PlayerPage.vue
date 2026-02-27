<template>
  <div class="min-h-screen bg-gray-50">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">🎵 Music Player</h1>
        <p class="mt-2 text-gray-600">Listen to your favorite vinyl records</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Player -->
        <div class="lg:col-span-2">
          <MusicPlayer />
        </div>
        
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Stats -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Player Stats</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Total Tracks</span>
                <span class="font-medium">{{ playlist.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Favorites</span>
                <span class="font-medium text-red-600">{{ favoriteCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Recently Played</span>
                <span class="font-medium">{{ playHistory.length }}</span>
              </div>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <button
                @click="clearPlaylist"
                class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Clear Playlist
              </button>
              <button
                @click="shuffleAll"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Shuffle All
              </button>
              <button
                @click="toggleVisualizer"
                class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                {{ showVisualizer ? 'Hide' : 'Show' }} Visualizer
              </button>
            </div>
          </div>
          
          <!-- Recently Played -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Recently Played</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div
                v-for="track in playHistory.slice(0, 10)"
                :key="track.id"
                @click="playFromHistory(track)"
                class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
              >
                <div class="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                  <i class="bi bi-vinyl text-gray-600"></i>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ track.title }}</p>
                  <p class="text-xs text-gray-500">{{ track.artist }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Visualizer (when enabled) -->
      <div v-if="showVisualizer" class="mt-8">
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Audio Visualizer</h3>
          <div class="flex items-end justify-center space-x-1 h-32">
            <div
              v-for="i in 20"
              :key="i"
              class="w-3 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t transition-all duration-300"
              :style="{ height: `${Math.random() * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import MusicPlayer from '@/components/MusicPlayer.vue'
import { usePlayer } from '@/stores/player'

const player = usePlayer()
const playerInfo = player.playerInfo
const {
  playlist,
  favoriteCount,
  playHistory,
  showVisualizer
} = playerInfo

// Actions
const clearPlaylist = () => {
  player.managePlayer('setPlaylist', [])
}

const shuffleAll = () => {
  player.managePlayer('toggleShuffle')
  if (playlist.length > 0) {
    player.currentIndex = 0
    player.managePlayer('load', playlist[0])
    player.managePlayer('play')
  }
}

const toggleVisualizer = () => {
  player.managePlayer('toggleVisualizer')
}

const playFromHistory = (track) => {
  // Find track in products and play it
  const trackData = {
    id: track.id,
    name: track.title,
    artist: track.artist,
    duration: 240, // Default duration
    audioUrl: ''
  }
  
  player.managePlayer('load', trackData)
  player.managePlayer('play')
}
</script>

<style scoped>
/* Animation for visualizer bars */
@keyframes pulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

.bg-gradient-to-t > div {
  animation: pulse 1s ease-in-out infinite;
}

.bg-gradient-to-t > div:nth-child(odd) {
  animation-delay: 0.1s;
}

.bg-gradient-to-t > div:nth-child(even) {
  animation-delay: 0.2s;
}
</style>
