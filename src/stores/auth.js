import { defineStore } from "pinia"

const VALID_EMAIL = "timotei.termure@emanuel.ro"
const VALID_PASSWORD = "timotei"

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
          const tempPassword = localStorage.getItem("temp_new_password")
          const isValidPassword = data.password === VALID_PASSWORD || data.password === tempPassword
          
          if (data.email === VALID_EMAIL && isValidPassword) {
            this.user = {
              name: data.userName || 'Vinyl Lover',
              email: data.email,
              isPremium: true
            }
            this.isAuthenticated = true
            this.sessionStart = Date.now()
            localStorage.setItem("auth_user", data.userName || 'Vinyl Lover')
            localStorage.setItem("auth_email", data.email)
            localStorage.setItem("auth_authenticated", "true")
            localStorage.setItem("auth_session", this.sessionStart.toString())
            
            // Clear temporary password after successful login
            if (tempPassword) {
              localStorage.removeItem("temp_new_password")
            }
            
            return { success: true, message: "Login successful" }
          } else {
            return { success: false, message: "Invalid credentials" }
          }
          
        case 'logout':
          this.user = null
          this.isAuthenticated = false
          this.sessionStart = null
          localStorage.removeItem("auth_user")
          localStorage.removeItem("auth_email")
          localStorage.removeItem("auth_authenticated")
          localStorage.removeItem("auth_session")
          break
          
        case 'validate':
          if (this.sessionStart && Date.now() - this.sessionStart > 3600000) {
            this.manageAuth('logout')
          }
          break
          
        case 'extend':
          this.sessionStart = Date.now()
          localStorage.setItem("auth_session", this.sessionStart.toString())
          break
          
        case 'resetPassword':
          // Check if reset token exists and is valid (within 24 hours)
          const resetRequests = JSON.parse(localStorage.getItem('passwordResetRequests') || '[]')
          const validRequest = resetRequests.find(req => 
            req.token === data.token && 
            req.email === data.email &&
            (Date.now() - new Date(req.timestamp).getTime()) < 24 * 60 * 60 * 1000
          )
          
          if (validRequest) {
            // Update user password (in real app, this would be server-side)
            if (data.email === VALID_EMAIL) {
              // Store new password temporarily for demo
              localStorage.setItem("temp_new_password", data.newPassword)
              return { success: true, message: "Password has been reset successfully" }
            } else {
              return { success: false, message: "Email not found in our system" }
            }
          } else {
            return { success: false, message: "Invalid or expired reset token" }
          }
          break
      }
    },
    
    loadFromLocalStorage() {
      const userName = localStorage.getItem("auth_user")
      const userEmail = localStorage.getItem("auth_email")
      const isAuthenticated = localStorage.getItem("auth_authenticated") === "true"
      const sessionStart = localStorage.getItem("auth_session")
      
      if (userName && userEmail && isAuthenticated) {
        this.user = {
          name: userName,
          email: userEmail,
          isPremium: true
        }
        this.isAuthenticated = isAuthenticated
        this.sessionStart = sessionStart ? parseInt(sessionStart) : null
      }
    }
  }
})
