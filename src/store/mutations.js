// 操作


import * as types from './mutation-type'


const matutations = {
    [types.SET_SINGER](state, singer) {
        state.singer = singer
    },
    [types.SET_PLAYING_STATE](state, flag) {
        state.playing = flag
    },
    [types.SET_FULL_SCREEN](state, flag) {
        state.fullScreen = flag
    },
    [types.SET_PLAYLIST](state, list) {
        state.playList = list
    },
    [types.SET_SEQUENCE_LIST](state, list) {
        state.sequenceList = list
    },
    [types.SET_PLAY_MODE](state, mode) {
        state.mode = mode
    },
    [types.SET_CURRENT_INDEX](state, index) {
        state.currentIndex = index
    },

    [types.SET_CURRENT_SONG](state, data) {
        // console.log(data);
        state.currentSong = data.list[data.index]
    },

    [types.SET_MIN_PLAY](state) {
        state.minplay = true;
    },

    [types.SET_SEARCH_HISTORY](state, history) {
        state.searchHistory = history;
    },

    [types.SET_PLAY_HISTORY](state, history) {
        state.playHistory = history
    },
    [types.SET_FAVORITE_LIST](state, list) {
        state.favoriteList = list
    }
}


export default matutations