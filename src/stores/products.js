import { defineStore } from "pinia"

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
        description: "Classic progressive rock masterpiece from 1973",
        // Audio properties for player
        duration: 2580, // 43 minutes in seconds
        trackList: [
          { title: "Speak to Me", duration: 60 },
          { title: "Breathe", duration: 174 },
          { title: "On the Run", duration: 225 },
          { title: "Time", duration: 420 },
          { title: "The Great Gig in the Sky", duration: 288 },
          { title: "Money", duration: 384 },
          { title: "Us and Them", duration: 462 },
          { title: "Any Colour You Like", duration: 204 },
          { title: "Brain Damage", duration: 228 },
          { title: "Eclipse", duration: 123 }
        ],
        audioUrl: "https://example.com/audio/dark-side-of-moon.mp3"
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
    cart: []
  }),
  
  getters: {
    productInfo: (state) => ({
      all: state.products,
      getProductById: (id) => state.products.find(p => p.id === id),
      isFavorite: (id) => state.favorites.includes(id),
      cartItems: state.cart.map(item => {
        const product = state.products.find(p => p.id === item.id)
        return { ...product, quantity: item.quantity }
      }),
      favoriteProducts: state.favorites.map(id => state.products.find(p => p.id === id)).filter(Boolean),
      cartTotal: state.cart.reduce((total, item) => {
        const product = state.products.find(p => p.id === item.id)
        return total + (product?.price || 0) * item.quantity
      }, 0),
      cartItemCount: state.cart.reduce((count, item) => count + item.quantity, 0),
      favoriteCount: state.favorites.length
    })
  },
  
  actions: {
    manageData(type, operation, data) {
      switch(type) {
        case 'favorites':
          if (operation === 'add' && !this.favorites.includes(data)) {
            this.favorites.push(data)
          } else if (operation === 'remove') {
            this.favorites = this.favorites.filter(id => id !== data)
          } else if (operation === 'clear') {
            this.favorites = []
          }
          // Save favorites as comma-separated string
          localStorage.setItem("favorites", this.favorites.join(','))
          break
          
        case 'cart':
          if (operation === 'add') {
            const existingItem = this.cart.find(item => item.id === data.id)
            if (existingItem) existingItem.quantity += data.quantity || 1
            else this.cart.push({ id: data.id, quantity: data.quantity || 1 })
          } else if (operation === 'remove') {
            this.cart = this.cart.filter(item => item.id !== data)
          } else if (operation === 'clear') {
            this.cart = []
          }
          // Save cart as string: id1:qty1,id2:qty2
          const cartString = this.cart.map(item => `${item.id}:${item.quantity}`).join(',')
          localStorage.setItem("cart", cartString)
          break
      }
    },
    
    loadFromLocalStorage() {
      // Load favorites
      const savedFavorites = localStorage.getItem("favorites")
      if (savedFavorites) {
        this.favorites = savedFavorites ? savedFavorites.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) : []
      }
      
      // Load cart
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        this.cart = savedCart ? savedCart.split(',').map(item => {
          const [id, quantity] = item.split(':').map(Number)
          return { id: id || 0, quantity: quantity || 1 }
        }).filter(item => item.id > 0) : []
      }
    }
  }
})
