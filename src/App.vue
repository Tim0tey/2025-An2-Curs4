<template>
  <div id="app">
    <router-view />
    <NotificationToast />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import NotificationToast from '@/components/NotificationToast.vue'

onMounted(() => {
  console.log('App mounted successfully')
})
</script>

<style>
@import "bootstrap-icons";
@import "tailwindcss";

.btn-primary {
  background-color: rgb(192, 235, 238);
}
</style>
