<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex items-center">
        <div class="p-3 bg-blue-100 rounded-full">
          <i class="bi bi-cart w-6 h-6 text-blue-600"></i>
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-medium text-gray-900">Cart Items</h3>
          <p class="text-2xl font-bold text-blue-600">{{ cartCount }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex items-center">
        <div class="p-3 bg-red-100 rounded-full">
          <i class="bi bi-heart-fill w-6 h-6 text-red-600"></i>
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-medium text-gray-900">Favorites</h3>
          <p class="text-2xl font-bold text-red-600">{{ favoriteCount }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex items-center">
        <div class="p-3 bg-green-100 rounded-full">
          <i class="bi bi-bell w-6 h-6 text-green-600"></i>
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-medium text-gray-900">Notifications</h3>
          <p class="text-2xl font-bold text-green-600">{{ notificationCount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProducts } from '@/stores/products'
import { useNotifications } from '@/stores/notifications'

const productsStore = useProducts()
const notificationsStore = useNotifications()

const cartCount = computed(() => productsStore.productInfo.cartItemCount)
const favoriteCount = computed(() => productsStore.productInfo.favoriteCount)
const notificationCount = computed(() => notificationsStore.notificationInfo.unreadCount)
</script>
