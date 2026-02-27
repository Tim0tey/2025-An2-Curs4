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
    
    // Visualizer settings
    visualizer: true,
    
    // History and statistics
    playHistory: [],
    skipCount: 0,
    likeCount: 0,
    
    // Equalizer settings
    equalizer: {
      bass: 0,
      mid: 0,
      treble: 0
    }
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
      playlist: state.playlist,
      currentIndex: state.currentIndex,
      trackCount: state.playlist.length,
      hasNext: state.currentIndex < state.playlist.length - 1,
      hasPrevious: state.currentIndex > 0,
      repeat: state.repeat,
      shuffle: state.shuffle,
      visualizer: state.visualizer,
      playHistory: state.playHistory,
      skipCount: state.skipCount,
      likeCount: state.likeCount,
      equalizer: state.equalizer
    })
  },

  actions: {
    // Playback Control Actions (4)
    managePlayer(operation, data) {
      switch(operation) {
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
          this.currentTrack = null
          this.currentTime = 0
          this.duration = 0
          break
          
        case 'next':
          if (this.currentIndex < this.playlist.length - 1) {
            this.currentIndex++
          }
          break
          
        case 'previous':
          if (this.currentIndex > 0) {
            this.currentIndex--
          }
          break
      }
    },

    // Playlist Management Actions (3)
    managePlaylist(operation, data) {
      switch(operation) {
        case 'add':
          this.playlist.push(data)
          break
          
        case 'remove':
          this.playlist = this.playlist.filter((_, index) => index !== data)
          if (this.currentIndex >= data && this.currentIndex > 0) {
            this.currentIndex--
          }
          break
          
        case 'clear':
          this.playlist = []
          this.currentIndex = 0
          break
          
        case 'shuffle':
          const shuffled = [...this.playlist].sort(() => Math.random() - 0.5)
          this.playlist = shuffled
          this.currentIndex = 0
          break
          
        case 'move':
          const [from, to] = data
          const item = this.playlist[from]
          this.playlist.splice(from, 1)
          this.playlist.splice(to, 0, item)
          if (this.currentIndex === from) {
            this.currentIndex = to
          }
          break
      }
    },

    // Volume Control Actions (1)
    manageVolume(operation, data) {
      switch(operation) {
        case 'set':
          this.volume = Math.max(0, Math.min(1, data))
          break
          
        case 'up':
          this.volume = Math.min(1, this.volume + 0.1)
          break
          
        case 'down':
          this.volume = Math.max(0, this.volume - 0.1)
          break
      }
    },

    // Track Management Actions (2)
    manageTrack(operation, data) {
      switch(operation) {
        case 'load':
          this.currentTrack = data
          this.currentTime = 0
          this.duration = data.duration || 0
          this.currentIndex = this.playlist.findIndex(track => track.id === data.id)
          break
          
        case 'seek':
          this.currentTime = Math.max(0, Math.min(this.duration, data))
          break
      }
    },

    // Settings Actions (2)
    manageSettings(operation, data) {
      switch(operation) {
        case 'toggleRepeat':
          const modes = ['none', 'one', 'all']
          const currentIndex = modes.indexOf(this.repeat)
          const nextIndex = (currentIndex + 1) % modes.length
          this.repeat = modes[nextIndex]
          break
          
        case 'toggleShuffle':
          this.shuffle = !this.shuffle
          break
          
        case 'toggleVisualizer':
          this.visualizer = !this.visualizer
          break
      }
    },

    // Equalizer Actions (1)
    manageEqualizer(operation, data) {
      switch(operation) {
        case 'set':
          this.equalizer = {
            bass: Math.max(0, Math.min(1, data.bass || 0)),
            mid: Math.max(0, Math.min(1, data.mid || 0)),
            treble: Math.max(0, Math.min(1, data.treble || 0))
          }
          break
          
        case 'reset':
          this.equalizer = { bass: 0, mid: 0, treble: 0 }
          break
      }
    },

    // Statistics Actions (1)
    manageStats(operation, data) {
      switch(operation) {
        case 'recordSkip':
          this.skipCount++
          break
          
        case 'recordLike':
          this.likeCount++
          break
          
        case 'reset':
          this.skipCount = 0
          this.likeCount = 0
          this.playHistory = []
          break
      }
    }
  },

  loadFromLocalStorage() {
    const savedVolume = localStorage.getItem("player_volume")
    const savedRepeat = localStorage.getItem("player_repeat")
    const savedShuffle = localStorage.getItem("player_shuffle")
    const savedVisualizer = localStorage.getItem("player_visualizer")
    const savedPlaylist = localStorage.getItem("player_playlist")
    const savedCurrentTrack = localStorage.getItem("player_current_track")
    const savedCurrentTime = localStorage.getItem("player_current_time")
    const savedDuration = localStorage.getItem("player_duration")
    const savedPlayHistory = localStorage.getItem("player_play_history")
    const savedSkipCount = localStorage.getItem("player_skip_count")
    const savedLikeCount = localStorage.getItem("player_like_count")
    const savedEqualizer = localStorage.getItem("player_equalizer")
    
    if (savedVolume) this.volume = parseFloat(savedVolume)
    if (savedRepeat) this.repeat = savedRepeat
    if (savedShuffle) this.shuffle = savedShuffle === 'true'
    if (savedVisualizer) this.visualizer = savedVisualizer === 'true'
    if (savedPlaylist) this.playlist = JSON.parse(savedPlaylist)
    if (savedCurrentTrack) this.currentTrack = JSON.parse(savedCurrentTrack)
    if (savedCurrentTime) this.currentTime = parseFloat(savedCurrentTime)
    if (savedDuration) this.duration = parseFloat(savedDuration)
    if (savedPlayHistory) this.playHistory = JSON.parse(savedPlayHistory)
    if (savedSkipCount) this.skipCount = parseInt(savedSkipCount)
    if (savedLikeCount) this.likeCount = parseInt(savedLikeCount)
    if (savedEqualizer) {
      const [bass, mid, treble] = savedEqualizer.split(',').map(Number)
      this.equalizer = { bass: bass || 0, mid: mid || 0, treble: treble || 0 }
    }
  }
})
