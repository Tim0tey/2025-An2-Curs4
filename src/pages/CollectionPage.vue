<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">🎵 My Vinyl Collection</h1>
        <p class="mt-2 text-gray-600">Manage your personal vinyl record collection</p>
      </div>
      
      <!-- Collection Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white shadow rounded-lg p-6">
          <div class="text-2xl font-bold text-blue-600">{{ stats.totalAlbums }}</div>
          <div class="text-sm text-gray-600">Total Albums</div>
        </div>
        <div class="bg-white shadow rounded-lg p-6">
          <div class="text-2xl font-bold text-green-600">${{ stats.totalValue.toFixed(2) }}</div>
          <div class="text-sm text-gray-600">Collection Value</div>
        </div>
        <div class="bg-white shadow rounded-lg p-6">
          <div class="text-2xl font-bold text-purple-600">{{ stats.averageCondition.toFixed(1) }}/5</div>
          <div class="text-sm text-gray-600">Avg Condition</div>
        </div>
        <div class="bg-white shadow rounded-lg p-6">
          <div class="text-2xl font-bold text-orange-600">{{ stats.favoriteGenre }}</div>
          <div class="text-sm text-gray-600">Favorite Genre</div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-4 mb-8">
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <i class="bi bi-plus-circle mr-2"></i>
          Add Album
        </button>
        <button
          @click="showWishlistModal = true"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <i class="bi bi-heart mr-2"></i>
          Wishlist ({{ wishList.length }})
        </button>
        <button
          @click="showStatsModal = true"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <i class="bi bi-bar-chart mr-2"></i>
          Detailed Stats
        </button>
      </div>

      <!-- Collection Tabs -->
      <div class="bg-white shadow rounded-lg">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              @click="activeTab = 'collection'"
              :class="activeTab === 'collection' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
              class="py-2 px-4 border-b-2 font-medium text-sm"
            >
              My Collection ({{ albums.length }})
            </button>
            <button
              @click="activeTab = 'recent'"
              :class="activeTab === 'recent' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
              class="py-2 px-4 border-b-2 font-medium text-sm"
            >
              Recently Played ({{ recentlyPlayedCount }})
            </button>
            <button
              @click="activeTab = 'wishlist'"
              :class="activeTab === 'wishlist' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
              class="py-2 px-4 border-b-2 font-medium text-sm"
            >
              Wishlist ({{ wishList.length }})
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Collection Tab -->
          <div v-if="activeTab === 'collection'">
            <div v-if="albums.length === 0" class="text-center py-12">
              <i class="bi bi-vinyl text-6xl text-gray-400"></i>
              <p class="mt-4 text-gray-600">No albums in your collection yet</p>
              <button
                @click="showAddModal = true"
                class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Your First Album
              </button>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="album in albums"
                :key="album.id"
                class="border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div class="flex items-start space-x-4">
                  <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <i class="bi bi-vinyl text-2xl text-gray-600"></i>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900">{{ album.title }}</h3>
                    <p class="text-sm text-gray-600">{{ album.artist }}</p>
                    <p class="text-xs text-gray-500">{{ album.genre }} • {{ album.year }}</p>
                    <div class="flex items-center space-x-2 mt-2">
                      <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {{ album.condition }}
                      </span>
                      <span class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                        ${{ album.price }}
                      </span>
                    </div>
                    <div class="flex items-center space-x-2 mt-2">
                      <button
                        @click="playAlbum(album.id)"
                        class="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <i class="bi bi-play-circle"></i> Play
                      </button>
                      <button
                        @click="rateAlbum(album.id)"
                        class="text-yellow-600 hover:text-yellow-800 text-sm"
                      >
                        <i class="bi bi-star"></i> {{ album.rating }}/5
                      </button>
                      <button
                        @click="removeAlbum(album.id)"
                        class="text-red-600 hover:text-red-800 text-sm"
                      >
                        <i class="bi bi-trash"></i> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recently Played Tab -->
          <div v-if="activeTab === 'recent'">
            <div v-if="recentlyPlayed.length === 0" class="text-center py-12">
              <i class="bi bi-clock-history text-6xl text-gray-400"></i>
              <p class="mt-4 text-gray-600">No recently played albums</p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="album in recentlyPlayed"
                :key="album.id"
                class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <i class="bi bi-vinyl text-lg text-gray-600"></i>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ album.title }}</h4>
                    <p class="text-sm text-gray-600">{{ album.artist }}</p>
                    <p class="text-xs text-gray-500">{{ formatTime(album.playedAt) }}</p>
                  </div>
                </div>
                <button
                  @click="playAlbum(album.id)"
                  class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>

          <!-- Wishlist Tab -->
          <div v-if="activeTab === 'wishlist'">
            <div v-if="wishList.length === 0" class="text-center py-12">
              <i class="bi bi-heart text-6xl text-gray-400"></i>
              <p class="mt-4 text-gray-600">No albums in your wishlist</p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="item in wishList"
                :key="item.id"
                class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <i class="bi bi-vinyl text-lg text-gray-600"></i>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ item.title }}</h4>
                    <p class="text-sm text-gray-600">{{ item.artist }}</p>
                    <p class="text-sm font-medium text-green-600">${{ item.price }}</p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="moveToCollection(item.id)"
                    class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Move to Collection
                  </button>
                  <button
                    @click="removeFromWishlist(item.id)"
                    class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add Album Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Add Album to Collection</h3>
          <form @submit.prevent="addAlbum" class="mt-4 space-y-4">
            <input v-model="newAlbum.title" placeholder="Album Title" class="w-full px-3 py-2 border rounded-md" required />
            <input v-model="newAlbum.artist" placeholder="Artist" class="w-full px-3 py-2 border rounded-md" required />
            <input v-model="newAlbum.genre" placeholder="Genre" class="w-full px-3 py-2 border rounded-md" required />
            <input v-model="newAlbum.year" type="number" placeholder="Year" class="w-full px-3 py-2 border rounded-md" />
            <select v-model="newAlbum.condition" class="w-full px-3 py-2 border rounded-md">
              <option value="excellent">Excellent</option>
              <option value="very good">Very Good</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
            <input v-model="newAlbum.price" type="number" step="0.01" placeholder="Price" class="w-full px-3 py-2 border rounded-md" />
            <textarea v-model="newAlbum.notes" placeholder="Notes" class="w-full px-3 py-2 border rounded-md" rows="3"></textarea>
            
            <div class="flex space-x-3">
              <button type="submit" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded">Add Album</button>
              <button type="button" @click="showAddModal = false" class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { useCollection } from '@/stores/collection'

