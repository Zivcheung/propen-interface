<template>
  <article class="window-page-wp">
    <section class="exhicontent"
      :style="{height: mainHeight + 'px'}">
      <el-row class="exhicontent__roof">
        <el-col :span="16" :offset="2">
          <div class="contentpath" @click = "contentpathClickHandler">
            <div class="contentpath__section"
              v-for="section in currentProject.content"
              :key="section._id">
              <span class="contentpath__section-spacer"
                :data-id="section.pages[0]._id"></span>
              <span class="contentpath__page"
                v-for="page in section.pages"
                :key="page._id"
                :class="[ page._id === id? 'is-active' : '']"
                :data-id="page._id"></span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="exhicontent__return-btn"
            @click="returnBtnHandler"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14" :offset="1">
          <div ref="contentRow">
            <el-carousel indicator-position="inside"
              :height="`${windowSize.height - 300 + 'px'}`">
              <el-carousel-item v-for="img in content.illustrations">
                <img :src="img.url"
                  class="exhicontent__illustration"
                  alt="">
              </el-carousel-item>
          </el-carousel>
          </div>
        </el-col>
        <el-col :span="6" :offset="1">
          <div class="exhicontent__desc-wp"
            :style="{'margin-top': descriptionTopMargin + 'px'}">
            <voiceover
              v-if="content.voiceover"
              :source="content.voiceover"></voiceover>
            <div class="exhicontent__desc-text-scroll">
              <p class="exhicontent__desc-text">
                {{content.description}}
              </p>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="exhicontent__nextpage-wp">
        <page-btn></page-btn>
        <page-btn></page-btn>
      </div>
    </section>
    <comment-board
      :where="this.id">
    </comment-board>
  </article>
</template>

<script>
import emitter from 'src/utils/observer';
import topNav from 'src/components/common/topNavigation';
import commentBoard from 'src/components/commentBoard/commentBoard';
import { mapState, mapGetters } from 'vuex';
import pageBtn from 'src/components/exhibitionProject/pageBtn';
import contentPath from 'src/components/exhibitionProject/contentPath';
import returnNavBtn from 'src/components/exhibitionProject/returnNavBtn';
import voiceover from 'src/components/common/audioPlayer';
import simplebar from 'simplebar';


export default {
  components: {
    topNav,
    commentBoard,
    pageBtn,
    contentPath,
    returnNavBtn,
    voiceover,
  },
  data() {
    return {
      id: '',
      contentBtns: [],
      tagBtns: [],
      content: {},
      windowSize: {
        height: 0,
        width: 0,
      },
      descriptionTopMargin: '100px',
      mainHeight: 0,
    };
  },
  computed: {
    ...mapState('exhiStore', [
      'currentProject',
    ]),
    ...mapGetters('exhiStore', [
      'flatPageList',
    ]),
  },
  methods: {
    contentpathClickHandler(e) {
      if (!e.target.dataset.id) return;
      const projectId = e.target.dataset.id;
      // console.log(e.target);
      this.id = projectId;
      this.loadContentFromStore();
    },
    returnBtnHandler() {
      this.$router.push({
        path: `/projectNav/${this.currentProject.id}`,
      });
    },
    loadContentFromStore() {
      this.content = this.flatPageList.find(p => p._id === this.id);
      console.log(this.flatPageList);
    },
    culculateDomHeight() {
      const heightOfPlayerAndMargin = 56;
      const heightOfDesc = 300;
      this.mainHeight = this.windowSize.height - 50;
      if (this.content.voiceover) {
        this.descriptionTopMargin =
          this.$refs.contentRow.getBoundingClientRect()
            .height - heightOfPlayerAndMargin - heightOfDesc;
      } else {
        this.descriptionTopMargin =
          this.$refs.contentRow.getBoundingClientRect()
            .height - heightOfDesc;
      }
    },
  },
  created() {
    console.log(this.$route.query);
    this.id = this.$route.query.pageId;
    this.loadContentFromStore();
  },
  mounted() {
    this.windowSize.height = window.innerHeight;
    this.windowSize.width = window.innerWidth;
    this.$nextTick(() => this.culculateDomHeight());
    new simplebar(document.querySelector('.exhicontent__desc-text-scroll'));
  },
};
</script>
<style src="@/exhibition-content.css"></style>
<style src="@/content-path.css"></style>


