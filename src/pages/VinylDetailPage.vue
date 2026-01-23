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
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="h-80 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <i class="bi bi-music-note text-gray-500 text-6xl"></i>
            </div>
          </div>
        </div>

        <!-- Product Details -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h1 class="text-2xl font-bold text-gray-900">{{ product.name }}</h1>
            <p class="text-lg text-gray-600 mt-2">{{ product.artist }}</p>
            <p class="text-gray-500 mt-1">{{ product.category }} • {{ product.condition }}</p>
            <p class="text-gray-700 mt-4">{{ product.description }}</p>
            
            <div class="mt-6 space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-gray-900">${{ product.price }}</span>
                <span class="text-sm text-gray-500">per vinyl</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-4">
              <button
                @click="toggleFavorite"
                :class="isFavorite ? 'text-red-600' : 'text-gray-400'"
                class="flex items-center px-4 py-2 border border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <i :class="isFavorite ? 'bi bi-heart-fill' : 'bi bi-heart'" class="w-5 h-5"></i>
                <span class="ml-2">{{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}</span>
              </button>
              
              <button
                @click="addToCart"
                class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <i class="bi bi-cart-plus w-5 h-5"></i>
                <span class="ml-2">Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Track Listing -->
      <div v-if="product && product.tracks" class="mt-8">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Track Listing</h2>
          <div class="space-y-2">
            <div 
              v-for="(track, index) in product.tracks" 
              :key="index"
              class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span class="text-sm font-medium text-gray-500 w-8">{{ index + 1 }}.</span>
              <span class="text-gray-900">{{ track }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading product details...</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '@/stores/products'
import { useAuth } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()
const router = useRouter()
const productsStore = useProducts()
const authStore = useAuth()

const productId = parseInt(route.params.id)
const product = computed(() => productsStore.productInfo.getProductById(productId))
const isFavorite = computed(() => productsStore.productInfo.favoriteProducts.some(p => p.id === productId))

const toggleFavorite = () => {
  if (isFavorite.value) {
    productsStore.manageFavorites('remove', productId)
  } else {
    productsStore.manageFavorites('add', productId)
  }
}

const addToCart = () => {
  if (product.value) {
    productsStore.manageCart('add', { id: product.value.id, quantity: 1 })
  }
}

const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  productsStore.loadFromLocalStorage()
})
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
