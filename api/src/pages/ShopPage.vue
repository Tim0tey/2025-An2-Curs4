<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">🎵 Vinyl Store</h1>
        <p class="mt-2 text-gray-600">Browse our collection of vinyl records</p>
      </div>

      <!-- Search Bar -->
      <div class="mb-8">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search vinyl records..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative cursor-pointer"
          @click="viewDetails(product.id)"
        >
          <div class="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
            <i class="bi bi-music-note text-gray-500 text-4xl"></i>
          </div>
          <div class="absolute top-2 right-2">
            <span class="bg-blue-600 text-white px-2 py-1 text-xs rounded-full">{{ product.condition }}</span>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
            <p class="text-sm text-gray-600">{{ product.artist }}</p>
            <p class="text-xs text-gray-500">{{ product.category }}</p>
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-gray-900">${{ product.price }}</span>
              <button
                  @click.stop="toggleFavorite(product.id)"
                  :class="isFavorite(product.id) ? 'text-red-600 hover:text-red-800' : 'text-gray-400 hover:text-red-600'"
                  class="p-2 rounded-full"
                >
                  <i :class="isFavorite(product.id) ? 'bi bi-heart-fill' : 'bi bi-heart'" class="w-5 h-5"></i>
                </button>
              <button
                  @click.stop="addToCart(product.id)"
                  class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  <i class="bi bi-cart-plus w-5 h-5"></i>
                </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '@/stores/products'
import { useAuth } from '@/stores/auth'

const router = useRouter()
const productsStore = useProducts()
const authStore = useAuth()

const searchQuery = ref('')

const filteredProducts = computed(() => {
  if (!searchQuery.value) return productsStore.productInfo.all
  const query = searchQuery.value.toLowerCase()
  return productsStore.productInfo.all.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.artist.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query)
  )
})

const isFavorite = (productId) => {
  return productsStore.productInfo.favoriteProducts.some(p => p.id === productId)
}

const toggleFavorite = (productId) => {
  if (isFavorite(productId)) {
    productsStore.manageFavorites('remove', productId)
  } else {
    productsStore.manageFavorites('add', productId)
  }
}

const addToCart = (productId) => {
  productsStore.manageCart('add', { id: productId, quantity: 1 })
}

const viewDetails = (productId) => {
  router.push(`/vinyl/${productId}`)
}

const logout = () => {
  authStore.manageAuth('logout')
  router.push('/login')
}

onMounted(() => {
  productsStore.loadFromLocalStorage()
})
</script>
