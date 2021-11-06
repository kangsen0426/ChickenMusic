import {playMode} from '../common/js/config'

import {loadSearch,loadPlay,loadFavorite} from '../common/js/cache'

const state = {
    singer:{},
    playing:false,//播放器的播放状态
    fullScreen:false,//播放器是否是全屏状态
    playList:[],//播放音乐列表
    sequenceList:[],//音乐播放的顺序列表
    mode:playMode.sequence, //播放模式
    currentIndex:-1,//当前播放的索引
    currentSong:{},
    minplay:false,
    searchHistory:loadSearch(),
    playHistory: loadPlay(),
    favoriteList: loadFavorite()
}


export default state