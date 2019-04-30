<template>
  <article class="window-page-wp">
    <top-nav></top-nav>
    <section class='radar-nav'>
      <section class='radar-nav__canvas'>
        <section class='radar-nav__content-holder'>
          <template v-for='btn in contentBtns'>
            <content-btn :data='btn' :key='btn.id'></content-btn>
          </template>
          <template v-for='tag in tagBtns'>
            <tag-btn :data='tag' :key='tag.id'></tag-btn>
          </template>
        </section>
      </section>
    </section>
    <comment-board></comment-board>
  </article>
</template>

<script>
import emitter from 'src/utils/observer';
import RadarParticle from 'src/components/radar/radar_canvas/RadarParticle';
import ButtonController from 'src/components/radar/radar_canvas/ContentBtnController';
import TagController from 'src/components/radar/radar_canvas/TagController';
import pDataHolder from 'src/components/radar/radar_canvas/pDataHolder';
import ContentBtn from 'src/components/radar/ContentButton';
import TagButton from 'src/components/radar/TagButton';
import topNav from 'src/components/common/topNavigation';
import commentBoard from 'src/components/commentBoard/commentBoard';

export default {
  components: {
    'content-btn': ContentBtn,
    'tag-btn': TagButton,
    topNav,
    commentBoard,
  },
  data() {
    return {
      particles: [],
      contentBtns: [],
      tagBtns: [],
    };
  },
  methods: {
    renderParticle(_domRef) {
      // const screen = {
      //   height: window.innerHeight,
      //   width: window.innerWidth,
      // };
      this.radarRender = new RadarParticle(_domRef);
      this.particles = pDataHolder.particles;
    },
    cEvent() {
      this.radarRender.hover();
    },
    generateMock(_num) {
      const mock = [];
      for (let i = 0; i < _num; i++) {
        mock.push({
          id: `new Date().valueOf()${i}`,
          attributes: {
            title: 'The perfect name',
            tags: `section ${Math.floor(Math.random() * 45)}`,
          },
        });
      }
      return mock;
    },
    generateTagMock(_num) {
      const mock = [];
      for (let i = 0; i < _num; i++) {
        mock.push({
          id: `000${new Date().valueOf()}${i}`,
          title: `section ${i}`,
        });
      }
      return mock;
    },
  },

  mounted() {
    this.renderParticle('.radar-nav__canvas');
    this.buttonController = new ButtonController();
    this.tagController = new TagController();
    const content = this.generateMock(200);
    const tagMock = this.generateTagMock(44);
    emitter.$on('finished:radar', () => {
      this.contentBtns = this.buttonController.setup(content);
      this.tagBtns = this.tagController.setup(tagMock);
    });
  },
};
</script>
<style src="@/project-nav.css"></style>
<style src="@/radar-nav.css"></style>
<style src="@/gallery.css"></style>

