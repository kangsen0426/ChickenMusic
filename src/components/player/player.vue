<template>
  <div class="player" v-show="playList.length">
    <div class="rubbish">{{ currentSong.id }}</div>

    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img
            width="100%"
            height="100%"
             v-lazy="
              currentSongBaseInfo.al
                ? currentSongBaseInfo.al.picUrl
                : '../../common/image/default.png'
            "
          />
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSongBaseInfo.name }}</h1>
          <h2 class="subtitle">{{ currentSongBaseInfo.singer }}</h2>
        </div>

        <div class="middle">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img
                  class="image"
                   v-lazy="
                    currentSongBaseInfo.al
                      ? currentSongBaseInfo.al.picUrl
                      : '../../common/image/default.png'
                  "
                />
              </div>
            </div>
            <!-- <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div> -->
          </div>
        </div>

        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent"></progress-bar>
            </div>
            <span class="time time-r">{{ currentSongBaseInfo.time }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img
            :class="cdCls"
            width="40"
            height="40"
            v-lazy="
              currentSongBaseInfo.al
                ? currentSongBaseInfo.al.picUrl
                : '../../common/image/default.png'
            "
          />
        </div>
        <div class="text">
          <h2 class="name"></h2>
          <p class="desc"></p>
        </div>
        <div class="control">
          <i :class="miniIcon" @click.stop="togglePlaying"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>

    <audio
      ref="audio"
      :src="songUrl"
      @timeupdate="updateTime"
      @canplay="ready"
      @error="error"
    ></audio>
  </div>
</template>

<script>
import animations from "create-keyframe-animation";

import { mapGetters, mapMutations } from "vuex";

import { getSongDetail, getSongUrl } from "../../api/song";

import ProgressBar from '../../base/progress-bar/progress-bar.vue'

export default {
  data() {
    return {
      currentSongBaseInfo: "",
      songUrl: "",
      songReady: false,
      currentTime: 0,
    };
  },
  components:{
    ProgressBar
  },
  computed: {
    playList() {
      return this.$store.state.playList;
    },
    fullScreen() {
      return this.$store.state.fullScreen;
    },
    currentSong() {
      // console.log(this.$store.state.currentSong);

      this.getSongData(this.$store.state.currentSong.id);
      return this.$store.state.currentSong;
    },
    // playing() {
    //   console.log(this.$store.state.palying);
    //   return this.$store.state.palying;
    // },

    // ...mapGetters([
    //     'playing'
    //   ])
    playIcon() {
      return this.$store.state.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.$store.state.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    cdCls() {
      return this.$store.state.playing ? "play" : "play pause";
    },
    disableCls() {
      return this.songReady ? "" : "disable";
    },
    percent(){

      // console.log(this.currentTime*1000);
      // console.log((this.currentTime*1000) / this.currentSongBaseInfo.dt);
      return (this.currentTime*1000) / this.currentSongBaseInfo.dt
    }
  },
  watch: {
    songUrl() {
      //   this.$refs.audio.src = this.songUrl

      //   console.log(this.songUrl);

      this.$nextTick(() => {
        this.$refs.audio.play();
      });
    },
  },
  methods: {
    format(interval) {
      interval = interval | 0;
      let minute = (interval / 60) | 0;
      let second = interval % 60;

      if(minute < 10){
        minute = '0'+minute
      }
      if(second < 10){
        second = '0'+second
      }


      return `${minute}:${second}`;
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;

    },
    ready() {
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    next() {
      if (!this.songReady) return;

      let index = this.$store.state.currentIndex + 1;

      if (index === this.$store.state.playList.length) {
        index = 0;
      }

      let data = {
        list: this.$store.state.playList,
        index: index,
      };

      let playing = this.$store.state.playing;
      if (!playing) {
        this.togglePlaying();
      }

      this.setCurrentIndex(index);

      this.setCurrentSong(data);

      this.songReady = false;
    },
    prev() {
      if (!this.songReady) return;

      console.log(this.$store.state.currentIndex);
      let index = this.$store.state.currentIndex - 1;

      if (index === -1) {
        index = this.$store.state.playList.length - 1;
      }

      let data = {
        list: this.$store.state.playList,
        index: index,
      };
      let playing = this.$store.state.playing;
      if (!playing) {
        this.togglePlaying();
      }
      this.setCurrentIndex(index);
      this.setCurrentSong(data);

      this.songReady = false;
    },
    togglePlaying() {
      if (!this.songReady) return;

      // console.log(this.$store.state.playing);
      // console.log(!this.$store.state.playing);
      let flag = !this.$store.state.playing;
      this.setPlayingState(flag);

      let audio = this.$refs.audio;

      this.$nextTick(() => {
        flag ? audio.play() : audio.pause();
        this.songReady = false;
      });
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style["transform"] = "";
      this.$refs.cdWrapper.style["webkitTransform"] = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style[
        "transform"
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.style[
        "webkitTransform"
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`,
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`,
        },
      };

      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear",
        },
      });

      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale,
      };
    },

    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    getSongData(id) {
      if (id) {
        getSongDetail(id).then((res) => {
          if (res.data.songs) {
            console.log(res);

            //   console.log(res.data.songs[0]);

            let songData = {
              id: id,
              name: res.data.songs[0].name,
              al: res.data.songs[0].al,
              singer: this.getSinger(res.data.songs[0].ar),
              time: this.formatDuring(res.data.songs[0].dt),
              dt:res.data.songs[0].dt
            };

            this.currentSongBaseInfo = songData;

            // console.log(songData);
          } else {
            console.log(res.statusText);
          }
        });

        getSongUrl(id).then((res) => {
          this.songUrl = res.data.data[0].url;

          //   this.$refs.audio.src = this.songUrl

          //   this.$refs.audio.play()

          // //   console.log(this.songUrl);
          //   console.log(this.$refs.audio.src);
        });
      }
    },
    getSinger(song) {
      let songers = [];

      for (let i = 0; i < song.length; i++) {
        songers.push(song[i].name);
      }

      return `${songers.join(",")}`;
    },
    formatDuring(mss) {
      let days = parseInt(mss / (1000 * 60 * 60 * 24));
      let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = parseInt((mss % (1000 * 60)) / 1000);

      if (minutes < 10) {
        minutes = "0" + minutes;
      }

      return minutes + ":" + seconds;
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setCurrentSong: "SET_CURRENT_SONG",
    }),
  },
};
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.player {
  .rubbish {
    display: none;
  }

  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
            padding-right: 10px;
          }

          &.time-r {
            text-align: right;
            padding-left: 10px;

          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        border-radius: 50%;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>