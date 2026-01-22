import { defineStore } from "pinia"
import { useNotifications } from "./notifications"

export const useProducts = defineStore("products", {
  state: () => ({
    products: [
      { id: 1, name: "The Dark Side of the Moon", artist: "Pink Floyd", price: 29.99, category: "Rock", type: "vinyl", condition: "excellent", image: "https://picsum.photos/300/300?random=1", description: "Classic progressive rock masterpiece from 1973" },
      { id: 2, name: "Thriller", artist: "Michael Jackson", price: 25.99, category: "Pop", type: "vinyl", condition: "very good", image: "https://picsum.photos/300/300?random=2", description: "The best-selling album of all time" },
      { id: 3, name: "Kind of Blue", artist: "Miles Davis", price: 34.99, category: "Jazz", type: "vinyl", condition: "excellent", image: "https://picsum.photos/300/300?random=3", description: "Legendary jazz album from 1959" },
      { id: 4, name: "Nevermind", artist: "Nirvana", price: 22.99, category: "Grunge", type: "vinyl", condition: "very good", image: "https://picsum.photos/300/300?random=4", description: "Iconic grunge album from 1991" },
      { id: 5, name: "Abbey Road", artist: "The Beatles", price: 31.99, category: "Rock", type: "vinyl", condition: "excellent", image: "https://picsum.photos/300/300?random=5", description: "Final studio album from The Beatles" }
    ],
    favorites: [],
    cart: [],
    searchHistory: [],
    recentlyViewed: [],
    recommendations: [],
    filters: { category: null, searchTerm: null }
  }),
  
  getters: {
    productInfo: (state) => ({
      all: state.products,
      getProductById: (id) => state.products.find(p => p.id === id),
      favoriteProducts: state.products.filter(p => state.favorites.includes(p.id)),
      cartItems: state.cart.map(cartItem => {
        const product = state.products.find(p => p.id === cartItem.id)
        return { id: cartItem.id, name: product?.name || 'Unknown', price: product?.price || 0, quantity: cartItem.quantity || 1 }
      }),
      cartTotal: state.cart.reduce((total, cartItem) => {
        const product = state.products.find(p => p.id === cartItem.id)
        return total + ((product?.price || 0) * cartItem.quantity)
      }, 0),
      favoriteCount: state.favorites.length,
      cartItemCount: state.cart.reduce((count, item) => count + item.quantity, 0),
      searchResults: state.products.filter(product => {
        if (state.filters.category && product.category !== state.filters.category) return false
        if (state.filters.searchTerm && !product.name.toLowerCase().includes(state.filters.searchTerm.toLowerCase())) return false
        return true
      })
    })
  },

  actions: {
    manageProducts(operation, data) {
      switch(operation) {
        case 'search':
          state.filters.searchTerm = data
          break
        case 'filterByCategory':
          state.filters.category = data
          break
        case 'clearFilters':
          state.filters = { category: null, searchTerm: null }
          break
      }
    },

    manageFavorites(operation, data) {
      const notificationsStore = useNotifications()
      switch(operation) {
        case 'add':
          if (!state.favorites.includes(data)) {
            state.favorites.push(data)
            notificationsStore.createCartNotification(`❤️ "${state.products.find(p => p.id === data)?.name || 'Product'}" added to favorites!`)
          }
          break
        case 'remove':
          state.favorites = state.favorites.filter(id => id !== data)
          notificationsStore.createCartNotification(`💔 "${state.products.find(p => p.id === data)?.name || 'Product'}" removed from favorites`)
          break
        case 'clear':
          state.favorites = []
          notificationsStore.createCartNotification('🧹 All favorites cleared')
          break
      }
      localStorage.setItem("favorites", state.favorites.join(','))
    },

    manageCart(operation, data) {
      const notificationsStore = useNotifications()
      switch(operation) {
        case 'add':
          const existingItem = state.cart.find(item => item.id === data.id)
          if (existingItem) {
            existingItem.quantity += data.quantity || 1
          } else {
            state.cart.push({ id: data.id, quantity: data.quantity || 1 })
          }
          notificationsStore.createCartNotification(`🛒 "${state.products.find(p => p.id === data.id)?.name || 'Product'}" added to cart!`)
          break
        case 'remove':
          state.cart = state.cart.filter(item => item.id !== data)
          notificationsStore.createCartNotification(`🗑️ "${state.products.find(p => p.id === data)?.name || 'Product'}" removed from cart`)
          break
        case 'clear':
          state.cart = []
          notificationsStore.createCartNotification('🛒 Cart cleared')
          break
        case 'checkout':
          state.cart = []
          notificationsStore.createCartNotification('🎉 Order placed successfully! Cart cleared.')
          break
      }
      localStorage.setItem("cart", state.cart.map(item => `${item.id}:${item.quantity}`).join(','))
    },

    loadFromLocalStorage() {
      const savedFavorites = localStorage.getItem("favorites")
      if (savedFavorites) {
        this.favorites = savedFavorites.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
      }
      
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        this.cart = savedCart.split(',').map(item => {
          const [id, quantity] = item.split(':').map(Number)
          return { id: id || 0, quantity: quantity || 1 }
        })
      }
    }
  }
})
