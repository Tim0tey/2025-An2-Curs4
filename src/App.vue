<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '@/stores/auth'
import { useProducts } from '@/stores/products'
import { useNotifications } from '@/stores/notifications'
import { usePlayer } from '@/stores/player'
import { useCollection } from '@/stores/collection'

const auth = useAuth()
const products = useProducts()
const notifications = useNotifications()
const player = usePlayer()
const collection = useCollection()

onMounted(() => {
  try {
    // Initialize all stores with localStorage data
    if (auth && typeof auth.loadFromLocalStorage === 'function') {
      auth.loadFromLocalStorage()
    }
    
    if (notifications && typeof notifications.loadFromLocalStorage === 'function') {
      notifications.loadFromLocalStorage()
    }
    
    if (products && typeof products.loadFromLocalStorage === 'function') {
      products.loadFromLocalStorage()
    }
    
    if (player && typeof player.loadFromLocalStorage === 'function') {
      player.loadFromLocalStorage()
    }
    
    if (collection && typeof collection.loadFromLocalStorage === 'function') {
      collection.loadFromLocalStorage()
    }
  } catch (error) {
    console.error('Error loading stores:', error)
  }
})
</script>

<style>
@import "bootstrap-icons";
@import "tailwindcss";

.btn-primary {
  background-color: rgb(192, 235, 238);
}
</style>
