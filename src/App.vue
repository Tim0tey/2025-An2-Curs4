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
  // Initialize all stores with localStorage data
  auth.loadFromLocalStorage()
  notifications.loadFromLocalStorage()
  products.loadFromLocalStorage()
  player.loadFromLocalStorage()
  collection.loadFromLocalStorage()
})
</script>

<style>
@import "bootstrap-icons";
@import "tailwindcss";

.btn-primary {
  background-color: rgb(192, 235, 238);
}
</style>