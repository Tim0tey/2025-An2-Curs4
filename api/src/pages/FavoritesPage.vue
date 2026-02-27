<template>
  <div class="min-h-screen bg-gray-50">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">❤️ My Favorites</h1>
        <p class="mt-2 text-gray-600">Your favorite vinyl records collection</p>
      </div>

      <div v-if="favoriteProducts.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 004.5 4.5v9A4.5 4.5 0 00-4.5 4.5h9A4.5 4.5 0 00-4.5-4.5v-9a4.5 4.5 0 004.5-4.5h-9z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l-3 3m0 0l3-3m-3 3h6" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No favorites yet</h3>
        <p class="mt-1 text-sm text-gray-500">
          Start adding vinyl records to your favorites
        </p>
        <div class="mt-6 space-y-3">
          <button
            @click="clearAllFavorites"
            class="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            🧹 Clear All Favorites
          </button>
          <router-link
            to="/shop"
            class="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Vinyl
          </router-link>
        </div>
      </div>

      <div v-else>
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Your Favorite Vinyl Records</h3>
            <div class="mt-8">
              <ul role="list" class="divide-y divide-gray-200">
                <li v-for="product in favoriteProducts" :key="product.id" class="py-6 flex">
                  <div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                    <img :src="product.image" :alt="product.name" class="w-full h-full object-center object-cover" />
                  </div>
                  <div class="ml-4 flex-1 flex flex-col">
                    <div>
                      <div class="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <a href="#" class="font-medium text-gray-900 hover:text-gray-700">
                            {{ product.name }}
                          </a>
                        </h3>
                        <p class="mt-1 text-sm text-gray-500">{{ product.artist }}</p>
                      </div>
                      <p class="mt-1 text-sm text-gray-500">{{ product.category }}</p>
                      <p class="mt-1 text-sm text-gray-500">{{ product.condition }}</p>
                    </div>
                    <div class="flex-1 flex flex-col justify-between">
                      <p class="text-sm font-medium text-gray-900">${{ product.price }}</p>
                      <div class="flex space-x-2">
                        <button
                          @click="removeFromFavorites(product.id)"
                          class="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                        <button
                          @click="addToCart(product.id)"
                          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useProducts } from '@/stores/products'
import { useAuth } from '@/stores/auth'
import { useRouter } from 'vue-router'

const productsStore = useProducts()
const authStore = useAuth()
const router = useRouter()

const favoriteProducts = computed(() => productsStore.productInfo.favoriteProducts)

const removeFromFavorites = (productId) => {
  productsStore.manageFavorites('remove', productId)
}

const addToCart = (productId) => {
  productsStore.manageCart('add', { id: productId, quantity: 1 })
}

const clearAllFavorites = () => {
  if (confirm('Are you sure you want to clear all your favorites?')) {
    productsStore.manageFavorites('clear')
  }
}

const logout = () => {
  authStore.manageAuth('logout')
  router.push('/login')
}

onMounted(() => {
  // Load favorites using store method
  productsStore.loadFromLocalStorage()
})
</script>
