<template>
  <transition name="slide">
    <music-list
      :rank="rank"
      :title="rankData.name"
      :bg-image="rankData.imgUrl"
      :songs="songs"
    ></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from "../../components/music-list/music-list";

import { getDiscData } from "../../api/disc";

import { mapGetters } from "vuex";

export default {
  computed: {
    //   title() {
    //     return this.topList.topTitle
    //   },
    //   bgImage() {
    //     if (this.songs.length) {
    //       return this.songs[0].image
    //     }
    //     return ''
    //   },

  },
  data() {
    return {
      rankData: {},
      songs: [],
      rank: true,
    };
  },
  created() {
    this._getMusicList(this.$route.params.id);
  },
  methods: {
    _getMusicList(id) {
      console.log(id);

      if (!id) {
        this.$router.back();

        return;
      }

      getDiscData(id).then((res) => {
        // console.log(res.data);

        let rankData = {
          id: res.data.playlist.id,
          name: res.data.playlist.name,
          desc: res.data.playlist.description,
          imgUrl: res.data.playlist.coverImgUrl,
        };

        this.rankData = rankData;

        // console.log(res.data.playlist);

        let result = [];

        res.data.playlist.tracks.forEach((item) => {
          let songData = {
            singer: item.ar,
            name: item.name,
            id: item.id,
            al: item.al,
          };

          result.push(songData);
        });

        this.songs = result;

        // console.log(result);
      });
    },
    _normalizeSongs(list) {
      // let ret = []
      // list.forEach((item) => {
      //   const musicData = item.data
      //   if (musicData.songid && musicData.albummid) {
      //     ret.push(createSong(musicData))
      //   }
      // })
      // return ret
    },
  },
  components: {
    MusicList,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>