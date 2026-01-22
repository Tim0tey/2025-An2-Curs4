import { defineStore } from "pinia"

export const useCollection = defineStore("collection", {
  state: () => ({
    albums: [],           // User's vinyl collection
    wishList: [],         // Albums user wants to buy
    recentlyPlayed: [],   // Recently listened albums
    genres: [],           // Genre preferences
    artists: [],          // Favorite artists
    stats: {
      totalValue: 0,      // Collection value
      totalAlbums: 0,     // Number of albums
      averageCondition: 0, // Average condition
      mostValuable: null, // Most valuable album
      favoriteGenre: ''   // Most collected genre
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
    manageCollection(operation, data) {
      switch(operation) {
        case 'add':
          const newAlbum = {
            id: Date.now(),
            title: data.title,
            artist: data.artist,
            genre: data.genre,
            year: data.year || new Date().getFullYear(),
            condition: data.condition || 'excellent',
            price: data.price || 0,
            purchaseDate: new Date().toISOString(),
            playCount: 0,
            rating: data.rating || 0,
            notes: data.notes || '',
            image: data.image || ''
          }
          this.albums.push(newAlbum)
          this.updateStats()
          break
          
        case 'remove':
          this.albums = this.albums.filter(album => album.id !== data)
          this.updateStats()
          break
          
        case 'update':
          const albumToUpdate = this.albums.find(a => a.id === data.id)
          if (albumToUpdate) {
            Object.assign(albumToUpdate, data)
            this.updateStats()
          }
          break
          
        case 'addToWishlist':
          if (!this.wishList.find(item => item.id === data.id)) {
            this.wishList.push({
              id: data.id,
              title: data.title,
              artist: data.artist,
              price: data.price,
              addedDate: new Date().toISOString()
            })
          }
          break
          
        case 'removeFromWishlist':
          this.wishList = this.wishList.filter(item => item.id !== data)
          break
          
        case 'moveToCollection':
          const wishlistItem = this.wishList.find(item => item.id === data.id)
          if (wishlistItem) {
            this.manageCollection('add', wishlistItem)
            this.manageCollection('removeFromWishlist', data.id)
          }
          break
          
        case 'addToRecentlyPlayed':
          const existingIndex = this.recentlyPlayed.findIndex(item => item.id === data.id)
          if (existingIndex !== -1) {
            this.recentlyPlayed.splice(existingIndex, 1)
          }
          this.recentlyPlayed.unshift({
            id: data.id,
            title: data.title,
            artist: data.artist,
            playedAt: new Date().toISOString()
          })
          this.recentlyPlayed = this.recentlyPlayed.slice(0, 20)
          break
          
        case 'addGenre':
          if (!this.genres.includes(data)) {
            this.genres.push(data)
          }
          break
          
        case 'removeGenre':
          this.genres = this.genres.filter(genre => genre !== data)
          break
          
        case 'addArtist':
          if (!this.artists.find(artist => artist.id === data.id)) {
            this.artists.push({
              id: data.id,
              name: data.name,
              addedDate: new Date().toISOString()
            })
          }
          break
          
        case 'removeArtist':
          this.artists = this.artists.filter(artist => artist.id !== data)
          break
          
        case 'incrementPlayCount':
          const albumToPlay = this.albums.find(a => a.id === data)
          if (albumToPlay) {
            albumToPlay.playCount = (albumToPlay.playCount || 0) + 1
            this.addToRecentlyPlayed(albumToPlay)
          }
          break
          
        case 'rateAlbum':
          const albumToRate = this.albums.find(a => a.id === data.id)
          if (albumToRate) {
            albumToRate.rating = data.rating
          }
          break
      }
      
      this.saveToLocalStorage()
    },
    
    updateStats() {
      const albums = this.albums
      this.stats.totalAlbums = albums.length
      this.stats.totalValue = albums.reduce((total, album) => total + (album.price || 0), 0)
      
      if (albums.length > 0) {
        // Average condition
        const conditionMap = { 'excellent': 5, 'very good': 4, 'good': 3, 'fair': 2, 'poor': 1 }
        this.stats.averageCondition = albums.reduce((sum, album) => 
          sum + (conditionMap[album.condition] || 3), 0) / albums.length
        
        // Most valuable album
        this.stats.mostValuable = albums.reduce((max, album) => 
          (album.price || 0) > (max.price || 0) ? album : max, albums[0])
        
        // Favorite genre
        const genreCounts = albums.reduce((acc, album) => {
          acc[album.genre] = (acc[album.genre] || 0) + 1
          return acc
        }, {})
        this.stats.favoriteGenre = Object.entries(genreCounts)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || ''
      } else {
        this.stats.averageCondition = 0
        this.stats.mostValuable = null
        this.stats.favoriteGenre = ''
      }
    },
    
    saveToLocalStorage() {
      // Save collection as string: id|title|artist|genre|year|condition|price|purchaseDate|playCount|rating|notes|image;id|title|...
      const collectionString = this.albums.map(album => 
        `${album.id}|${album.title}|${album.artist}|${album.genre}|${album.year}|${album.condition}|${album.price}|${album.purchaseDate}|${album.playCount}|${album.rating}|${album.notes}|${album.image}`
      ).join(';')
      localStorage.setItem("collection_albums", collectionString)
      
      // Save wishlist as string: id|title|artist|price|addedDate;id|title|...
      const wishlistString = this.wishList.map(item => 
        `${item.id}|${item.title}|${item.artist}|${item.price}|${item.addedDate}`
      ).join(';')
      localStorage.setItem("collection_wishlist", wishlistString)
      
      // Save recently played as string: id|title|artist|playedAt;id|title|...
      const recentString = this.recentlyPlayed.map(item => 
        `${item.id}|${item.title}|${item.artist}|${item.playedAt}`
      ).join(';')
      localStorage.setItem("collection_recent", recentString)
      
      // Save genres and artists
      localStorage.setItem("collection_genres", this.genres.join(','))
      localStorage.setItem("collection_artists", this.artists.map(artist => 
        `${artist.id}|${artist.name}|${artist.addedDate}`
      ).join(';'))
    },
    
    loadFromLocalStorage() {
      // Load albums
      const savedAlbums = localStorage.getItem("collection_albums")
      if (savedAlbums) {
        this.albums = savedAlbums.split(';').map(albumStr => {
          const [id, title, artist, genre, year, condition, price, purchaseDate, playCount, rating, notes, image] = albumStr.split('|')
          return {
            id: parseInt(id) || 0,
            title: title || '',
            artist: artist || '',
            genre: genre || '',
            year: parseInt(year) || new Date().getFullYear(),
            condition: condition || 'excellent',
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
        this.wishList = savedWishlist.split(';').map(itemStr => {
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
        this.recentlyPlayed = savedRecent.split(';').map(itemStr => {
          const [id, title, artist, playedAt] = itemStr.split('|')
          return {
            id: parseInt(id) || 0,
            title: title || '',
            artist: artist || '',
            playedAt: playedAt || new Date().toISOString()
          }
        }).filter(item => item.id > 0 && item.title)
      }
      
      // Load genres
      const savedGenres = localStorage.getItem("collection_genres")
      if (savedGenres) {
        this.genres = savedGenres.split(',').filter(genre => genre.trim())
      }
      
      // Load artists
      const savedArtists = localStorage.getItem("collection_artists")
      if (savedArtists) {
        this.artists = savedArtists.split(';').map(artistStr => {
          const [id, name, addedDate] = artistStr.split('|')
          return {
            id: parseInt(id) || 0,
            name: name || '',
            addedDate: addedDate || new Date().toISOString()
          }
        }).filter(artist => artist.id > 0 && artist.name)
      }
      
      this.updateStats()
    }
  }
})
