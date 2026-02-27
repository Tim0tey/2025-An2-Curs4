import { defineStore } from "pinia"

const VALID_EMAIL = "timotei.termure@emanuel.ro"
const VALID_PASSWORD = "timotei"

export const useAuth = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    sessionStart: null,
    loginAttempts: 0,
    passwordResetRequests: [],
    lastActivity: null,
    preferences: {
      theme: 'light',
      notifications: true,
      autoLogout: false,
      language: 'en'
    }
  }),
  
  getters: {
    authInfo: (state) => ({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      displayName: state.user?.name || 'Guest',
      userEmail: state.user?.email || '',
      userInitials: state.user?.name ? state.user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'G',
      isPremium: state.user?.isPremium || false,
      sessionDuration: state.sessionStart ? Date.now() - state.sessionStart : 0,
      loginAttempts: state.loginAttempts,
      lastActivity: state.lastActivity,
      preferences: state.preferences
    })
  },

  actions: {
    // Authentication Actions (4)
    manageAuth(operation, data) {
      switch(operation) {
        case 'login':
          const tempPassword = localStorage.getItem("temp_new_password")
          const isValidPassword = data.password === VALID_PASSWORD || data.password === tempPassword
          
          // Allow login with either VALID_EMAIL or any email that has a temp password
          const isValidEmail = data.email === VALID_EMAIL || (tempPassword && data.email.includes('@'))
          
          if (isValidEmail && isValidPassword) {
            this.user = {
              name: data.userName || 'Vinyl Lover',
              email: data.email,
              isPremium: true,
              loginDate: new Date().toISOString()
            }
            this.isAuthenticated = true
            this.sessionStart = Date.now()
            this.loginAttempts = 0
            this.lastActivity = 'login'
            
            localStorage.setItem("auth_user", data.userName || 'Vinyl Lover')
            localStorage.setItem("auth_email", data.email)
            localStorage.setItem("auth_authenticated", "true")
            localStorage.setItem("auth_session", this.sessionStart.toString())
            localStorage.setItem("auth_premium", "true")
            
            // Clear temporary password after successful login
            if (tempPassword) {
              localStorage.removeItem("temp_new_password")
            }
            
            return { success: true, message: "Login successful" }
          } else {
            this.loginAttempts++
            this.lastActivity = 'login_failed'
            return { success: false, message: "Invalid credentials" }
          }
          
        case 'logout':
          this.user = null
          this.isAuthenticated = false
          this.sessionStart = null
          this.lastActivity = 'logout'
          
          localStorage.removeItem("auth_user")
          localStorage.removeItem("auth_email")
          localStorage.removeItem("auth_authenticated")
          localStorage.removeItem("auth_session")
          localStorage.removeItem("auth_premium")
          break
          
        case 'validate':
          if (this.sessionStart && Date.now() - this.sessionStart > 3600000) {
            this.manageAuth('logout')
          }
          break
          
        case 'extend':
          this.sessionStart = Date.now()
          localStorage.setItem("auth_session", this.sessionStart.toString())
          this.lastActivity = 'session_extended'
          break
      }
    },

    // Password Management Actions (2)
    resetPassword(operation, data) {
      switch(operation) {
        case 'request':
          const resetToken = {
            token: Date.now().toString(),
            email: data.email,
            timestamp: new Date().toISOString()
          }
          
          this.passwordResetRequests.push(resetToken)
          localStorage.setItem('passwordResetRequests', JSON.stringify(this.passwordResetRequests))
          
          return { success: true, message: "Password reset email sent" }
          
        case 'validate':
          const resetRequests = JSON.parse(localStorage.getItem('passwordResetRequests') || '[]')
          const validRequest = resetRequests.find(req => 
            req.token === data.token && 
            req.email === data.email &&
            (Date.now() - new Date(req.timestamp).getTime()) < 24 * 60 * 60 * 1000
          )
          
          if (validRequest) {
            // Store new password temporarily for demo
            localStorage.setItem("temp_new_password", data.newPassword)
            return { success: true, message: "Password has been reset successfully" }
          } else {
            return { success: false, message: "Invalid or expired reset token" }
          }
      }
    },

    // User Management Actions (2)
    updateProfile(operation, data) {
      switch(operation) {
        case 'update':
          if (this.user) {
            Object.assign(this.user, data)
            this.lastActivity = 'profile_updated'
            localStorage.setItem("auth_user", this.user.name)
            localStorage.setItem("auth_email", this.user.email)
          }
          return { success: true, message: "Profile updated successfully" }
          
        case 'changePassword':
          if (this.user && data.currentPassword === VALID_PASSWORD) {
            this.user.password = data.newPassword
            this.lastActivity = 'password_changed'
            return { success: true, message: "Password changed successfully" }
          } else {
            return { success: false, message: "Current password is incorrect" }
          }
      }
    },

    // Session Management Actions (1)
    checkSession() {
      const sessionAge = this.sessionStart ? Date.now() - this.sessionStart : 0
      const isValid = sessionAge < 3600000 // 24 hours
      
      if (!isValid) {
        this.manageAuth('logout')
        return { valid: false, message: "Session expired" }
      }
      
      return { valid: isValid, message: "Session is valid" }
    },

    // Preferences Actions (1)
    updatePreferences(operation, data) {
      switch(operation) {
        case 'update':
          Object.assign(this.preferences, data)
          localStorage.setItem('auth_preferences', JSON.stringify(this.preferences))
          this.lastActivity = 'preferences_updated'
          return { success: true, message: "Preferences updated" }
      }
    },

    // Storage Actions (1)
    loadFromLocalStorage() {
    const userName = localStorage.getItem("auth_user")
    const userEmail = localStorage.getItem("auth_email")
    const isAuthenticated = localStorage.getItem("auth_authenticated") === "true"
    const sessionStart = localStorage.getItem("auth_session")
    const isPremium = localStorage.getItem("auth_premium") === "true"
    const preferences = JSON.parse(localStorage.getItem('auth_preferences') || '{}')
    const passwordResetRequests = JSON.parse(localStorage.getItem('passwordResetRequests') || '[]')
    
    if (userName && userEmail && isAuthenticated) {
      this.user = {
        name: userName,
        email: userEmail,
        isPremium: isPremium
      }
      this.sessionStart = sessionStart ? parseInt(sessionStart) : null
      this.isAuthenticated = isAuthenticated
      this.preferences = preferences
      this.passwordResetRequests = passwordResetRequests
    }
  }
  }
})
