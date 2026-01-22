<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Your Stats</h3>
    <div class="space-y-4">
      <div class="flex justify-between">
        <span class="text-sm text-gray-600">Cart Items</span>
        <span class="font-medium">{{ cartItemCount }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-gray-600">Favorites</span>
        <span class="font-medium text-red-600">{{ favoriteCount }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-gray-600">Notifications</span>
        <span class="font-medium text-blue-600">{{ notificationCount }}</span>
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

const cartItemCount = computed(() => productsStore.productInfo.cartItemCount)
const favoriteCount = computed(() => productsStore.productInfo.favoriteCount)
const notificationCount = computed(() => notificationsStore.notificationInfo.unreadCount)
</script>
