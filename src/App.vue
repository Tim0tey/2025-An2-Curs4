<script setup>
  import { useAuth } from "@/stores/auth"
  const auth = useAuth()
</script>

<template>
  <header v-if="auth.isAuthenticated" class="p-4 bg-gray-200">
    <nav class="flex gap-4 mb-4">
      <RouterLink to="/">
        Home
      </RouterLink>
      <RouterLink to="/flowers">
        Flowers
      </RouterLink> 
      <RouterLink to="/computed">
        Computed
      </RouterLink>
      <RouterLink to="/store">
        Store
      </RouterLink>
      <RouterLink to="/tasks">
        Tasks
      </RouterLink>
    </nav>
  </header>
  <RouterView v-if="auth.isAuthenticated || router.currentRoute.value.path === '/login'"/>
</template>

<style>
@import "bootstrap-icons";
@import "tailwindcss";

.btn-primary {
        background-color:rgb(192, 235, 238);
    }
</style>