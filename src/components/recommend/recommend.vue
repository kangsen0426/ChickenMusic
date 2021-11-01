<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div
          v-if="recommends.length"
          class="slider-wrapper"
          ref="sliderWrapper"
        >
          <slider>
            <div v-for="item in recommends" :key="item.bannerId">
              <a :href="item.url">
                <img class="needsclick" @load="loadImage" :src="item.pic" />
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title" :class="minplay">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" :key="item.id" class="item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.picUrl" />
              </div>
              <div class="text">
                <h2 class="name">{{ item.name }}</h2>
                <p class="desc">播放量：{{ item.playCount }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  getRecommend,
  getRecommendWYY,
  getDiscList,
} from "../../api/recommend";
import { ERR_OK } from "../../api/config";

import Slider from "../../base/slider/slider.vue";
import Scroll from "../../base/scroll/scroll.vue";
import Loading from "../../base/loading/loading.vue";

export default {
  data() {
    return {
      recommends: [], //轮播图数据
      discList: [], //推荐歌单
      checkLoaded:false,
    };
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  computed:{
      minplay(){

        // console.log(this.$store.state.minplay);
        
        // let state = this.$store.state.minplay

        // if(state){
        //   this.setBottomHeight()
        // }

      return ''
    }
  },
  methods: {
     setBottomHeight(){

      //  console.log('111');
        
                let play = this.$store.state.minplay



        // console.log(this.$store.state.playList);

        const bottom = play  ? '60px' : ''


        this.$refs.recommend.style.bottom = bottom


        this.$refs.scroll.refresh()

    },
    _getRecommend() {
      // getRecommend().then((res)=>{
      //   if(res.code === ERR_OK){
      //     console.log(res.data.slider);
      //   }else{
      //     console.log(res);
      //   }
      // })

      getRecommendWYY().then((res) => {
        if (res.status === 200) {
          // console.log(res.data.banners);

          this.recommends = res.data.banners;
          if (this.recommends.length > 4) {
            this.recommends = this.recommends.splice(0, 4);
          }

          // console.log(this.recommends);
        } else {
          console.log(res.statusText);
        }
      });
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.status === 200) {
          this.discList = res.data.result;

          // console.log(this.discList);
        } else {
          console.log(res.statusText);
        }
      });
    },
    loadImage() {
      //监听一张图片是否加载完成了（用于撑开容器

      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
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