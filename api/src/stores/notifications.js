import { defineStore } from "pinia"

export const useNotifications = defineStore("notifications", {
  state: () => ({
    notifications: [],
    settings: {
      sound: true,
      desktop: true,
      email: true,
      push: true,
      autoMarkAsRead: false,
      maxUnread: 50,
      theme: 'light',
      position: 'top-right'
    },
    filters: {
      type: null,
      priority: null,
      dateRange: null,
      searchTerm: null,
      unreadOnly: false
    },
    categories: ['system', 'user', 'cart', 'favorites', 'auth', 'player'],
    priorities: ['low', 'medium', 'high', 'critical']
  }),
  
  getters: {
    notificationInfo: (state) => ({
      all: state.notifications,
      unread: state.notifications.filter(n => !n.read),
      unreadCount: state.notifications.filter(n => !n.read).length,
      recent: state.notifications
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10),
      critical: state.notifications.filter(n => n.priority === 'critical'),
      byType: (type) => state.notifications.filter(n => n.type === type),
      byPriority: (priority) => state.notifications.filter(n => n.priority === priority),
      filtered: state.notifications.filter(n => {
        if (state.filters.type && n.type !== state.filters.type) return false
        if (state.filters.priority && n.priority !== state.filters.priority) return false
        if (state.filters.searchTerm && !n.message.toLowerCase().includes(state.filters.searchTerm.toLowerCase())) return false
        if (state.filters.unreadOnly && n.read) return false
        return true
      })
    })
  },

  actions: {
    addNotification(data) {
      const notification = {
        id: Date.now().toString(),
        type: data.type || 'user',
        title: data.title || 'Notification',
        message: data.message || '',
        priority: data.priority || 'low',
        read: false,
        timestamp: new Date().toISOString(),
        metadata: data.metadata || {}
      }
      this.notifications.unshift(notification)
      
      if (this.notifications.length > this.settings.maxUnread) {
        const excess = this.notifications.length - this.settings.maxUnread
        this.notifications.splice(-excess, excess)
      }
      
      return notification.id
    },

    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id)
    },

    markAsRead(id) {
      const notification = this.notifications.find(n => n.id === id)
      if (notification) {
        notification.read = true
        notification.readAt = new Date().toISOString()
      }
    },

    markAllAsRead() {
      this.notifications.forEach(n => {
        if (!n.read) {
          n.read = true
          n.readAt = new Date().toISOString()
        }
      })
    },

    clearNotifications() {
      this.notifications = []
    },

    updateSettings(newSettings) {
      Object.assign(this.settings, newSettings)
      this.saveSettingsToStorage()
    },

    toggleSetting(setting) {
      if (typeof this.settings[setting] === 'boolean') {
        this.settings[setting] = !this.settings[setting]
        this.saveSettingsToStorage()
      }
    },

    setFilter(filterType, value) {
      this.filters[filterType] = value
    },

    clearAllFilters() {
      this.filters = {
        type: null,
        priority: null,
        dateRange: null,
        searchTerm: null,
        unreadOnly: false
      }
    },

    markMultipleAsRead(ids) {
      const notificationIds = Array.isArray(ids) ? ids : [ids]
      notificationIds.forEach(id => this.markAsRead(id))
    },

    removeMultiple(ids) {
      const notificationIds = Array.isArray(ids) ? ids : [ids]
      this.notifications = this.notifications.filter(n => !notificationIds.includes(n.id))
    },

    createSystemNotification(message, priority = 'low') {
      return this.addNotification({
        type: 'system',
        title: 'System',
        message,
        priority
      })
    },

    createCartNotification(message, priority = 'low') {
      return this.addNotification({
        type: 'cart',
        title: 'Cart Update',
        message,
        priority
      })
    },

    createFavoritesNotification(message, priority = 'low') {
      return this.addNotification({
        type: 'favorites',
        title: 'Favorites Update',
        message,
        priority
      })
    },

    createAuthNotification(message, priority = 'medium') {
      return this.addNotification({
        type: 'auth',
        title: 'Authentication',
        message,
        priority
      })
    },

    createPlayerNotification(message, priority = 'low') {
      return this.addNotification({
        type: 'player',
        title: 'Player',
        message,
        priority
      })
    },

    getNotificationById(id) {
      return this.notifications.find(n => n.id === id)
    },

    getUnreadCount() {
      return this.notifications.filter(n => !n.read).length
    },

    hasUnreadCritical() {
      return this.notifications.some(n => !n.read && n.priority === 'critical')
    },

    saveToStorage() {
      localStorage.setItem("notifications", JSON.stringify(this.notifications))
    },

    saveSettingsToStorage() {
      localStorage.setItem("notification_settings", JSON.stringify(this.settings))
    },

    loadFromLocalStorage() {
      const savedNotifications = localStorage.getItem("notifications")
      if (savedNotifications) {
        try {
          this.notifications = JSON.parse(savedNotifications)
        } catch (e) {
          console.error('Failed to load notifications:', e)
          this.notifications = []
        }
      }
      
      const savedSettings = localStorage.getItem("notification_settings")
      if (savedSettings) {
        try {
          this.settings = { ...this.settings, ...JSON.parse(savedSettings) }
        } catch (e) {
          console.error('Failed to load notification settings:', e)
        }
      }
    }
  }
})
