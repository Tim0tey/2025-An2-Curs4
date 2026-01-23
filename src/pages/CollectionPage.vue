<template>
  <div class="min-h-screen bg-gray-50">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">🎵 My Collection</h1>
        <p class="mt-2 text-gray-600">Manage your vinyl collection</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Collection Stats -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Collection Stats</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Total Albums</span>
                <span class="font-medium">{{ collectionInfo.albums.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Total Value</span>
                <span class="font-medium">${{ collectionInfo.stats.totalValue.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Wishlist</span>
                <span class="font-medium">{{ collectionInfo.wishList.length }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Collection List -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">My Albums</h3>
            <div v-if="collectionInfo.albums.length === 0" class="text-center py-12">
              <i class="bi bi-vinyl text-4xl text-gray-400"></i>
              <p class="mt-4 text-gray-600">No albums in your collection yet</p>
              <router-link
                to="/shop"
                class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Vinyl
              </router-link>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="album in collectionInfo.albums"
                :key="album.id"
                class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div class="flex items-center space-x-4">
                  <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <i class="bi bi-vinyl text-gray-600 text-xl"></i>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ album.title }}</h4>
                    <p class="text-sm text-gray-600">{{ album.artist }}</p>
                    <p class="text-xs text-gray-500">{{ album.genre }} • {{ album.year }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="playAlbum(album)"
                    class="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <i class="bi bi-play-circle"></i>
                  </button>
                  <button
                    @click="removeAlbum(album.id)"
                    class="p-2 text-red-600 hover:text-red-800"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCollection } from '@/stores/collection'
import { usePlayer } from '@/stores/player'

const router = useRouter()
const collection = useCollection()
const player = usePlayer()

const collectionInfo = computed(() => collection.collectionInfo)

const playAlbum = (album) => {
  // Add to player and start playing
  player.managePlayer('load', {
    id: album.id,
    name: album.title,
    artist: album.artist,
    duration: 240, // Default duration
    audioUrl: ''
  })
  player.managePlayer('play')
  
  // Add to recently played
  collection.manageRecentlyPlayed('add', album)
}

const removeAlbum = (albumId) => {
  if (confirm('Are you sure you want to remove this album from your collection?')) {
    collection.manageCollection('remove', albumId)
  }
}
</script>

<style scoped>
.bg-white {
  background-color: white;
}
</style>
