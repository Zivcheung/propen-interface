<template>
  <div class="window-page-wp">
    <top-nav></top-nav>
    <section class="gallery-wall" ref="galleryWall" @click="wallClickHandler($event)">
      <div class="gallery-wall__scroll" :style="{'margin-top':hangingPos+'px'}">
        <template v-for="(project , i) in projects">
          <gallery-card
            :data="project"
            :key="project.eid"
            @click="(eid,e)=>openPreviewHandler(eid,i,e)"
            :openState="project.openState"
          ></gallery-card>
        </template>
      </div>
    </section>
  </div>
</template>

<script>
import galleryCard from 'src/components/gallery/galleryCard';
import topNavigation from '../components/common/topNavigation';
// eslint-disable-next-line
import Hammer from 'hammerjs';

export default {
  name: 'gallery',
  components: {
    'top-nav': topNavigation,
    'gallery-card': galleryCard,
  },
  data() {
    return {
      projects: [],
      responsiveStore: {
      },
      hangingPos: 100,
      // cache
      openedCard: undefined,
      // window size
      wallSize: {
        height: 0,
        width: 0,
      },
    };
  },
  methods: {
    resetHangingPos() {
      const galleryCardHeight = 442;
      const wallSize = window.innerHeight - 50;
      const center = (wallSize / 2) - (galleryCardHeight / 2);
      this.hangingPos = center - 40;

      //change wallSize global
      this.wallSize.height = wallSize;
      this.wallSize.width = window.innerWidth;

    },
    openPreviewHandler(eid,i,e) {
      // closed prev opened card
      this.openedCard && (this.openedCard.openState = false);
      const card = _.find(this.projects, i => i.eid === eid);
      card.openState = true;
      // setTimeout(() => {
      //   this.centerCard(i)},300)
      // cache
      this.openedCard = card;
    },
    wallClickHandler(e){
      this.openedCard && (this.openedCard.openState = false);
    },
    centerCard(i) {
      const me = this;
      const dist = ((i * 326) + 430) - (this.wallSize.width / 2) + 300;
      let td = me.$refs.galleryWall.scrollLeft;

      (function animateCenter() {
        td += 40;
        me.$refs.galleryWall.scrollLeft = td;
        if(td < dist){
          requestAnimationFrame(animateCenter);
        }
      })();
    },
  },
  mounted() {
    this.resetHangingPos();
    // initializing position
    // window.onresize = function () {
    // };
    // mockup data for gallery project
    for (let i = 0; i < 10; i += 1) {
      this.projects.push({
        title: 'HOPE',
        author: 'xavier',
        eid: `${i}_aa22`,
        abstract: 'arter frustrates the seed near the once jam. Why won\'t each charm wed under the rabid adult? The french rip dies next to an only microprocessor. The exhibit replies to the fever.Does a chemist flower your philosophical head? The implied drug fishes the annoyed zero. The charter frustrates the seed near the once jam. Why won\'t each charm wed under the rabid adult? The french rip dies next to an only microprocessor. The exhibit replies to the fever.Does a chemist flower your philosophical head? The implied drug fishes the annoyed zero. The charter frustrates the seed near the once jam. Why won\'t each charm wed under the rabid adult? The french rip dies next to an only microprocessor. The exhibit replies to the fever.Does a chemist flower your philosophical head? The implied drug fishes the annoyed zero. The charter frustrates the seed near the once jam. Why won\'t each charm wed under the rabid adult? The french rip dies next to an only microprocessor. The exhibit replies to the fever.',
        // eslint-disable-next-line
        coverImg: require('src/assets/project_cover.png'),
        // control state
        openState: false,
      });
    }
  },
  created() {
    this.$nextTick(() => {
      const wallDom = this.$refs.galleryWall;
      const hammer = new Hammer(wallDom);
      hammer.on('pan', (e) => {
        const originX = wallDom.scrollLeft;
        const panVel = 30;
        wallDom.scrollLeft = originX - (e.velocityX * panVel);
      });
    });
  },
};
</script>
<style src="@/gallery.css"></style>
