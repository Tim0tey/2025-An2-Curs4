<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
    
    <div v-if="notifications.length === 0" class="text-center py-8">
      <i class="bi bi-bell mx-auto h-12 w-12 text-gray-400"></i>
      <p class="mt-2 text-sm text-gray-500">No notifications</p>
    </div>
    
    <div v-else class="space-y-3">
      <div
        v-for="notification in recentNotifications"
        :key="notification.id"
        :class="[
          'p-3 rounded-lg border',
          notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
        ]"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <i class="bi bi-bell w-5 h-5" :class="notification.read ? 'text-gray-400' : 'text-blue-600'"></i>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-gray-900">{{ notification.title || 'Notification' }}</p>
            <p class="text-sm text-gray-500">{{ notification.message || 'No message' }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ formatTime(notification.timestamp) }}</p>
          </div>
          <div class="flex-shrink-0 ml-2">
            <button
              v-if="!notification.read"
              @click="markAsRead(notification.id)"
              class="text-blue-600 hover:text-blue-800 text-xs"
            >
              Mark as read
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-4 flex justify-between">
      <button
        @click="markAllAsRead"
        class="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        Mark all as read
      </button>
      <button
        @click="clearNotifications"
        class="text-red-600 hover:text-red-800 text-sm font-medium"
      >
        Clear all
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotifications } from '@/stores/notifications'

const notificationsStore = useNotifications()

const notifications = computed(() => notificationsStore.notificationInfo.all)
const recentNotifications = computed(() => notificationsStore.notificationInfo.recent)

const markAsRead = (id) => {
  notificationsStore.manageNotifications('mark', id)
}

const markAllAsRead = () => {
  notificationsStore.manageNotifications('mark', 'all')
}

const clearNotifications = () => {
  notificationsStore.manageNotifications('clear')
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}
</script>
