import { defineStore } from "pinia"

export const usePlayer = defineStore("player", {
  state: () => ({
    // Current playing track
    currentTrack: null,
    
    // Player state
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    
    // Playback controls
    volume: 0.7,
    currentTime: 0,
    duration: 0,
    
    // Playlist
    playlist: [],
    currentIndex: 0,
    
    // Player settings
    repeat: 'none', // 'none', 'one', 'all'
    shuffle: false,
    
    // Visual settings
    showPlaylist: true,
    showVisualizer: false,
    
    // History
    playHistory: [],
    favorites: []
  }),
  
  getters: {
    playerInfo: (state) => ({
      currentTrack: state.currentTrack,
      isPlaying: state.isPlaying,
      isPaused: state.isPaused,
      isLoading: state.isLoading,
      volume: state.volume,
      currentTime: state.currentTime,
      duration: state.duration,
      progress: state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0,
      
      // Playlist info
      playlist: state.playlist,
      currentIndex: state.currentIndex,
      hasNext: state.currentIndex < state.playlist.length - 1,
      hasPrevious: state.currentIndex > 0,
      
      // Settings
      repeat: state.repeat,
      shuffle: state.shuffle,
      showPlaylist: state.showPlaylist,
      showVisualizer: state.showVisualizer,
      
      // History and favorites
      playHistory: state.playHistory,
      favorites: state.favorites,
      favoriteCount: state.favorites.length
    })
  },
  
  actions: {
    managePlayer(operation, data) {
      switch(operation) {
        case 'load':
          this.isLoading = true
          this.currentTrack = data
          this.currentTime = 0
          this.isLoading = false
          this.addToHistory(data)
          break
          
        case 'play':
          if (this.currentTrack) {
            this.isPlaying = true
            this.isPaused = false
          }
          break
          
        case 'pause':
          this.isPlaying = false
          this.isPaused = true
          break
          
        case 'stop':
          this.isPlaying = false
          this.isPaused = false
          this.currentTime = 0
          break
          
        case 'toggle':
          if (this.isPlaying) {
            this.managePlayer('pause')
          } else {
            this.managePlayer('play')
          }
          break
          
        case 'next':
          if (this.shuffle) {
            this.playRandom()
          } else {
            this.playNext()
          }
          break
          
        case 'previous':
          this.playPrevious()
          break
          
        case 'setVolume':
          this.volume = Math.max(0, Math.min(1, data))
          break
          
        case 'seek':
          this.currentTime = Math.max(0, Math.min(this.duration, data))
          break
          
        case 'setProgress':
          this.currentTime = (data / 100) * this.duration
          break
          
        case 'setPlaylist':
          this.playlist = data
          this.currentIndex = 0
          if (data.length > 0) {
            this.managePlayer('load', data[0])
          }
          break
          
        case 'addToPlaylist':
          this.playlist.push(data)
          break
          
        case 'removeFromPlaylist':
          this.playlist = this.playlist.filter(track => track.id !== data)
          break
          
        case 'setRepeat':
          this.repeat = data
          break
          
        case 'toggleRepeat':
          const modes = ['none', 'one', 'all']
          const currentIndex = modes.indexOf(this.repeat)
          this.repeat = modes[(currentIndex + 1) % modes.length]
          break
          
        case 'toggleShuffle':
          this.shuffle = !this.shuffle
          break
          
        case 'togglePlaylist':
          this.showPlaylist = !this.showPlaylist
          break
          
        case 'toggleVisualizer':
          this.showVisualizer = !this.showVisualizer
          break
          
        case 'addToFavorites':
          if (!this.favorites.find(fav => fav.id === data.id)) {
            this.favorites.push(data)
          }
          break
          
        case 'removeFromFavorites':
          this.favorites = this.favorites.filter(fav => fav.id !== data)
          break
          
        case 'toggleFavorite':
          const isFavorite = this.favorites.find(fav => fav.id === data.id)
          if (isFavorite) {
            this.managePlayer('removeFromFavorites', data.id)
          } else {
            this.managePlayer('addToFavorites', data)
          }
          break
      }
      
      // Save player state
      this.saveToLocalStorage()
    },
    
    playNext() {
      if (this.currentIndex < this.playlist.length - 1) {
        this.currentIndex++
        this.managePlayer('load', this.playlist[this.currentIndex])
        this.managePlayer('play')
      } else if (this.repeat === 'all') {
        this.currentIndex = 0
        this.managePlayer('load', this.playlist[this.currentIndex])
        this.managePlayer('play')
      }
    },
    
    playPrevious() {
      if (this.currentIndex > 0) {
        this.currentIndex--
        this.managePlayer('load', this.playlist[this.currentIndex])
        this.managePlayer('play')
      } else if (this.repeat === 'all') {
        this.currentIndex = this.playlist.length - 1
        this.managePlayer('load', this.playlist[this.currentIndex])
        this.managePlayer('play')
      }
    },
    
    playRandom() {
      const randomIndex = Math.floor(Math.random() * this.playlist.length)
      this.currentIndex = randomIndex
      this.managePlayer('load', this.playlist[this.currentIndex])
      this.managePlayer('play')
    },
    
    addToHistory(track) {
      // Remove if already exists
      this.playHistory = this.playHistory.filter(t => t.id !== track.id)
      // Add to beginning
      this.playHistory.unshift(track)
      // Keep only last 50 tracks
      this.playHistory = this.playHistory.slice(0, 50)
    },
    
    updateTime(currentTime, duration) {
      this.currentTime = currentTime
      this.duration = duration
      
      // Auto-play next track when current ends
      if (currentTime >= duration && this.isPlaying) {
        if (this.repeat === 'one') {
          this.currentTime = 0
          this.managePlayer('play')
        } else {
          this.managePlayer('next')
        }
      }
    },
    
    saveToLocalStorage() {
      // Save player settings
      localStorage.setItem("player_volume", this.volume.toString())
      localStorage.setItem("player_repeat", this.repeat)
      localStorage.setItem("player_shuffle", this.shuffle.toString())
      localStorage.setItem("player_showPlaylist", this.showPlaylist.toString())
      localStorage.setItem("player_showVisualizer", this.showVisualizer.toString())
      
      // Save favorites as comma-separated string
      localStorage.setItem("player_favorites", this.favorites.map(fav => fav.id).join(','))
      
      // Save history as string: id|title|artist;id|title|artist
      const historyString = this.playHistory.map(track => 
        `${track.id}|${track.title}|${track.artist}`
      ).join(';')
      localStorage.setItem("player_history", historyString)
    },
    
    loadFromLocalStorage() {
      // Load player settings
      const volume = localStorage.getItem("player_volume")
      const repeat = localStorage.getItem("player_repeat")
      const shuffle = localStorage.getItem("player_shuffle")
      const showPlaylist = localStorage.getItem("player_showPlaylist")
      const showVisualizer = localStorage.getItem("player_showVisualizer")
      
      if (volume) this.volume = parseFloat(volume) || 0.7
      if (repeat) this.repeat = repeat || 'none'
      if (shuffle) this.shuffle = shuffle === 'true'
      if (showPlaylist) this.showPlaylist = showPlaylist === 'true'
      if (showVisualizer) this.showVisualizer = showVisualizer === 'true'
      
      // Load favorites
      const savedFavorites = localStorage.getItem("player_favorites")
      if (savedFavorites) {
        // This would need to be populated with actual track data
        const favoriteIds = savedFavorites.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
        // In a real app, you'd fetch track data for these IDs
      }
      
      // Load history
      const savedHistory = localStorage.getItem("player_history")
      if (savedHistory) {
        this.playHistory = savedHistory.split(';').map(trackStr => {
          const [id, title, artist] = trackStr.split('|')
          return {
            id: parseInt(id) || 0,
            title: title || '',
            artist: artist || ''
          }
        }).filter(track => track.id > 0 && track.title)
      }
    }
  }
})