const collection = useCollection()

const activeTab = ref('collection')
const showAddModal = ref(false)
const showWishlistModal = ref(false)
const showStatsModal = ref(false)

const newAlbum = ref({
  title: '',
  artist: '',
  genre: '',
  year: '',
  condition: 'excellent',
  price: 0,
  notes: ''
})

const {
  albums,
  wishList,
  recentlyPlayed,
  stats,
  recentlyPlayedCount
} = collection.collectionInfo

const addAlbum = () => {
  collection.manageCollection('add', newAlbum.value)
  newAlbum.value = {
    title: '',
    artist: '',
    genre: '',
    year: '',
    condition: 'excellent',
    price: 0,
    notes: ''
  }
  showAddModal.value = false
}

const removeAlbum = (id) => {
  if (confirm('Are you sure you want to remove this album?')) {
    collection.manageCollection('remove', id)
  }
}

const playAlbum = (id) => {
  collection.manageCollection('incrementPlayCount', id)
}

const rateAlbum = (id) => {
  const rating = prompt('Rate this album (1-5):')
  if (rating && rating >= 1 && rating <= 5) {
    collection.manageCollection('rateAlbum', { id, rating: parseInt(rating) })
  }
}

const moveToCollection = (id) => {
  const item = wishList.value.find(item => item.id === id)
  if (item) {
    collection.manageCollection('moveToCollection', item)
  }
}

const removeFromWishlist = (id) => {
  collection.manageCollection('removeFromWishlist', id)
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}
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
</style>
