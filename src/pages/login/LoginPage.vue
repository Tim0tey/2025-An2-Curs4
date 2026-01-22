<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 class="text-center text-3xl font-extrabold text-gray-900 mb-6">
            🎵 Vinyl Store Login
          </h2>
          
          <form class="space-y-6" @submit.prevent="handleLogin">
            <div>
              <label for="userName" class="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div class="mt-1">
                <input
                  id="userName"
                  v-model="form.userName"
                  name="userName"
                  type="text"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  v-model="form.email"
                  name="email"
                  type="email"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div class="mt-1 relative">
                <input
                  id="password"
                  v-model="form.password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
            </div>

            <div v-if="loginError" class="text-red-600 text-sm">
              {{ loginError }}
            </div>

            <div>
              <button
                type="submit"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </button>
            </div>
          </form>
          
          <div class="mt-6 text-center text-sm text-gray-600">
            <button
              @click="showForgotPassword = true"
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              Forgot your password?
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Reset Password
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>
          
          <form @submit.prevent="handleForgotPassword" class="mt-4 space-y-4">
            <div>
              <label for="resetEmail" class="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="resetEmail"
                v-model="resetEmail"
                type="email"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            
            <div v-if="resetError" class="text-red-600 text-sm">
              {{ resetError }}
            </div>
            
            <div v-if="resetSuccess" class="text-green-600 text-sm">
              {{ resetSuccess }}
            </div>
            
            <div class="flex space-x-3">
              <button
                type="submit"
                class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Send Reset Email
              </button>
              <button
                type="button"
                @click="closeForgotPassword"
                class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuth()
const router = useRouter()

const form = ref({
  userName: '',
  email: '',
  password: ''
})

const loginError = ref('')
const showPassword = ref(false)

const handleLogin = () => {
  const result = authStore.manageAuth('login', {
    userName: form.value.userName,
    email: form.value.email,
    password: form.value.password
  })
  
  if (result.success) {
    router.push('/')
  } else {
    loginError.value = result.message
  }
}

// Forgot password functionality
const showForgotPassword = ref(false)
const resetEmail = ref('')
const resetError = ref('')
const resetSuccess = ref('')

const handleForgotPassword = () => {
  resetError.value = ''
  resetSuccess.value = ''
  
  // Simulate sending reset email
  if (resetEmail.value) {
    // Store reset request in localStorage (in real app, this would be an API call)
    const resetRequests = JSON.parse(localStorage.getItem('passwordResetRequests') || '[]')
    const resetRequest = {
      id: Date.now(),
      email: resetEmail.value,
      timestamp: new Date().toISOString(),
      token: Math.random().toString(36).substr(2, 9)
    }
    resetRequests.push(resetRequest)
    localStorage.setItem('passwordResetRequests', JSON.stringify(resetRequests))
    
    resetSuccess.value = `Password reset instructions have been sent to ${resetEmail.value}`
    resetEmail.value = ''
    
    // Close modal after 3 seconds
    setTimeout(() => {
      closeForgotPassword()
    }, 3000)
  } else {
    resetError.value = 'Please enter a valid email address'
  }
}

const closeForgotPassword = () => {
  showForgotPassword.value = false
  resetEmail.value = ''
  resetError.value = ''
  resetSuccess.value = ''
}
</script>
