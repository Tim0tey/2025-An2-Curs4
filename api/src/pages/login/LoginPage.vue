<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <router-link to="/" class="font-medium text-blue-600 hover:text-blue-500">
          browse as guest
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Your Name</label>
            <div class="mt-1">
              <input
                id="name"
                v-model="userName"
                name="name"
                type="text"
                autocomplete="name"
                required
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Introduce Yourself"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="•••••••••"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i 
                  :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
                  class="h-5 w-5 text-gray-400 hover:text-gray-600"
                ></i>
              </button>
            </div>
          </div>

          <div v-if="showForgotPassword" class="flex items-center justify-between">
            <div class="text-sm">
              <a href="#" @click.prevent="handleForgotPassword" class="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <i class="bi bi-exclamation-triangle text-red-400"></i>
              </div>
              <div class="ml-3 text-sm text-red-700">
                {{ error }}
              </div>
            </div>
          </div>

          <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <i class="bi bi-check-circle text-green-400"></i>
              </div>
              <div class="ml-3 text-sm text-green-700">
                {{ successMessage }}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span v-if="!isLoading" class="absolute inset-y-0 left-0 flex items-center pl-3">
                <i class="bi bi-lock-open text-blue-500 group-hover:text-blue-400"></i>
              </span>
              <span v-else class="absolute inset-y-0 left-0 flex items-center pl-3">
                <i class="bi bi-arrow-clockwise text-blue-500 animate-spin"></i>
              </span>
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

const router = useRouter()
const authStore = useAuth()

const email = ref('')
const userName = ref('')
const password = ref('')
const error = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const showForgotPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    console.log('Attempting login with:', email.value, userName.value)
    
    // Validate input fields
    if (!userName.value.trim()) {
      error.value = 'Please enter your name'
      isLoading.value = false
      return
    }
    
    if (!email.value.trim()) {
      error.value = 'Please enter your email address'
      isLoading.value = false
      return
    }
    
    if (!password.value.trim()) {
      error.value = 'Please enter your password'
      isLoading.value = false
      return
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      error.value = 'Please enter a valid email address'
      isLoading.value = false
      return
    }
    
    const result = authStore.manageAuth('login', {
      email: email.value,
      userName: userName.value,
      password: password.value
    })
    
    console.log('Login result:', result)
    
    if (result.success) {
      console.log('Login successful, redirecting to home')
      successMessage.value = 'Login successful! Redirecting...'
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      console.log('Login failed:', result.message)
      showForgotPassword.value = true // Show forgot password option after failed login
      if (result.message.includes('Invalid credentials')) {
        error.value = 'Incorrect email or password. Please try again.'
      } else {
        error.value = result.message
      }
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = 'An unexpected error occurred. Please try again.'
  }
  
  isLoading.value = false
}

const handleForgotPassword = () => {
  const userInput = prompt('Enter your email address for password reset:')
  if (userInput) {
    // Check if user entered an email (contains @)
    if (userInput.includes('@')) {
      const newPassword = prompt('Enter your new password:')
      if (newPassword && newPassword.length >= 6) {
        // Store the new password temporarily
        localStorage.setItem("temp_new_password", newPassword)
        alert('Password reset successful! You can now login with your new password.')
        console.log('Password reset for:', userInput, 'with new password')
      } else if (newPassword) {
        error.value = 'Password must be at least 6 characters long'
      }
    } else {
      error.value = 'Please enter a valid email address (must contain @)'
    }
  }
}
</script>
