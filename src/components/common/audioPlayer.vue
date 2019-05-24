<template>
  <article class="audioplayer" ref="player">
    <div class="audioplayer__playbtn"
      @click="playHandler">
      <i  v-if="!audioAttr.playing" class="iconfont iconplay"></i>
      <i  v-if="audioAttr.playing" class="fas fa-pause"></i>
    </div>
    <div class="audioplayer__time"
      v-if="showTime">
      {{`${formatTime(audioAttr.currentTime)} / ${formatTime(audioAttr.duration)}`}}
    </div>
    <section class="audioplayer__progressbar"
      @click ="seekHandler"
      ref="progressBar">
      <div class="audioplayer__progressbar-bg"></div>
      <div class="audioplayer__progressbar-buffer"
        :style="{
          width: `${bufferedWidth}%`
        }"></div>
      <div class="audioplayer__progressbar-progress"
        :style="{
          width: `${nobPosition + 4}px`
        }"></div>
      <div class="audioplayer__progressbar-nob"
        :style="{
          left: `${nobPosition}px`
          }"></div>
    </section>
    <div class="audioplayer__volume">
      <div class="audioplayer__volumemenu"
        :class="[
          showVolume ? 'is-show' : '',
        ]">
        <div class="audioplayer__volumemenu-bar">
          <div class="audioplayer__volumemenu-barfill">
          </div>
          <div class="audioplayer__volumemenu-nob"></div>
        </div>
      </div>
      <i class="iconfont iconvolume"></i>
    </div>
    <audio controls ref="audioDom" :style="{display:'none'}"></audio>
  </article>
</template>

<script>
export default {
  name: 'audioPlayer',
  props: {
    source: {
      type: String,
      required: true,
    },
    autoPlay: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      audio: null,
      audioAttr: {
        width: 0,
        duration: 0,
        buffered: 0,
        currentTime: 0,
        paused: false,
        volume: 0,
        playing: false,
      },
      playerRect: undefined,
      showVolume: true,
    };
  },
  computed: {
    nobPosition() {
      if (this.audioAttr.duration > 0) {
        const percent = this.audioAttr.currentTime / this.audioAttr.duration;
        return this.audioAttr.width * percent;
      }
      return 0;
    },
    bufferedWidth() {
      const attr = this.audioAttr;
      for (let i = attr.buffered.length - 1; i >= 0; i--) {
        if (attr.buffered.start(i) <= attr.currentTime) {
          return (attr.buffered.end(i) / attr.duration) * 100;
        }
      }
      return 0;
    },
    showTime() {
      return (this.playerRect && this.playerRect.width) > 540;
    },
  },
  methods: {
    // volumeInHandler() {
    //   this.showVolume = true;
    // },
    // volumeOutHandler() {
    //   this.showVolume = false;
    // },
    formatTime(sec) {
      return `${Math.floor(sec / 60)}:${(sec % 60).toFixed(0).padStart(2, '0')}`;
    },
    seekHandler(e) {
      const posX = e.offsetX;
      const percent = (posX / this.audioAttr.width);
      this.audio.currentTime = percent * this.audioAttr.duration;
    },
    initiateAudio() {
      this.audio = this.$refs.audioDom;
      this.audio.src = this.source;
      this.audio.addEventListener('durationchange', () => {
        this.audioAttr.duration = this.audio.duration;
      });
      this.audio.addEventListener('loadeddata', () => {
        // initial buffered attr
        this.updateBuffer();
      });
      this.audio.addEventListener('progress', () => {
        // update buffered attr
        this.updateBuffer();
      });
      this.audio.addEventListener('timeupdate', () => {
        // fired at playing to sync time
        this.audioAttr.currentTime = this.audio.currentTime;
      });
    },
    updateBuffer() {
      this.audioAttr.buffered = this.audio.buffered;
    },
    updateCurrentTime(ctime) {
      this.audioAttr.currentTime = ctime;
    },
    playHandler() {
      if (this.audio.paused) {
        this.audio.play();
        this.audioAttr.playing = true;
      } else {
        this.audio.pause();
        this.audioAttr.playing = false;
      }
    },
  },
  mounted() {
    const player = this.$refs.player;
    this.playerRect = player.getBoundingClientRect();
    const progressbar = this.$refs.progressBar;
    const rect = progressbar.getBoundingClientRect();
    this.audioAttr.width = rect.width;
    this.initiateAudio();
  },
};
</script>

<style src='@/audio-player.css'></style>
