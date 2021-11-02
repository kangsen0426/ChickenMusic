<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li
          @click="selectItem(item)"
          class="item"
          v-for="item in topList"
          :key="item.id"
        >
          <div class="icon">
            <img width="100" height="100" v-lazy="item.imgUrl" />
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.songs" :key="index">
              <span>{{ index + 1 }}</span>
              <span>{{ song.first }} --- {{ song.second }}</span>
            </li>
            <li v-if="item.songs.length === 0">
              暂无排行数据,点击可查看歌单详情
            </li>
          </ul>
        </li>
        <li class="item"></li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <div class="empty"></div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from "../../base/scroll/scroll.vue";
import Loading from "../../base/loading/loading.vue";
import { getTopList } from "../../api/rank.js";
import { getDiscData } from "../../api/disc";

import { mapMutations } from "vuex";

export default {
  created() {
    this._getTopList();
  },
  data() {
    return {
      topList: [],
    };
  },

  methods: {
     getDesc(singer){
        
        let songers = [];

        for (let i = 0; i < singer.length; i++) {
          
          songers.push(singer[i].name)
          
        }


        return `${songers.join('/')}`
      },
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`,
      });
      // this.setTopList(item)
    },
    _getTopList() {
      //获取榜单数据
      getTopList().then((res) => {
        console.log(res.data);

        let result = [];

        res.data.list.forEach((item) => {
          if (item.tracks.length === 0) {
            //没有榜单数据，主动填充3条数据进去
            getDiscData(item.id).then((res) => {
              // console.log(res.data.playlist.tracks);

              for (let i = 0; i < 3; i++) {
                let tr = {
                  first:res.data.playlist.tracks[i].name,
                  second:this.getDesc(res.data.playlist.tracks[i].ar)
                }
                // item.tracks[i].first = res.data.playlist.tracks[i].name;
                // item.tracks[i].second = res.data.playlist.tracks[i].name;
                item.tracks.push(tr)
              }
            });
          }

          let data = {
            id: item.id,
            name: item.name,
            imgUrl: item.coverImgUrl,
            songs: item.tracks,
            desc: item.description,
          };

          result.push(data);
        });

        this.topList = result;

        // console.log(this.topList);
      });
    },
  },
  watch: {
    // topList() {
    //   setTimeout(() => {
    //     this.$Lazyload.lazyLoadHandler();
    //   }, 20);
    // },
  },
  components: {
    Scroll,
    Loading,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .toplist {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;

      &:last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;

        .song {
          no-wrap();
          line-height: 26px;
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>