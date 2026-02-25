import { defineStore } from "pinia"
import { useNotifications } from "./notifications"

export const useProducts = defineStore("products", {
  state: () => ({
    products: [
      { id: 1, name: "The Dark Side of the Moon", artist: "Pink Floyd", price: 29.99, category: "Rock", type: "vinyl", condition: "excellent", description: "Classic progressive rock masterpiece from 1973", tracks: ["Speak to Me", "Breathe", "On the Run", "Time", "The Great Gig in the Sky", "Money", "Us and Them", "Any Colour You Like", "Brain Damage", "Eclipse"] },
      { id: 2, name: "Thriller", artist: "Michael Jackson", price: 25.99, category: "Pop", type: "vinyl", condition: "very good", description: "The best-selling album of all time", tracks: ["Wanna Be Startin' Somethin'", "Baby Be Mine", "The Girl Is Mine", "Thriller", "Beat It", "Billie Jean", "Human Nature", "P.Y.T. (Pretty Young Thing)", "The Lady in My Life"] },
      { id: 3, name: "Kind of Blue", artist: "Miles Davis", price: 34.99, category: "Jazz", type: "vinyl", condition: "excellent", description: "Legendary jazz album from 1959", tracks: ["So What", "Freddie Freeloader", "Blue in Green", "All Blues", "Flamenco Sketches"] },
      { id: 4, name: "Nevermind", artist: "Nirvana", price: 22.99, category: "Grunge", type: "vinyl", condition: "very good", description: "Iconic grunge album from 1991", tracks: ["Smells Like Teen Spirit", "In Bloom", "Come as You Are", "Breed", "Lithium", "Polly", "Territorial Pissings", "Drain You", "Lounge Act", "Stay Away", "On a Plain", "Something in the Way"] },
      { id: 5, name: "Abbey Road", artist: "The Beatles", price: 31.99, category: "Rock", type: "vinyl", condition: "excellent", description: "Final studio album from The Beatles", tracks: ["Come Together", "Something", "Maxwell's Silver Hammer", "Oh! Darling", "Octopus's Garden", "I Want You (She's So Heavy)", "Here Comes the Sun", "Because", "You Never Give Me Your Money", "Sun King", "Mean Mr. Mustard", "Polythene Pam", "She Came in Through the Bathroom Window", "Golden Slumbers", "Carry That Weight", "The End", "Her Majesty"] }
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
          this.filters.searchTerm = data
          break
        case 'filterByCategory':
          this.filters.category = data
          break
        case 'clearFilters':
          this.filters = { category: null, searchTerm: null }
          break
      }
    },

    manageFavorites(operation, data) {
      const notificationsStore = useNotifications()
      switch(operation) {
        case 'add':
          if (!this.favorites.includes(data)) {
            this.favorites.push(data)
            notificationsStore.createCartNotification(`"${this.products.find(p => p.id === data)?.name || 'Product'}" added to favorites!`)
          }
          break
        case 'remove':
          this.favorites = this.favorites.filter(id => id !== data)
          // No notification when removing from favorites
          break
        case 'clear':
          this.favorites = []
          // No notification when clearing favorites
          break
      }
      // Save favorites to localStorage
      localStorage.setItem("favorites", this.favorites.join(','))
    },

    manageCart(operation, data) {
      const notificationsStore = useNotifications()
      switch(operation) {
        case 'add':
          const existingItem = this.cart.find(item => item.id === data.id)
          if (existingItem) {
            existingItem.quantity += data.quantity || 1
          } else {
            this.cart.push({ id: data.id, quantity: data.quantity || 1 })
          }
          notificationsStore.createCartNotification(` "${this.products.find(p => p.id === data.id)?.name || 'Product'}" added to cart!`)
          break
        case 'remove':
          this.cart = this.cart.filter(item => item.id !== data)
          break
        case 'clear':
          this.cart = []
          break
        case 'checkout':
          this.cart = []
          notificationsStore.createCartNotification(' Order placed successfully! Cart cleared.')
          break
      }
      // Save cart to localStorage
      localStorage.setItem("cart", this.cart.map(item => `${item.id}:${item.quantity}`).join(','))
    },

    loadFromLocalStorage() {
      const savedFavorites = localStorage.getItem("favorites")
      if (savedFavorites) {
        this.favorites = savedFavorites.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
      }
      
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        this.cart = savedCart.split(',').map(item => {
          const [id, quantity] = item.split(':')
          return { id: parseInt(id), quantity: parseInt(quantity) || 1 }
        })
      }
    }
  }
})
