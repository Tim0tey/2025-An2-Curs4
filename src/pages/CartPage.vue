<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">🛒 Shopping Cart</h1>
          </div>
          <nav class="flex space-x-8">
            <router-link to="/" class="text-gray-700 hover:text-blue-600">Home</router-link>
            <router-link to="/shop" class="text-gray-700 hover:text-blue-600">Shop</router-link>
            <router-link to="/favorites" class="text-gray-700 hover:text-blue-600">Favorites</router-link>
            <router-link to="/cart" class="text-gray-700 hover:text-blue-600">Cart</router-link>
            <button v-if="authStore.authInfo.isAuthenticated" @click="logout" class="text-gray-700 hover:text-blue-600">Logout</button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="cartItems.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M15 3h2l.4 2M7 13v8l4-8H5.4M15 3v8l-4 8" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
        <p class="mt-1 text-sm text-gray-500">
          Start shopping to add items to your cart
        </p>
        <div class="mt-6">
          <router-link
            to="/shop"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue Shopping
          </router-link>
        </div>
      </div>

      <div v-else>
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Shopping Cart</h3>
            <div class="mt-8">
              <ul role="list" class="divide-y divide-gray-200">
                <li v-for="item in cartItems" :key="item.id" class="py-6 flex">
                  <div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                    <img :src="item.image" :alt="item.name" class="w-full h-full object-center object-cover" />
                  </div>
                  <div class="ml-4 flex-1 flex flex-col">
                    <div>
                      <div class="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <a href="#" class="font-medium text-gray-900 hover:text-gray-700">
                            {{ item.name }}
                          </a>
                        </h3>
                        <p class="mt-1 text-sm text-gray-500">{{ item.artist }}</p>
                      </div>
                      <p class="mt-1 text-sm text-gray-500">{{ item.category }}</p>
                    </div>
                    <div class="flex-1 flex flex-col justify-between">
                      <p class="text-sm font-medium text-gray-900">${{ item.price }}</p>
                      <p class="mt-1 text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                      <div class="flex space-x-2">
                        <button
                          @click="removeFromCart(item.id)"
                          class="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="border-t border-gray-200 py-6 px-4 sm:px-6">
            <div class="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${{ cartTotal.toFixed(2) }}</p>
            </div>
            <div class="mt-6 space-y-3">
              <button
                @click="clearCart"
                class="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                🗑️ Clear Cart
              </button>
              <router-link
                to="/checkout"
                class="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Proceed to Checkout
              </router-link>
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

const cartItems = computed(() => productsStore.productInfo.cartItems)
const cartTotal = computed(() => productsStore.productInfo.cartTotal)

const removeFromCart = (productId) => {
  productsStore.manageCart('remove', productId)
}

const clearCart = () => {
  if (confirm('Are you sure you want to clear your entire cart?')) {
    productsStore.manageCart('clear')
  }
}

const logout = () => {
  authStore.manageAuth('logout')
  router.push('/login')
}

onMounted(() => {
  // Load cart using store method
  productsStore.loadFromLocalStorage()
})
</script>
