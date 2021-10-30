<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";

import { getSingerDetail } from "../../api/singer";

import MusicList from '../music-list/music-list.vue'

export default {
  data() {
    return {
        songs:[],
       
    };
  },
  created() {

    console.log(this.singer);

    

    //  this.title = this.singer.name
    // this.bgImage =  this.singer.avatar

    // console.log(this.title);


    this._getSingerDetail(this.singer.id);
  },
  computed: {
    singer(){
      return this.$store.state.singer
    },
    title(){
      return this.singer.name
    },
    bgImage(){
      return this.singer.avatar
    }
  },
  components: {
    MusicList
  },
  methods: {
    _getSingerDetail(id) {
      // console.log(this.singer);

    //   if (!this.singer.id) {
    //     this.$router.push("/singer");

    //     return;
    //   }

      getSingerDetail(id).then((res) => {
        if (res.status === 200) {
          // console.log(res);

            this._normalizeSongs(res.data.songs)


        } else {
          console.log(res.statusText);
        }
      });
    },
    _normalizeSongs(list){

      // console.log(list);

        let result = []

        list.forEach(item => {
            
            let songData = {
                singer:item.ar,
                name:item.name,
                id:item.id,
                alia:item.alia,
                al:item.al
            }

            result.push(songData)
        });

        // console.log(result);

        this.songs = result

    }
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>