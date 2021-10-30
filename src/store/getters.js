export const singer = state =>{
    return state.singer
}

export const playing = state =>{
    return state.playing
}

export const fullScreen = state =>{
    return state.fullScreen
}

export const playList = state =>{
    return state.playList
}

export const sequenceList = state =>{
    return state.sequenceList
}

export const mode = state =>{
    return state.mode
}

export const currentIndex = state =>{
    return state.currentIndex
}

export const currentSong = state =>{
    return state.playList[state.currentIndex] || {}
}