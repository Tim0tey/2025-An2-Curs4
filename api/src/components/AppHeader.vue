<template>
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-gray-900">🎵 Vinyl Store</h1>
          <p class="mt-2 text-gray-600">Browse our collection</p>
        </div>
        
        <!-- Desktop Navigation - Only show when authenticated -->
        <nav v-if="authStore.authInfo.isAuthenticated" class="hidden md:flex space-x-8">
          <router-link to="/" class="text-gray-700 hover:text-blue-600">Home</router-link>
          <router-link to="/shop" class="text-blue-600 font-medium">Shop</router-link>
          <router-link to="/favorites" class="text-gray-700 hover:text-blue-600">Favorites</router-link>
          <router-link to="/cart" class="text-gray-700 hover:text-blue-600">Cart</router-link>
          <router-link to="/collection" class="text-gray-700 hover:text-blue-600">Collection</router-link>
          <router-link to="/player" class="text-gray-700 hover:text-blue-600">Player</router-link>
          <router-link to="/dashboard" class="text-gray-700 hover:text-blue-600">Dashboard</router-link>
        </nav>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <!-- Notifications - Only show when authenticated -->
          <div v-if="authStore.authInfo.isAuthenticated" class="relative">
            <button class="text-gray-700 hover:text-blue-600">
              <i class="bi bi-bell w-6 h-6"></i>
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{ notificationCount }}
              </span>
            </button>
          </div>

          <!-- Cart - Only show when authenticated -->
          <div v-if="authStore.authInfo.isAuthenticated" class="relative">
            <router-link to="/cart" class="text-gray-700 hover:text-blue-600">
              <i class="bi bi-cart w-6 h-6"></i>
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{ cartCount }}
              </span>
            </router-link>
          </div>

          <!-- User Menu -->
          <div v-if="authStore.authInfo.isAuthenticated" class="flex items-center space-x-2">
            <span class="text-sm text-gray-700">Hi, {{ authStore.authInfo.displayName }}</span>
            <button @click="logout" class="text-gray-700 hover:text-blue-600">
              Logout
            </button>
          </div>
          <router-link v-else to="/login" class="text-gray-700 hover:text-blue-600">
            Login
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuth } from '@/stores/auth'
import { useProducts } from '@/stores/products'
import { useNotifications } from '@/stores/notifications'
import { useRouter } from 'vue-router'

const authStore = useAuth()
const productsStore = useProducts()
const notificationsStore = useNotifications()
const router = useRouter()

const cartCount = computed(() => productsStore.productInfo.cartItemCount)
const notificationCount = computed(() => notificationsStore.notificationInfo.unreadCount)

const logout = () => {
  authStore.manageAuth('logout')
  router.push('/login')
}

// Load authentication state from localStorage on component mount
onMounted(() => {
  authStore.loadFromLocalStorage()
})
</script>
