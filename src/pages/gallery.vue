<template>
  <div class="window-page-wp">
    <section class="gallery-wall"
    ref="galleryWall"
    :style="{height: wallSize.height+'px'}">
      <div class="gallery-wall__scroll" :style="{'margin-top':hangingPos+'px'}">
        <template v-for="(project) in galleryList.list">
          <gallery-card
            :data="project"
            :key="project.id"
            @click="(e)=>openPreviewHandler(project.id)"
            :openState="project.openState"
          ></gallery-card>
        </template>
      </div>
      <div class="gallery-wall__vertical-plane"></div>
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
      galleryList: {
        list: [],
      },
      responsiveStore: {
      },
      hangingPos: 100,
      // cache opened card, every time open new card close the old one
      openedCard: undefined,
      // window size
      wallSize: {
        height: 0,
        width: 0,
      },
    };
  },
  computed: {
  },
  methods: {
    requestGalleryList(page, startFrom) {
      const glist = this.galleryList;
      this.$$axios.get('/galleryList', {
        params: {
          startFrom: startFrom || '',
          pageNumber: page,
        },
      })
        .then((res) => {
          const data = res.data;
          console.log(res);
          glist.totalCount = data.totalNumber;
          glist.list = data.galleryList.map((item) => {
            const publishedAt = new Date(item.publishedAt).toLocaleDateString();
            return {
              title: item.title,
              publishedAt,
              id: item._id,
              projectId: item.projectId,
              authors: item.authors,
              coverImage: item.coverImage,
              introduction: item.introduction,
            };
          });
        })
        .catch(() => {
          alert('exhibition request failed');
        });
    },
    resetHangingPos() {
      const galleryCardHeight = 442;
      const wallSize = window.innerHeight - 50;
      const center = (wallSize / 2) - (galleryCardHeight / 2);
      this.hangingPos = center - (wallSize * 0.01);

      // change wallSize global
      this.wallSize.height = wallSize;
      this.wallSize.width = window.innerWidth;
    },
    openPreviewHandler(id) {
      // closed prev opened card
      this.openedCard && (this.openedCard.openState = false);
      const card = _.find(this.galleryList.list, item => item.id === id);
      this.$set(card, 'openState', true);
      this.openedCard = card;
    },
    wallClickHandler() {
      this.openedCard && (this.openedCard.openState = false);
    },
    centerCard(i) {
      const me = this;
      const dist = (((i * 326) + 430) - (this.wallSize.width / 2)) + 300;
      let td = me.$refs.galleryWall.scrollLeft;

      (function animateCenter() {
        td += 40;
        me.$refs.galleryWall.scrollLeft = td;
        if (td < dist) {
          requestAnimationFrame(animateCenter);
        }
      }());
    },
  },
  mounted() {
    // initializing position
    this.resetHangingPos();
    window.onresize = () => {
      this.resetHangingPos();
    };
    // mockup data for gallery project
    this.requestGalleryList(1);
  },
  created() {
    // interaction methods defined using hammerjs
    this.$nextTick(() => {
      const wallDom = this.$refs.galleryWall;
      const hammer = new Hammer(wallDom);
      hammer.on('pan', (e) => {
        const originX = wallDom.scrollLeft;
        const panVel = 20;
        wallDom.scrollLeft = originX - (e.velocityX * panVel);
      });
      hammer.on('tap', () => {
        this.wallClickHandler();
      });
    });
  },
};
</script>
<style src="@/gallery.css"></style>
