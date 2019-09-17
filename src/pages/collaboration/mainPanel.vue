<template>
  <article class="window-page-wp" v-loading="documentState === 'unloaded'">
    <template v-if="documentState === 'loaded'">
      <canvas-layout :open-right="openRightArea">
        <template v-slot:center>
          <router-view ></router-view>
        </template>
        <template v-slot:right>
          <div></div>
        </template>
      </canvas-layout>
      <transition name='right-drawer'>
      </transition>
    </template>
  </article>
</template>

<script>
import topNav from 'src/components/common/topNavigation';
import canvasLayout from 'src/components/common/workingCanvasLayout';
import { initIO, getIO } from 'src/plugins/io';
import { mapState } from 'vuex';

export default {
  name: 'collaboration',
  components: {
    topNav,
    canvasLayout,
  },
  data() {
    return {
      verticleScaleDist: 50,
      padding: 100,
      timeScaleBase: 'months',
      contextMenuPos: [0, 0],
      showNodeContextMenu: false,
      showContextMenu: false,
      showNewProcessDrawer: false,
      openRightArea: false,
      io: null,
    };
  },
  computed: {
    ...mapState('collabStore', [
      'documentState',
    ]),
  },
  methods: {
    toggleRightArea() {
      this.openRightArea = !this.openRightArea;
    },
    startIO() {
      this.io = initIO();
      this.io.emit('joinRoom', {
        user: this.$store.state.username,
        roomId: this.$store.state.collabStore.currentProjectId,
      });
      this.io.on('userJoined', (payload) => {
        const h = this.$createElement;
        this.$notify({
          title: 'Hi, team',
          message: h('i', {}, `${payload.user} has entered`),
        });
      });
      this.io.on('userLeaveNotify', (payload) => {
        const h = this.$createElement;
        console.log('leaved')
        console.log(payload)
        this.$notify({
          title: 'Bye, team',
          message: h('i', {}, `${payload.user} has leaved`),
        });
      });
    },
  },
  mounted() {
    this.areaWidth = window.innerWidth;
    this.startIO();
    this.$store.dispatch('collabStore/updateDocument');
  },
  updated() {
    // this.renderScene();
  },
  beforeDestroy() {
    this.io.disconnect({ user: this.$store.state.username });
  },
};
</script>

<style src="@/processviz-working-layout.css"></style>
<style src="@/processviz-working.css"></style>
