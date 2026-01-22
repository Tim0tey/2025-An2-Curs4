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
      // Save notifications as string: id|timestamp|read|priority|message;id|timestamp|read|priority|message
      const notificationString = this.notifications.map(notif => 
        `${notif.id}|${notif.timestamp}|${notif.read}|${notif.priority}|${notif.message || ''}`
      ).join(';')
      localStorage.setItem("notifications", notificationString)
    },
    
    loadFromLocalStorage() {
      const saved = localStorage.getItem("notifications")
      if (saved) {
        this.notifications = saved.split(';').map(notifStr => {
          const [id, timestamp, read, priority, message] = notifStr.split('|')
          return {
            id: parseInt(id) || 0,
            timestamp: timestamp || new Date().toISOString(),
            read: read === 'true',
            priority: priority || 'normal',
            message: message || ''
          }
        }).filter(notif => notif.id > 0)
      }
    }
  }
})
