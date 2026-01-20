<script setup>
  import { useAuth } from "@/stores/auth"
  import { useRoute } from "vue-router"
  const auth = useAuth()
  const route = useRoute()
</script>

<template>
  <RouterView v-if="auth.isAuthenticated || route.path === '/login'" />
</template>

<style>
@import "bootstrap-icons";
@import "tailwindcss";

.btn-primary {
        background-color:rgb(192, 235, 238);
    }
</style>