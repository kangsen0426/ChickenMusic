<template>
  <transition name="slide">
    <music-list :title="disData.name" :bg-image="disData.imgUrl" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from '../../components/music-list/music-list.vue'
  import {getDiscData} from '../../api/disc'
  import {getSongDetail} from '../../api/song'
//   import {getSongList} from 'api/recommend'
//   import {ERR_OK} from 'api/config'
//   import {mapGetters} from 'vuex'
//   import {createSong} from 'common/js/song'

  export default {
    //computed: {
    //   title() {
    //     // return this.disc.dissname
    //   },
    //   bgImage() {
    //     // return this.disc.imgurl
    //   },
    // //   ...mapGetters([
    // //     'disc'
    // //   ])
    // },
    data() {
      return {
        disData:{},
        songs: []
      }
    },
    created() {
        // console.log(this.$route.params.id);
      this._getSongList(this.$route.params.id)
    },
    methods: {
      _getSongList(id) {

          if(!id){

              this.$router.push('/recommend')
              return

          } 

          getDiscData(id).then(res =>{
            

            let disData = {
                id:res.data.playlist.id,
                name:res.data.playlist.name,
                desc:res.data.playlist.description,
                imgUrl:res.data.playlist.coverImgUrl
            }

            this.disData = disData

            // console.log(res.data.playlist);

            let Songids = ''
            
            res.data.playlist.trackIds.forEach((item,index)=>{
                if(index === 0){
                    Songids += `${item.id}`
                }else{
                Songids += `,${item.id}`
                }
            })


            //请求到所有歌曲数据
            getSongDetail(Songids).then(res =>{
                
                let result = []

                // console.log(res.data);
                
                res.data.songs.forEach(item =>{

                     let songData = {
                        singer:item.ar,
                        name:item.name,
                        id:item.id,
                        al:item.al
                    }

                    result.push(songData)
                })

                
                // console.log(result);

                this.songs = result

            })
            
            

          })
      },
      _normalizeSongs(list) {
        // let ret = []
        // list.forEach((musicData) => {
        //   if (musicData.songid && musicData.albummid) {
        //     ret.push(createSong(musicData))
        //   }
        // })
        // return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>