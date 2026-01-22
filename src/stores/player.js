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
          if (state.currentTrack) {
            state.isPlaying = true
            state.isPaused = false
          }
          break
          
        case 'pause':
          state.isPlaying = false
          state.isPaused = true
          break
          
        case 'stop':
          state.isPlaying = false
          state.isPaused = false
          state.currentTrack = null
          state.currentTime = 0
          state.duration = 0
          break
          
        case 'next':
          if (state.currentIndex < state.playlist.length - 1) {
            state.currentIndex++
          }
          break
          
        case 'previous':
          if (state.currentIndex > 0) {
            state.currentIndex--
          }
          break
      }
    },

    // Playlist Management Actions (3)
    managePlaylist(operation, data) {
      switch(operation) {
        case 'add':
          state.playlist.push(data)
          break
          
        case 'remove':
          state.playlist = state.playlist.filter((_, index) => index !== data)
          if (state.currentIndex >= data && state.currentIndex > 0) {
            state.currentIndex--
          }
          break
          
        case 'clear':
          state.playlist = []
          state.currentIndex = 0
          break
          
        case 'shuffle':
          const shuffled = [...state.playlist].sort(() => Math.random() - 0.5)
          state.playlist = shuffled
          state.currentIndex = 0
          break
          
        case 'move':
          const [from, to] = data
          const item = state.playlist[from]
          state.playlist.splice(from, 1)
          state.playlist.splice(to, 0, item)
          if (state.currentIndex === from) {
            state.currentIndex = to
          }
          break
      }
    },

    // Volume Control Actions (1)
    manageVolume(operation, data) {
      switch(operation) {
        case 'set':
          state.volume = Math.max(0, Math.min(1, data))
          break
          
        case 'up':
          state.volume = Math.min(1, state.volume + 0.1)
          break
          
        case 'down':
          state.volume = Math.max(0, state.volume - 0.1)
          break
      }
    },

    // Track Management Actions (2)
    manageTrack(operation, data) {
      switch(operation) {
        case 'load':
          state.currentTrack = data
          state.currentTime = 0
          state.duration = data.duration || 0
          state.currentIndex = state.playlist.findIndex(track => track.id === data.id)
          break
          
        case 'seek':
          state.currentTime = Math.max(0, Math.min(state.duration, data))
          break
      }
    },

    // Settings Actions (2)
    manageSettings(operation, data) {
      switch(operation) {
        case 'toggleRepeat':
          const modes = ['none', 'one', 'all']
          const currentIndex = modes.indexOf(state.repeat)
          const nextIndex = (currentIndex + 1) % modes.length
          state.repeat = modes[nextIndex]
          break
          
        case 'toggleShuffle':
          state.shuffle = !state.shuffle
          break
          
        case 'toggleVisualizer':
          state.visualizer = !state.visualizer
          break
      }
    },

    // Equalizer Actions (1)
    manageEqualizer(operation, data) {
      switch(operation) {
        case 'set':
          state.equalizer = {
            bass: Math.max(0, Math.min(1, data.bass || 0)),
            mid: Math.max(0, Math.min(1, data.mid || 0)),
            treble: Math.max(0, Math.min(1, data.treble || 0))
          }
          break
          
        case 'reset':
          state.equalizer = { bass: 0, mid: 0, treble: 0 }
          break
      }
    },

    // Statistics Actions (1)
    manageStats(operation, data) {
      switch(operation) {
        case 'recordSkip':
          state.skipCount++
          break
          
        case 'recordLike':
          state.likeCount++
          break
          
        case 'reset':
          state.skipCount = 0
          state.likeCount = 0
          state.playHistory = []
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
    
    if (savedVolume) state.volume = parseFloat(savedVolume)
    if (savedRepeat) state.repeat = savedRepeat
    if (savedShuffle) state.shuffle = savedShuffle === 'true'
    if (savedVisualizer) state.visualizer = savedVisualizer === 'true'
    if (savedPlaylist) state.playlist = JSON.parse(savedPlaylist)
    if (savedCurrentTrack) state.currentTrack = JSON.parse(savedCurrentTrack)
    if (savedCurrentTime) state.currentTime = parseFloat(savedCurrentTime)
    if (savedDuration) state.duration = parseFloat(savedDuration)
    if (savedPlayHistory) state.playHistory = JSON.parse(savedPlayHistory)
    if (savedSkipCount) state.skipCount = parseInt(savedSkipCount)
    if (savedLikeCount) state.likeCount = parseInt(savedLikeCount)
    if (savedEqualizer) {
      const [bass, mid, treble] = savedEqualizer.split(',').map(Number)
      state.equalizer = { bass: bass || 0, mid: mid || 0, treble: treble || 0 }
    }
  }
})
