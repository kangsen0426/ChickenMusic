import * as types from './mutation-type'

import { playMode } from '../common/js/config'
import { shuffle } from '../common/js/utils'

import { saveSearch, clearSearch, deleteSearch } from '../common/js/cache'

function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

export const selectPlay = function ({ commit, state }, { list, index }) {


    commit(types.SET_SEQUENCE_LIST, list)


    if (state.mode === playMode.random) {
        //如果当前是随机播放 用户又在歌单列表点击的某首歌曲，而此时的播放列表是随机过的
        // 要找到歌单列表对应的 index
        let randomList = shuffle(list)

        commit(types.SET_PLAYLIST, randomList)

        let _index = findIndex(randomList, list[index])

        // console.log(index,_index);

        commit(types.SET_CURRENT_INDEX, _index)
        commit(types.SET_FULL_SCREEN, true)
        commit(types.SET_PLAYING_STATE, true)
        commit(types.SET_CURRENT_SONG, { list, _index })


    } else {
        commit(types.SET_PLAYLIST, list)

        commit(types.SET_CURRENT_INDEX, index)
        commit(types.SET_FULL_SCREEN, true)
        commit(types.SET_PLAYING_STATE, true)
        commit(types.SET_CURRENT_SONG, { list, index })
    }

    // commit(types.SET_CURRENT_INDEX, index)
    // commit(types.SET_FULL_SCREEN, true)
    // commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_CURRENT_SONG, { list, index })

    commit(types.SET_MIN_PLAY, true)

}


export const randomPlay = function ({ commit }, { list }) {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
    let index = 0
    commit(types.SET_CURRENT_SONG, { list, index })
    commit(types.SET_MIN_PLAY, true)

}

export const insertSong = function ({ commit, state }, song) {
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    //记录当前歌曲
    let currentSong = state.currentSong

    //查找播放列表中是否包含这首歌曲
    let fIndex = findIndex(playList, song)

    //索引加一
    currentIndex++;

    //插入这首歌曲
    playList.splice(currentIndex, 0, song)

    //如果已经包含了这首歌曲
    if (fIndex > -1) {

        //如果在当前索引的前面
        if (currentIndex > fIndex) {
            playList.splice(fIndex, 1)
            currentIndex--
        } else {
            //如果在当前索引的后面
            playList.splice(fIndex + 1, 1)
        }



    }

    let currentSIndex = findIndex(sequenceList, currentSong) + 1

    let fsIndex = findIndex(sequenceList, song)

    sequenceList.splice(currentSIndex, 0, song)

    if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
            sequenceList.splice(fsIndex, 1)
        } else {
            sequenceList.splice(fsIndex + 1, 1)
        }
    }

    commit(types.SET_PLAYLIST, playList)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_CURRENT_SONG, { list: playList, index: currentIndex })


}

export const saveSearchHistory = function ({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({ commit }) {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
}


