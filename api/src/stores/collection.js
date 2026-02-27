import { defineStore } from "pinia"

export const useCollection = defineStore("collection", {
  state: () => ({
    albums: [],           // User's vinyl collection
    wishList: [],         // Albums user wants to buy
    recentlyPlayed: [],   // Recently listened albums
    genres: [],           // User's favorite genres
    artists: [],          // User's favorite artists
    stats: {
      totalValue: 0,      // Total collection value
      totalAlbums: 0,     // Total number of albums
      averageCondition: 0, // Average condition rating
      mostValuable: null,  // Most valuable album
      favoriteGenre: '',    // Most collected genre
      topGenres: [],        // Top 3 genres
      totalPlayTime: 0     // Total listening time
    }
  }),
  
  getters: {
    collectionInfo: (state) => ({
      albums: state.albums,
      wishList: state.wishList,
      recentlyPlayed: state.recentlyPlayed,
      genres: state.genres,
      artists: state.artists,
      stats: state.stats,
      
      // Computed values
      totalWishlistValue: state.wishList.reduce((total, album) => total + (album.price || 0), 0),
      recentlyPlayedCount: state.recentlyPlayed.length,
      favoriteArtist: state.artists.length > 0 ? state.artists[0] : null,
      collectionByGenre: state.albums.reduce((acc, album) => {
        acc[album.genre] = (acc[album.genre] || 0) + 1
        return acc
      }, {}),
      topGenres: Object.entries(state.albums.reduce((acc, album) => {
        acc[album.genre] = (acc[album.genre] || 0) + 1
        return acc
      }, {})).sort(([,a], [,b]) => b - a).slice(0, 3).map(([genre]) => genre)
    })
  },
  
  actions: {
    // Album Management Actions (4)
    manageCollection(operation, data) {
      switch(operation) {
        case 'add':
          const newAlbum = {
            id: Date.now(),
            title: data.title,
            artist: data.artist,
            genre: data.genre || 'Unknown',
            year: data.year || new Date().getFullYear(),
            condition: data.condition || 'good',
            price: data.price || 0,
            purchaseDate: new Date().toISOString(),
            playCount: 0,
            rating: data.rating || 0,
            notes: data.notes || '',
            image: data.image || ''
          }
          state.albums.push(newAlbum)
          break
          
        case 'remove':
          state.albums = state.albums.filter(album => album.id !== data)
          break
          
        case 'update':
          const album = state.albums.find(a => a.id === data.id)
          if (album) {
            Object.assign(album, data)
          }
          break
          
        case 'clear':
          state.albums = []
          break
      }
    },

    // Wishlist Management Actions (3)
    manageWishlist(operation, data) {
      switch(operation) {
        case 'add':
          if (!state.wishList.find(item => item.id === data.id)) {
            state.wishList.push({
              id: data.id,
              title: data.title,
              artist: data.artist,
              price: data.price,
              addedDate: new Date().toISOString()
            })
          }
          break
          
        case 'remove':
          state.wishList = state.wishList.filter(item => item.id !== data)
          break
          
        case 'moveToCollection':
          const item = state.wishList.find(item => item.id === data.id)
          if (item) {
            // Remove from wishlist
            state.wishList = state.wishList.filter(wishlistItem => wishlistItem.id !== data.id)
            
            // Add to collection
            const albumData = {
              id: Date.now(),
              title: item.title,
              artist: item.artist,
              genre: item.genre || 'Unknown',
              year: item.year || new Date().getFullYear(),
              condition: 'good',
              price: item.price,
              purchaseDate: new Date().toISOString(),
              playCount: 0,
              rating: 0,
              notes: 'Moved from wishlist',
              image: item.image || ''
            }
            state.albums.push(albumData)
          }
          break
          
        case 'clear':
          state.wishList = []
          break
      }
    },

    // Recently Played Management Actions (2)
    manageRecentlyPlayed(operation, data) {
      switch(operation) {
        case 'add':
          const existingIndex = state.recentlyPlayed.findIndex(item => item.id === data.id)
          if (existingIndex !== -1) {
            state.recentlyPlayed.splice(existingIndex, 1)
          }
          state.recentlyPlayed.unshift({
            id: data.id,
            title: data.title,
            artist: data.artist,
            playedAt: new Date().toISOString()
          })
          break
          
        case 'remove':
          state.recentlyPlayed = state.recentlyPlayed.filter(item => item.id !== data)
          break
          
        case 'clear':
          state.recentlyPlayed = []
          break
      }
    },

    // Statistics Management Actions (1)
    manageStats(operation, data) {
      switch(operation) {
        case 'update':
          Object.assign(state.stats, data)
          break
          
        case 'reset':
          state.stats = {
            totalValue: 0,
            totalAlbums: 0,
            averageCondition: 0,
            mostValuable: null,
            favoriteGenre: '',
            topGenres: [],
            totalPlayTime: 0
          }
          break
      }
    }
  },

  loadFromLocalStorage() {
    // Load albums
    const savedAlbums = localStorage.getItem("collection_albums")
    if (savedAlbums) {
      state.albums = savedAlbums.split(';').map(albumStr => {
        const [id, title, artist, genre, year, condition, price, purchaseDate, playCount, rating, notes, image] = albumStr.split('|')
        return {
          id: parseInt(id) || 0,
          title: title || '',
          artist: artist || '',
          genre: genre || '',
          year: parseInt(year) || new Date().getFullYear(),
          condition: condition || 'good',
          price: parseFloat(price) || 0,
          purchaseDate: purchaseDate || new Date().toISOString(),
          playCount: parseInt(playCount) || 0,
          rating: parseInt(rating) || 0,
          notes: notes || '',
          image: image || ''
        }
      }).filter(album => album.id > 0 && album.title)
    }
    
    // Load wishlist
    const savedWishlist = localStorage.getItem("collection_wishlist")
    if (savedWishlist) {
      state.wishList = savedWishlist.split(';').map(itemStr => {
        const [id, title, artist, price, addedDate] = itemStr.split('|')
        return {
          id: parseInt(id) || 0,
          title: title || '',
          artist: artist || '',
          price: parseFloat(price) || 0,
          addedDate: addedDate || new Date().toISOString()
        }
      }).filter(item => item.id > 0 && item.title)
    }
    
    // Load recently played
    const savedRecent = localStorage.getItem("collection_recent")
    if (savedRecent) {
      state.recentlyPlayed = savedRecent.split(';').map(itemStr => {
        const [id, title, artist, playedAt] = itemStr.split('|')
        return {
          id: parseInt(id) || 0,
          title: title || '',
          artist: artist || '',
          playedAt: playedAt || new Date().toISOString()
        }
      }).filter(item => item.id > 0 && item.title)
    }
    
    // Load artists
    const savedArtists = localStorage.getItem("collection_artists")
    if (savedArtists) {
      state.artists = JSON.parse(savedArtists)
    }
    
    // Load statistics
    const savedStats = localStorage.getItem("collection_stats")
    if (savedStats) {
      state.statistics = JSON.parse(savedStats)
    }
  }
})
