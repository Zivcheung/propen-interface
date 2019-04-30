<template>
  <article class="audioplayer">
    <div class="audioplayer__playbtn">
      <i class="iconfont iconplay"></i>
    </div>
    <section class="audioplayer__progressbar">
      <div class="audioplayer__progressbar-bg"></div>
      <div class="audioplayer__progressbar-progress"></div>
      <div class="audioplayer__progressbar-nob"></div>
    </section>
    <div class="audioplayer__volume">
      <i class="iconfont iconvolume"></i>
    </div>
  </article>
</template>

<script>
export default {
  name: 'audioPlayer',
  data() {
    return {
    };
  },

};
</script>

<style src='@/audio-player.css'></style>
