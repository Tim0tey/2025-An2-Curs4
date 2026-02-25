<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center space-x-4">
      <div class="flex-shrink-0">
        <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <i class="bi bi-person text-gray-600 text-xl"></i>
        </div>
      </div>
      <div>
        <h2 class="text-lg font-medium text-gray-900">{{ displayName }}</h2>
        <p class="text-sm text-gray-600">{{ userEmail }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '@/stores/auth'

const authStore = useAuth()

const displayName = computed(() => authStore.authInfo.displayName)
const userEmail = computed(() => authStore.authInfo.userEmail)
</script>
