<template>
  <div class="singer" ref="singer">

    <list-view @select="selectSinger" :data="singerList"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { pinyin } from "pinyin-pro";

import { getSingerList } from "../../api/singer";

import ListView from '../../base/listview/listview.vue'

import {mapMutations} from 'vuex'

const HOT_SINGER_LEN = 10; //热门歌手的个数
const HOT_NAME = "热门歌手";

export default {
  data() {
    return {
      singerList: [], //热门歌手列表
    };
  },
  created() {
    this._getSingerList();
  },
  components: {
    ListView
  },
  methods: {
    ...mapMutations({
      setSinger:'SET_SINGER'
    }),

    selectSinger(singer){
      this.$router.push({
        path: `/singer/${singer.id}`
      })

      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.status === 200) {
          // console.log(res);
          // this.singerList = res.data.artists;
          this.addFindIndex(res.data.artists);
        } else {
          console.log(res.statusText);
        }
      });
    },
    addFindIndex(arr) {
      //为数组添加歌手首字母

      for (let i = 0; i < arr.length; i++) {
        let tempIndex = pinyin(arr[i].name, {
          pattern: "first",
          toneType: "none",
          type: "array",
        });

        arr[i].findIndex = tempIndex[0].toUpperCase();
      }

      // console.log(arr);

      // this.singerList = arr;

      this.singerList = this._normalizeSinger(arr)

      // console.log(this.singerList);
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: [],
        },
      };

      list.forEach((item, index) => {
        //将 前十个数据作为热门歌手
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push({
            name: item.name,
            id: item.id,
            findIndex: item.findIndex,
            avatar: item.picUrl,
          });
        }

        //将歌手做首字母分类

        const key = item.findIndex;

        if (!map[key]) {
          //如果map中没有这个 key 就创建这个 key 分类
          map[key] = {
            title: key,
            items: [],
          };
        }

        //将歌手信息 push 到 key分类下的数组中
        map[key].items.push({
          name: item.name,
          id: item.id,
          findIndex: item.findIndex,
          avatar: item.picUrl,
        });
      });

      // this.singerList = map

      // console.log(map);

      //为了得到有序列表，对map进行排序
      let hot = [];
      let ret = [];

      for (let key in map) {
        let val = map[key];

        if (val.title.match(/[a-zA-Z]/)) {
          //字母组
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }

      // console.log(ret);

      //对字母进行排序

      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });

      return hot.concat(ret);
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
