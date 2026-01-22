<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

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
