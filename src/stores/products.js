import { defineStore } from "pinia"
import { useNotifications } from "./notifications"

export const useProducts = defineStore("products", {
  state: () => ({
    products: [
      {
        id: 1,
        name: "The Dark Side of the Moon",
        artist: "Pink Floyd",
        price: 29.99,
        category: "Rock",
        type: "vinyl",
        condition: "excellent",
        image: "https://picsum.photos/300/300?random=1",
        description: "Classic progressive rock masterpiece from 1973"
      },
      {
        id: 2,
        name: "Thriller",
        artist: "Michael Jackson",
        price: 25.99,
        category: "Pop",
        type: "vinyl",
        condition: "very good",
        image: "https://picsum.photos/300/300?random=2",
        description: "The best-selling album of all time"
      },
      {
        id: 3,
        name: "Kind of Blue",
        artist: "Miles Davis",
        price: 34.99,
        category: "Jazz",
        type: "vinyl",
        condition: "excellent",
        image: "https://picsum.photos/300/300?random=3",
        description: "Legendary jazz album from 1959"
      },
      {
        id: 4,
        name: "Nevermind",
        artist: "Nirvana",
        price: 22.99,
        category: "Grunge",
        type: "vinyl",
        condition: "very good",
        image: "https://picsum.photos/300/300?random=4",
        description: "Iconic grunge album from 1991"
      },
      {
        id: 5,
        name: "Abbey Road",
        artist: "The Beatles",
        price: 31.99,
        category: "Rock",
        type: "vinyl",
        condition: "excellent",
        image: "https://picsum.photos/300/300?random=5",
        description: "Final studio album from The Beatles"
      }
    ],
    favorites: [],
    cart: [],
    searchHistory: [],
    recentlyViewed: [],
    recommendations: [],
    categories: ["Rock", "Pop", "Jazz", "Grunge", "Classical", "Electronic"],
    priceRange: {
      min: 0,
      max: 1000
    },
    filters: {
      category: null,
      priceRange: null,
      condition: null,
      searchTerm: null
    }
  }),
  
  getters: {
    productInfo: (state) => ({
      all: state.products,
      getProductById: (id) => state.products.find(p => p.id === id),
      favoriteProducts: state.products.filter(p => state.favorites.includes(p.id)),
      cartItems: state.cart.map(cartItem => {
        const product = state.products.find(p => p.id === cartItem.id)
        return {
          id: cartItem.id,
          name: product?.name || 'Unknown Product',
          artist: product?.artist || 'Unknown Artist',
          price: product?.price || 0,
          category: product?.category || 'Unknown',
          type: product?.type || 'unknown',
          condition: product?.condition || 'unknown',
          image: product?.image || '',
          description: product?.description || '',
          quantity: cartItem.quantity || 1
        }
      }),
      cartTotal: state.cart.reduce((total, cartItem) => {
        const product = state.products.find(p => p.id === cartItem.id)
        return total + ((product?.price || 0) * cartItem.quantity)
      }, 0),
      favoriteCount: state.favorites.length,
      cartItemCount: state.cart.reduce((count, item) => count + item.quantity, 0),
      searchResults: state.products.filter(product => {
        if (state.filters.category && product.category !== state.filters.category) return false
        if (state.filters.priceRange) {
          const [min, max] = state.filters.priceRange
          if (product.price < min || product.price > max) return false
        }
        if (state.filters.condition && product.condition !== state.filters.condition) return false
        if (state.filters.searchTerm && !product.name.toLowerCase().includes(state.filters.searchTerm.toLowerCase())) return false
        return true
      }),
      recentlyViewed: state.recentlyViewed,
      recommendations: state.recommendations,
      categories: state.categories,
      priceRange: state.priceRange,
      activeFilters: state.filters
    })
  },

  actions: {
    manageProducts(operation, data) {
      switch(operation) {
        case 'add':
          const newProduct = {
            id: Date.now(),
            ...data,
            addedDate: new Date().toISOString()
          }
          state.products.push(newProduct)
          break
          
        case 'remove':
          state.products = state.products.filter(p => p.id !== data)
          break
          
        case 'update':
          const product = state.products.find(p => p.id === data.id)
          if (product) {
            Object.assign(product, data)
          }
          break
          
        case 'search':
          state.filters.searchTerm = data
          break
          
        case 'filterByCategory':
          state.filters.category = data
          break
          
        case 'filterByPriceRange':
          state.filters.priceRange = data
          break
          
        case 'filterByCondition':
          state.filters.condition = data
          break
          
        case 'clearFilters':
          state.filters = {
            category: null,
            priceRange: null,
            condition: null,
            searchTerm: null
          }
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
      
      // Save favorites as comma-separated string
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
          
        case 'update':
          const item = state.cart.find(item => item.id === data.id)
          if (item) {
            Object.assign(item, data)
          }
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
      
      // Save cart as string: id1:qty1,id2:qty2
      const cartString = state.cart.map(item => `${item.id}:${item.quantity}`).join(',')
      localStorage.setItem("cart", cartString)
    },

    manageSearch(operation, data) {
      switch(operation) {
        case 'history':
          state.searchHistory.push({
            term: data,
            timestamp: new Date().toISOString()
          })
          break
          
        case 'clearHistory':
          state.searchHistory = []
          break
      }
    },

    manageRecommendations(operation, data) {
      switch(operation) {
        case 'generate':
          const userFavorites = state.favorites
          const favoriteProducts = state.products.filter(p => userFavorites.includes(p.id))
          const recommendations = state.products
            .filter(p => !userFavorites.includes(p.id))
            .slice(0, 5)
            .map(p => ({
              ...p,
              recommended: true,
              reason: 'Based on your favorites'
            }))
          
          state.recommendations = recommendations
          break
          
        case 'clear':
          state.recommendations = []
          break
      }
    },

    trackInteraction(operation, data) {
      switch(operation) {
        case 'view':
          const existingIndex = state.recentlyViewed.findIndex(p => p.id === data.id)
          if (existingIndex === -1) {
            state.recentlyViewed.unshift({
              productId: data.id,
              timestamp: new Date().toISOString()
            })
          } else {
            state.recentlyViewed[existingIndex] = {
              productId: data.id,
              timestamp: new Date().toISOString()
            }
          }
          break
          
        case 'addToHistory':
          state.searchHistory.push({
            term: data,
            timestamp: new Date().toISOString()
          })
          break
      }
    },

    loadFromLocalStorage() {
      // Load products
      const savedProducts = localStorage.getItem("products")
      if (savedProducts) {
        this.products = JSON.parse(savedProducts)
      }
      
      // Load favorites
      const savedFavorites = localStorage.getItem("favorites")
      if (savedFavorites) {
        this.favorites = savedFavorites.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
      }
      
      // Load cart
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        this.cart = savedCart.split(',').map(item => {
          const [id, quantity] = item.split(':').map(Number)
          return { id: id || 0, quantity: quantity || 1 }
        })
      }
      
      // Load search history
      const savedSearchHistory = localStorage.getItem("searchHistory")
      if (savedSearchHistory) {
        this.searchHistory = JSON.parse(savedSearchHistory)
      }
      
      // Load recently viewed
      const savedRecentlyViewed = localStorage.getItem("recentlyViewed")
      if (savedRecentlyViewed) {
        this.recentlyViewed = JSON.parse(savedRecentlyViewed)
      }
      
      // Load recommendations
      const savedRecommendations = localStorage.getItem("recommendations")
      if (savedRecommendations) {
        this.recommendations = JSON.parse(savedRecommendations)
      }
    }
  }
})
