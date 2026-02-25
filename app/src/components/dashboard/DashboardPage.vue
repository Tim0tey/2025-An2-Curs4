<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-gray-600">Welcome to your vinyl store dashboard</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- User Stats -->
        <UserStats />
        
        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <router-link
              to="/"
              class="block w-full text-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              🏠 Home
            </router-link>
            <router-link
              to="/shop"
              class="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              🛒 Browse Shop
            </router-link>
            <router-link
              to="/collection"
              class="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              🎵 My Collection
            </router-link>
            <router-link
              to="/player"
              class="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              🎧 Music Player
            </router-link>
          </div>
        </div>
        
        <!-- Notifications -->
        <NotificationsSection />
      </div>
    </div>
  </div>
</template>

<script setup>
import UserStats from './UserStats.vue'
import NotificationsSection from './NotificationsSection.vue'
</script>
