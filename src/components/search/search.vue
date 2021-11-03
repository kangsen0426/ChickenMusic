<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll ref="shortcut" class="shortcut" :data="shortcut">
        <!-- <div class="shortcut"> -->
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li
                @click="addQuery(item.first)"
                class="item"
                v-for="(item, index) in hotKey"
                :key="index"
              >
                <span>{{ item.first }}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span @click="showConfirm" class="clear">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list
              @delete="deleteOne"
              @select="addQuery"
              :searches="searchHistory"
            ></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest
        @select="saveSearch"
        @listScroll="blurInput"
        ref="suggest"
        :query="query"
      ></suggest>
    </div>
    <confirm
      ref="confirm"
      @confirm="clearSearchHistory"
      text="是否清空所有搜索历史"
      confirmBtnText="清空"
    ></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from "../../base/search-box/search-box.vue";

import Suggest from "../../components/suggest/suggets.vue";

import SearchList from "../../base/search-list/search-list.vue";

import { getHotSearch } from "../../api/search";

import Scroll from "../../base/scroll/scroll.vue";

import Confirm from "../../base/confirm/confirm.vue";

import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Scroll,
    Confirm,
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory);
    },
    // minplayWatch() {

    //     this.setBottomHeight();

    //   return ''
    // },
    ...mapGetters(["searchHistory", "minplay"]),
  },
  data() {
    return {
      hotKey: [],
      query: "",
    };
  },

  created() {
    this._getHotSearch();
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    },
  },
  methods: {
    // setBottomHeight() {

    //   if(!this.onPage) return

    //   console.log("111");

    //   let bottom = this.minplay ? '60px' : ''

    //   this.$refs.shortcutWrapper.style.bottom = bottom;
    //   this.$refs.shortcut.refresh();
    //   this.$refs.searchResult.style.bottom = bottom;
    //   this.$refs.suggest.refresh()
    // },
    _getHotSearch() {
      getHotSearch().then((res) => {
        this.hotKey = res.data.result.hots;
      });
    },
    addQuery(txt) {
      console.log(txt);
      this.$refs.searchBox.setQuery(txt);
    },
    onQueryChange(e) {
      this.query = e;
    },
    blurInput() {
      this.$refs.searchBox.blur();
    },
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    deleteSearchHistory() {},
    deleteOne(item) {
      this.deleteSearchHistory(item);
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    ...mapActions([
      "saveSearchHistory",
      "deleteSearchHistory",
      "clearSearchHistory",
    ]),
  },
};
</script>


<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search {
  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 60px;
    width: 100%;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 20px 20px 20px;

        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;

        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;

          .text {
            flex: 1;
          }

          .clear {
            extend-click();

            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>