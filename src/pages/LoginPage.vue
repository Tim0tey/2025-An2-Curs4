<script setup>
import { useAuth } from "@/stores/auth"
import { ref } from "vue"
const auth = useAuth()

const resultAfterCheckedCredentials = ref(null)
const authentification = () => {
    resultAfterCheckedCredentials.value = auth.checkCredentials(username.value, password.value)
}

const username = ref("")
const password = ref("")
</script>

<template>
    <div class="grid place-items-center h-full">
        <h1>Login Page</h1>
        <div>
            <input type="text" placeholder="Username" class="border p-2 mb-2"/>
         </div>

         <div>   
            <input type="password" placeholder="Password" class="border p-2 mb-2"/>
        </div>
        <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="authentification">Login</button>
        <div v-if="resultAfterCheckedCredentials !== null" class="mt-4">
            <p v-if="resultAfterCheckedCredentials">Login successful!</p>
            <p v-else>Invalid username or password. Please try again.</p>
        </div>
    </div>
</template>
