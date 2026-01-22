<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-gray-600">Welcome to your VinylFie dashboard</p>
      </div>
      
      <div class="space-y-8">
        <UserHeader />
        <UserStats />
        
        <div class="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <NotificationsSection />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import UserHeader from '@/components/dashboard/UserHeader.vue'
import UserStats from '@/components/dashboard/UserStats.vue'
import NotificationsSection from '@/components/dashboard/NotificationsSection.vue'
import { useAuth } from '@/stores/auth'

const auth = useAuth()

onMounted(() => {
  // Validate session
  auth.manageAuth('validate')
})
</script>
