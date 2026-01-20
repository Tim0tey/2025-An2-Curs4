import { defineStore } from "pinia"

const VALID_EMAIL = "timotei.termure@emanuel.ro"
const VALID_PASSWORD = "timotei"
const LS_KEY_AUTH = "auth:isAuthenticated"
const LS_KEY_EMAIL = "auth:userEmail"
const LS_KEY_NAME = "auth:userName"

export const useAuth = defineStore("auth", {
  state: () => ({
    isAuthenticated: localStorage.getItem(LS_KEY_AUTH) === "true",
    userEmail: localStorage.getItem(LS_KEY_EMAIL) || null,
    userName: localStorage.getItem(LS_KEY_NAME) || null,
  }),
  actions: {
    checkCredentials(email, password, userName) {
      const emailCorrect = email === VALID_EMAIL
      const passwordCorrect = password === VALID_PASSWORD
      
      if (emailCorrect && passwordCorrect) {
        this.isAuthenticated = true
        this.userEmail = email
        this.userName = userName?.trim() || null
        localStorage.setItem(LS_KEY_AUTH, "true")
        localStorage.setItem(LS_KEY_EMAIL, email)
        if (this.userName) localStorage.setItem(LS_KEY_NAME, this.userName)
        else localStorage.removeItem(LS_KEY_NAME)
        return { success: true }
      }
      
      // Return detailed error information
      return {
        success: false,
        emailError: !emailCorrect,
        passwordError: !passwordCorrect,
      }
    },
    logout() {
      this.isAuthenticated = false
      this.userEmail = null
      this.userName = null
      localStorage.setItem(LS_KEY_AUTH, "false")
      localStorage.removeItem(LS_KEY_EMAIL)
      localStorage.removeItem(LS_KEY_NAME)
    },
  }
})
