<template>
  <article class="window-page-wp">
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
    <comment-board
      where="general">
    </comment-board>
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
import { mapState } from 'vuex';

export default {
  components: {
    'content-btn': ContentBtn,
    'tag-btn': TagButton,
    topNav,
    commentBoard,
  },
  data() {
    return {
      id: '',
      contentBtns: [],
      tagBtns: [],
      radar: null,
    };
  },
  computed: {
    ...mapState('exhiStore', [
      'currentProject',
    ]),
  },
  methods: {
    renderParticle(_domRef) {
      this.radar = new RadarParticle(_domRef);
      // call async setup function
      return this.radar.setup();
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
    flattenServerReturnedContent(content) {
      const pageList = [];
      const sectionList = [];
      content.forEach((section) => {
        // load sections to list for tag;
        sectionList.push({
          id: section._id,
          title: section.sectionName,
        });
        // load pages to list for contentButton;
        section.pages.forEach((page) => {
          pageList.push({
            id: page._id,
            attributes: {
              title: page.pageName,
              tags: page.sectionName,
            },
          });
        });
      });
      return {
        pageList,
        sectionList,
      };
    },
    requestProjectNavigation() {
      return this.$store.dispatch('exhiStore/requestTocAndContent', this.id);
    },
  },
  created() {
    this.id = this.$route.params.id;
    this.$store.commit('exhiStore/setId', this.id);
  },
  mounted() {
    this.buttonController = new ButtonController();
    this.tagController = new TagController();
    Promise.all([
      this.renderParticle('.radar-nav__canvas'),
      this.requestProjectNavigation(),
    ])
      .then(() => {
        const { pageList, sectionList } =
          this.flattenServerReturnedContent(this.currentProject.content);
        this.contentBtns = this.buttonController.setup(pageList);
        this.tagBtns = this.tagController.setup(sectionList);
        console.log(this.contentBtns);
      })
      .catch((error) => {
        console.error(error);
        alert('page loading failed');
      });
  },
  beforeDestroy() {
    this.radar.destroy();
    this.buttonController.destroy();
    this.tagController.destroy();
    console.log('destroyed');
  },
};
</script>
<style src="@/project-nav.css"></style>
<style src="@/radar-nav.css"></style>
<style src="@/gallery.css"></style>

