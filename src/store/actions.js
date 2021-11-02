import * as types from './mutation-type'

import { playMode } from '../common/js/config'
import { shuffle } from '../common/js/utils'

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