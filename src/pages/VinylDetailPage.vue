<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back Button -->
      <div class="mb-6">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <i class="bi bi-arrow-left mr-2"></i>
          Back to Shop
        </button>
      </div>

      <div v-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Product Image -->
        <div class="space-y-4">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              :src="product.image"
              :alt="product.name"
              class="w-full h-96 object-cover"
            />
          </div>
          
          <!-- Vinyl Details -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Vinyl Details</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Condition:</span>
                <span class="font-medium">{{ product.condition }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Category:</span>
                <span class="font-medium">{{ product.category }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Type:</span>
                <span class="font-medium capitalize">{{ product.type }}</span>
              </div>
              <div v-if="product.duration" class="flex justify-between">
                <span class="text-gray-600">Duration:</span>
                <span class="font-medium">{{ formatDuration(product.duration) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <!-- Title and Artist -->
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
            <p class="text-xl text-gray-600">{{ product.artist }}</p>
          </div>

          <!-- Price -->
          <div class="flex items-baseline space-x-2">
            <span class="text-3xl font-bold text-gray-900">${{ product.price }}</span>
            <span class="text-gray-500">USD</span>
          </div>

          <!-- Description -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
          </div>

          <!-- Track List (if available) -->
          <div v-if="product.trackList && product.trackList.length > 0" class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Track List</h3>
            <div class="space-y-2">
              <div
                v-for="(track, index) in product.trackList"
                :key="index"
                class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
              >
                <div class="flex items-center space-x-3">
                  <span class="text-gray-400 text-sm w-6">{{ index + 1 }}</span>
                  <span class="text-gray-900">{{ track.title }}</span>
                </div>
                <span class="text-gray-500 text-sm">{{ formatDuration(track.duration) }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <div class="flex space-x-4">
              <!-- Add to Cart -->
              <button
                @click="addToCart"
                class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <i class="bi bi-cart-plus mr-2"></i>
                Add to Cart
              </button>
              
              <!-- Buy Now -->
              <button
                @click="buyNow"
                class="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <i class="bi bi-lightning-fill mr-2"></i>
                Buy Now
              </button>
            </div>

            <!-- Add to Favorites -->
            <button
              @click="toggleFavorite"
              :class="isFavorite ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-600 border-gray-200'"
              class="w-full px-6 py-3 rounded-lg border hover:bg-gray-100 transition-colors font-medium"
            >
              <i :class="isFavorite ? 'bi bi-heart-fill' : 'bi bi-heart'" class="mr-2"></i>
              {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
            </button>
          </div>

          <!-- Audio Preview (if available) -->
          <div v-if="product.audioUrl" class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Audio Preview</h3>
            <div class="flex items-center space-x-4">
              <button
                @click="togglePreview"
                class="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <i :class="isPreviewPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill'" class="text-xl"></i>
              </button>
              <div class="flex-1">
                <div class="bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" style="width: 30%"></div>
                </div>
              </div>
              <span class="text-sm text-gray-500">Preview</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="text-center py-12">
        <i class="bi bi-hourglass-split text-4xl text-gray-400 animate-spin"></i>
        <p class="mt-4 text-gray-600">Loading vinyl details...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="text-center py-12">
        <i class="bi bi-exclamation-triangle text-4xl text-red-400"></i>
        <p class="mt-4 text-red-600">{{ error }}</p>
        <button
          @click="$router.push('/shop')"
          class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Shop
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '@/stores/products'
import { useAuth } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()
const router = useRouter()
const productsStore = useProducts()
const authStore = useAuth()

const product = ref(null)
const error = ref('')
const isPreviewPlaying = ref(false)

// Get product ID from route params
const productId = parseInt(route.params.id)

// Check if product is favorite
const isFavorite = computed(() => {
  return product.value ? productsStore.productInfo.isFavorite(product.value.id) : false
})

// Load product data
onMounted(() => {
  const foundProduct = productsStore.productInfo.all.find(p => p.id === productId)
  
  if (foundProduct) {
    product.value = foundProduct
  } else {
    error.value = 'Vinyl record not found'
  }
})

// Format duration
const formatDuration = (seconds) => {
  if (!seconds) return 'Unknown'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Toggle favorite
const toggleFavorite = () => {
  if (!product.value) return
  
  if (isFavorite.value) {
    productsStore.manageData('favorites', 'remove', product.value.id)
  } else {
    productsStore.manageData('favorites', 'add', product.value.id)
  }
}

// Add to cart
const addToCart = () => {
  if (!product.value) return
  
  productsStore.manageData('cart', 'add', { id: product.value.id, quantity: 1 })
  
  // Show success message (you could use a toast notification here)
  alert(`${product.value.name} added to cart!`)
}

// Buy now (add to cart and redirect to cart)
const buyNow = () => {
  if (!product.value) return
  
  productsStore.manageData('cart', 'add', { id: product.value.id, quantity: 1 })
  router.push('/cart')
}

// Toggle audio preview
const togglePreview = () => {
  isPreviewPlaying.value = !isPreviewPlaying.value
  // In a real app, you would control actual audio playback here
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
