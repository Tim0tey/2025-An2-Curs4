import { defineStore } from "pinia"

const VALID_EMAIL = "user@example.com"
const VALID_PASSWORD = "password123"

export const useAuth = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    sessionStart: null
  }),
  
  getters: {
    authInfo: (state) => ({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      displayName: state.user?.name || 'Guest',
      userEmail: state.user?.email || '',
      userInitials: state.user?.name ? state.user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'G',
      isPremium: state.user?.isPremium || false,
      sessionDuration: state.sessionStart ? Date.now() - state.sessionStart : 0
    })
  },
  
  actions: {
    manageAuth(operation, data) {
      switch(operation) {
        case 'login':
          if (data.email === VALID_EMAIL && data.password === VALID_PASSWORD) {
            this.user = {
              name: data.userName || 'Vinyl Lover',
              email: data.email,
              isPremium: true
            }
            this.isAuthenticated = true
            this.sessionStart = Date.now()
            localStorage.setItem("auth", JSON.stringify({
              user: this.user,
              isAuthenticated: this.isAuthenticated,
              sessionStart: this.sessionStart
            }))
            return { success: true, message: "Login successful" }
          } else {
            return { success: false, message: "Invalid credentials" }
          }
          
        case 'logout':
          this.user = null
          this.isAuthenticated = false
          this.sessionStart = null
          localStorage.removeItem("auth")
          break
          
        case 'validate':
          if (this.sessionStart && Date.now() - this.sessionStart > 3600000) {
            this.manageAuth('logout')
          }
          break
          
        case 'extend':
          this.sessionStart = Date.now()
          localStorage.setItem("auth", JSON.stringify({
            user: this.user,
            isAuthenticated: this.isAuthenticated,
            sessionStart: this.sessionStart
          }))
          break
      }
    },
    
    loadFromLocalStorage() {
      const saved = localStorage.getItem("auth")
      if (saved) {
        const data = JSON.parse(saved)
        this.user = data.user
        this.isAuthenticated = data.isAuthenticated
        this.sessionStart = data.sessionStart
      }
    }
  }
})
