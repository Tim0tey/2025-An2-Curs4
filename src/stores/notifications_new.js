import { defineStore } from "pinia"

export const useNotifications = defineStore("notifications", {
  state: () => ({
    notifications: []
  }),
  
  getters: {
    notificationInfo: (state) => ({
      all: state.notifications,
      unread: state.notifications.filter(n => !n.read),
      unreadCount: state.notifications.filter(n => !n.read).length,
      recent: state.notifications
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10),
      critical: state.notifications.filter(n => n.priority === 'critical')
    })
  },
  
  actions: {
    manageNotifications(operation, data) {
      const saveData = () => {
        localStorage.setItem("notifications", JSON.stringify(this.notifications))
      }
      
      switch(operation) {
        case 'add':
          const newNotification = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'normal',
            ...data
          }
          this.notifications.unshift(newNotification)
          break
        case 'mark':
          if (data === 'all') {
            this.notifications.forEach(n => n.read = true)
          } else {
            const notification = this.notifications.find(n => n.id === data)
            if (notification) notification.read = true
          }
          break
        case 'clear':
          this.notifications = []
          break
      }
      saveData()
    },
    
    loadFromLocalStorage() {
      const saved = localStorage.getItem("notifications")
      if (saved) {
        this.notifications = JSON.parse(saved)
      }
    }
  }
})
