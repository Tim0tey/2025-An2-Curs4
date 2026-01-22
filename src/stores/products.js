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
        image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=Pink+Floyd",
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
        image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=Michael+Jackson",
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
        image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=Miles+Davis",
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
        image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=Nirvana",
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
        image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=The+Beatles",
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
      const saveData = (key, value) => localStorage.setItem(key, JSON.stringify(value))
      
      switch(type) {
        case 'favorites':
          if (operation === 'add' && !this.favorites.includes(data)) {
            this.favorites.push(data)
          } else if (operation === 'remove') {
            this.favorites = this.favorites.filter(id => id !== data)
          } else if (operation === 'clear') {
            this.favorites = []
          }
          saveData("favorites", this.favorites)
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
          saveData("cart", this.cart)
          break
      }
    }
  }
})
