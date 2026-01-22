<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {{ authStore.authInfo.userInitials }}
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">{{ authStore.authInfo.displayName }}</h2>
          <p class="text-sm text-gray-500">{{ authStore.authInfo.userEmail }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <span v-if="authStore.authInfo.isPremium" class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
          Premium
        </span>
        <button @click="logout" class="text-red-600 hover:text-red-800 text-sm font-medium">
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuth()
const router = useRouter()

const logout = () => {
  authStore.manageAuth('logout')
  router.push('/login')
}
</script>
