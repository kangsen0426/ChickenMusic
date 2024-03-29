<template>
  <transition name="list-fade">
    <div class="playlist" @click="hide" v-show="showFlag">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{ modeText }}</span>
            <span class="clear" @click="showConfirm"
              ><i class="icon-clear"></i
            ></span>
          </h1>
        </div>

        

        <scroll ref="listContent" :refreshDelay="refreshDelay" :data="sequenceList" class="list-content">
          <transition-group ref="list" name="list" tag="ul">
            <li
              :key="item.id"
              class="item"
              v-for="(item, index) in sequenceList"
              @click="selectItem(item, index)"
            >
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{ item.name }}</span>
              <span @click.stop="toggleFavorite(item)" class="like">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span @click.stop="deleteOne(item)" class="delete">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div @click="addSong" class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm
        ref="confirm"
        @confirm="confirmClear"
        text="是否清空播放列表"
        confirmBtnText="清空"
      ></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapActions, mapGetters, mapMutations } from "vuex";
import { playMode } from "../../common/js/config";
import Scroll from "../../base/scroll/scroll.vue";
import Confirm from "../../base/confirm/confirm.vue";
import { shuffle } from "../../common/js/utils";

import AddSong from "../../components/add-song/add-song.vue";

export default {
  data() {
    return {
      showFlag: false,
      refreshDelay: 120,
    };
  },
  computed: {
    modeText() {
      return this.$store.state.mode === playMode.sequence
        ? "顺序播放"
        : this.$store.state.mode === playMode.random
        ? "随机播放"
        : "单曲循环";
    },
    iconMode() {
      return this.$store.state.mode === playMode.sequence
        ? "icon-sequence"
        : this.$store.state.mode === playMode.loop
        ? "icon-loop"
        : "icon-random";
    },
    ...mapGetters(["sequenceList", "currentSong", "playList",'favoriteList']),
  },
  methods: {
    show() {
      this.showFlag = true;

      setTimeout(() => {
        this.$refs.listContent.refresh();
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    confirmClear() {
      this.deleteSongList();
      this.hide();
    },
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return "icon-play";
      } else {
        return "";
      }
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        index = this.playList.findIndex((song) => {
          return song.id === item.id;
        });
      } else {
        //   console.log(item);
        let data = {
          list: this.sequenceList,
          index: index,
        };

        this.setCurrentIndex(index);
        this.setCurrentSong(data);

        this.scrollToCurrent(item);
      }

      let playing = this.$store.state.playing;
      //   console.log(playing);
      if (!playing) {
        this.setPlayingState(true);
      }
    },
    scrollToCurrent(current) {
      // console.log("to");

      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id;
      });
      this.$refs.listContent.scrollToElement(
        this.$refs.list.$el.children[index],
        300
      );
    },
    deleteOne(item) {
      this.deleteSong(item);

      if (!this.playList.length) {
        this.hide();
      }
    },
    changeMode() {
      const mode = (this.$store.state.mode + 1) % 3;

      this.setPlayMode(mode);

      //修改完播放模式接着修改播放列表
      let list = null;

      if (mode === playMode.random) {
        //随机播放
        list = shuffle(this.$store.state.sequenceList);
      } else {
        //顺序或者循环播放
        list = this.$store.state.sequenceList;
      }

      //设置播放列表
      this.setPlayList(list);
    },
    addSong() {
        this.$refs.addSong.show()
    },

    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        // console.log('like');
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      // console.log(index);
      return index > -1
    },
    ...mapActions(["deleteSong", "deleteSongList","deleteFavoriteList","saveFavoriteList"]),
    ...mapMutations({
      setCurrentIndex: "SET_CURRENT_INDEX",
      setCurrentSong: "SET_CURRENT_SONG",
      setPlayingState: "SET_PLAYING_STATE",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST",
    }),
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return;
      }
      setTimeout(() => {
        this.scrollToCurrent(newSong);
      }, 20);

      //  console.log("change");
    },
  },
  components: {
    Scroll,
    Confirm,
    AddSong,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  &.list-fade-enter, .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
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

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        &.list-enter-active, &.list-leave-active {
          transition: all 0.1s;
        }

        &.list-enter, &.list-leave-to {
          height: 0;
        }

        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }

        .like {
          extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;

          .icon-favorite {
            color: $color-sub-theme;
          }
        }

        .delete {
          extend-click();
          font-size: $font-size-small;
          color: $color-theme;
        }
      }
    }

    .list-operate {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>