<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Notifications</h3>
    <div class="space-y-3">
      <div
        v-for="notification in recentNotifications"
        :key="notification.id"
        class="flex items-start space-x-3 p-3 border-b border-gray-200 hover:bg-gray-50"
      >
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="bi bi-bell text-blue-600"></i>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
          <p class="text-sm text-gray-600">{{ notification.message }}</p>
          <p class="text-xs text-gray-500">{{ formatDate(notification.timestamp) }}</p>
        </div>
      </div>
    </div>
    
    <div v-if="recentNotifications.length === 0" class="text-center py-8">
      <i class="bi bi-bell text-4xl text-gray-400"></i>
      <p class="mt-2 text-gray-600">No recent notifications</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotifications } from '@/stores/notifications'

const notificationsStore = useNotifications()

const recentNotifications = computed(() => notificationsStore.notificationInfo.recent)

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString()
}
</script>
