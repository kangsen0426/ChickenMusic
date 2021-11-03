<template>
  <scroll
    ref="suggest"
    class="suggest"
    :data="result"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li
        @click="selectItem(item)"
        class="suggest-item"
        v-for="(item, index) in result"
        :key="index"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import { getSuggest } from "../../api/search";

import Scroll from "../../base/scroll/scroll.vue";

import Loading from "../../base/loading/loading.vue";

import NoResult from "../../base/no-result/no-result.vue";

import { mapActions } from "vuex";

const perpage = 20;

export default {
  props: {
    showSinger: {
      type: Boolean,
      default: true,
    },
    query: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      page: 0,
      pullup: true,
      beforeScroll: true,
      hasMore: true,
      result: [],
    };
  },
  methods: {
    refresh() {
      this.$refs.suggest.refresh();
    },
    search(query) {
      if (query === "") return;
      this.page = 0;
      this.result = [];

      this.$refs.suggest.scrollTo(0, 0);

      this.hasMore = true;
      //获取搜索列表
      getSuggest(query, this.page).then((res) => {
        if (!res.data.result.songs) {
          this.result = [];

          return;
        } else {
          res.data.result.songs.forEach((item) => {
            let song = {
              al: item.al,
              alia: item.alia,
              id: item.id,
              name: item.name,
              singer: item.ar,
            };
            this.result.push(song);
          });
        }

        // console.log(res.data);

        //检查是否还有更多数据
        this._checkMore(res.data.result);
      });
    },
    searchMore() {
      //加载更多
      if (!this.hasMore) {
        return;
      }

      console.log("loading...");

      this.page++;

      getSuggest(this.query, this.page).then((res) => {
        res.data.result.songs.forEach((item) => {
          let song = {
            al: item.al,
            alia: item.alia,
            id: item.id,
            name: item.name,
            singer: item.ar,
          };

          this.result.push(song);
        });

        // console.log(this.result);

        //检查是否还有更多数据
        this._checkMore(res.data.result);
      });
    },
    listScroll() {
      //滚动时主动收起键盘
      this.$emit("listScroll");
    },
    selectItem(item) {
      console.log(item.id);

      //没有做搜索歌手的跳转，只显示歌曲

      this.insertSong(item);

      this.$emit("select");
    },
    getDisplayName(item) {
      let songers = [];

      for (let i = 0; i < item.singer.length; i++) {
        songers.push(item.singer[i].name);
      }

      return `${item.name} — ${songers.join(",")}`;
    },
    getIconCls(item) {},
    _genResult(data) {},

    _checkMore(data) {
      if (!data.songs.length || (this.page + 1) * 30 >= data.songCount) {
        this.hasMore = false;
        console.log("没有更多了");
      }
    },
    ...mapActions(["insertSong"]),
  },
  watch: {
    query(newQuery) {
      this.search(newQuery);
    },
  },
  components: {
    Scroll,
    Loading,
    NoResult,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>