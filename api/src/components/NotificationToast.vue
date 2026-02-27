<template>
  <teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="bg-white rounded-lg shadow-lg border-l-4 p-4 min-w-80 transform transition-all duration-300"
        :class="{
          'border-green-500': notification.type === 'cart',
          'border-red-500': notification.type === 'error',
          'border-blue-500': notification.type === 'info',
          'border-yellow-500': notification.type === 'warning'
        }"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <i 
              class="w-5 h-5"
              :class="{
                'bi bi-check-circle text-green-500': notification.type === 'cart',
                'bi bi-exclamation-circle text-red-500': notification.type === 'error',
                'bi bi-info-circle text-blue-500': notification.type === 'info',
                'bi bi-exclamation-triangle text-yellow-500': notification.type === 'warning'
              }"
            ></i>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
          </div>
          <button
            @click="removeNotification(notification.id)"
            class="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <i class="bi bi-x w-4 h-4"></i>
          </button>
        </div>
        <!-- Auto-dismiss progress bar -->
        <div class="mt-2 bg-gray-200 rounded-full h-1">
          <div 
            class="bg-blue-500 h-1 rounded-full transition-all duration-100"
            :style="{ width: getProgressWidth(notification.id) + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useNotifications } from '@/stores/notifications'

const notificationsStore = useNotifications()
const notificationTimers = ref({})
const notificationProgress = ref({})

const notifications = computed(() => 
  notificationsStore.notificationInfo.recent.slice(0, 5)
)

const getProgressWidth = (id) => {
  return notificationProgress.value[id] || 100
}

const removeNotification = (id) => {
  // Clear timer if exists
  if (notificationTimers.value[id]) {
    clearInterval(notificationTimers.value[id])
    delete notificationTimers.value[id]
  }
  // Remove progress tracking
  delete notificationProgress.value[id]
  // Actually remove the notification from the store
  notificationsStore.removeNotification(id)
}

const startNotificationTimer = (notification) => {
  const id = notification.id
  const duration = 5000 // 5 seconds
  const interval = 100 // Update every 100ms
  let elapsed = 0
  
  // Initialize progress
  notificationProgress.value[id] = 100
  
  const progressTimer = setInterval(() => {
    elapsed += interval
    const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
    notificationProgress.value[id] = remaining
    
    if (elapsed >= duration) {
      clearInterval(progressTimer)
      // Use removeNotification to actually delete it
      notificationsStore.removeNotification(id)
      // Clean up timer and progress
      delete notificationTimers.value[id]
      delete notificationProgress.value[id]
    }
  }, interval)
  
  notificationTimers.value[id] = progressTimer
}

// Watch for new notifications and start timers
watch(notifications, (newNotifications) => {
  newNotifications.forEach(notification => {
    if (!notificationTimers.value[notification.id]) {
      startNotificationTimer(notification)
    }
  })
}, { deep: true })

onMounted(() => {
  notifications.value.forEach(notification => {
    startNotificationTimer(notification)
  })
})

onUnmounted(() => {
  // Clear all timers
  Object.values(notificationTimers.value).forEach(timer => {
    clearInterval(timer)
  })
})
</script>
