<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">🎵 Vinyl Store</h1>
          </div>
          <nav class="flex space-x-8">
            <router-link to="/" class="text-gray-700 hover:text-blue-600">Home</router-link>
            <router-link to="/shop" class="text-gray-700 hover:text-blue-600">Shop</router-link>
            <router-link to="/favorites" class="text-gray-700 hover:text-blue-600">Favorites</router-link>
            <router-link to="/cart" class="text-gray-700 hover:text-blue-600">Cart</router-link>
            <router-link v-if="!authStore.authInfo.isAuthenticated" to="/login" class="text-gray-700 hover:text-blue-600">Login</router-link>
            <button v-else @click="logout" class="text-gray-700 hover:text-blue-600">Logout</button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search Bar -->
      <div class="mb-8">
        <div class="max-w-md mx-auto">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search vinyl records..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <i class="bi bi-search w-5 h-5 text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div class="relative cursor-pointer" @click="viewDetails(product.id)">
            <img
              :src="product.image"
              :alt="product.name"
              class="w-full h-48 object-cover hover:opacity-90 transition-opacity"
            />
            <div class="absolute top-2 right-2">
              <span class="bg-blue-600 text-white px-2 py-1 text-xs rounded-full">
                {{ product.condition }}
              </span>
            </div>
            <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
              <div class="text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                <i class="bi bi-eye text-2xl"></i>
              </div>
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ product.artist }}</p>
            <p class="text-sm text-gray-500 mb-4">{{ product.category }}</p>
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-gray-900">${{ product.price }}</span>
              <div class="flex space-x-2">
                <button
                  @click="toggleFavorite(product.id)"
                  :class="isFavorite(product.id) ? 'text-red-600' : 'text-gray-400'"
                  class="hover:text-red-600 focus:outline-none"
                >
                  <i :class="isFavorite(product.id) ? 'bi bi-heart-fill' : 'bi bi-heart'" class="w-5 h-5"></i>
                </button>
                <button
                  @click="addToCart(product.id)"
                  class="text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  <i class="bi bi-cart-plus w-5 h-5"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProducts } from '@/stores/products'
import { useAuth } from '@/stores/auth'
import { useRouter } from 'vue-router'

const productsStore = useProducts()
const authStore = useAuth()
const router = useRouter()

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
  return productsStore.productInfo.isFavorite(productId)
}

const toggleFavorite = (productId) => {
  if (isFavorite(productId)) {
    productsStore.manageData('favorites', 'remove', productId)
  } else {
    productsStore.manageData('favorites', 'add', productId)
  }
}

const addToCart = (productId) => {
  productsStore.manageData('cart', 'add', { id: productId, quantity: 1 })
}

const viewDetails = (productId) => {
  router.push(`/vinyl/${productId}`)
}

const logout = () => {
  authStore.manageAuth('logout')
  router.push('/login')
}

onMounted(() => {
  // Load data from localStorage
  const savedFavorites = localStorage.getItem('favorites')
  const savedCart = localStorage.getItem('cart')
  
  if (savedFavorites) {
    productsStore.favorites = JSON.parse(savedFavorites)
  }
  if (savedCart) {
    productsStore.cart = JSON.parse(savedCart)
  }
})
</script>
