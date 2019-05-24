<template>
  <section class="project-intro">
    <section class="project-intro__cover">
      <div class="project-intro__cover-preview">
        <img :src="data.coverImage" alt="Cover Image">
      </div>
      <div class="project-intro__cover-description">
        <div class="project-intro__cover-descrip-info">
          <h3 class="project-intro__cover-descrip-title">{{data.title}}</h3>
          <p class="project-intro__cover-descrip-author">{{authors}}</p>
          <div class="project-intro__cover-descrip-rating">
            Rating:
            <rating :rating-score="data.rating"></rating>
          </div>
        </div>
        <div class="project-intro__cover-descrip-btns">
          <btn class="project-intro__cover-descrip-enterbtn"
          name="Visite"
          @click="linkToProjectNavHandler"></btn>

          <btn class="project-intro__cover-descrip-processbtn" name="Process Archive"></btn>
        </div>
      </div>
    </section>
    <article class="project-intro__intro">
      <audio-player class='project-intro__audioplayer'
        v-if="data.introVoiceover"
        :source="data.introVoiceover"></audio-player>
      <p class="paragraph" >{{data.introduction}}</p>
    </article>
    <section class="project-intro__partners">
      <h2>Parteners</h2>
      <ul class="project-intro__partner-list">
        <li class="project-intro__partner-item" v-for="item in data.partners" :key="item.name">
          <img :src="item.logo" alt="Brand Logo">
          <p>{{item.name}}</p>
        </li>
      </ul>
    </section>
  </section>
</template>

<script>
import topNav from 'src/components/common/topNavigation';
import btn from 'src/components/common/btn';
import audioPlayer from 'src/components/common/audioPlayer';
import rating from 'src/components/exhibitionProject/rating';

export default {
  name: 'projectIntro',
  components: {
    topNav,
    btn,
    audioPlayer,
    rating,
  },
  props: {
  },
  data() {
    return {
      id: undefined,
      data: {
        title: undefined,
        authors: undefined,
        rating: 0,
        coverImage: '',
        introduction: '',
        introVoiceover: '',
        // partners is frequently required in info page, it is denormalized
        partners: [],
      },
    };
  },
  computed: {
    authors() {
      return this.data.authors ? this.data.authors.reduce((acc, cur, i) => {
        if (i === 0) return cur.toString();
        return `${acc}, ${cur}`;
      }, '') : '';
    },
  },
  methods: {
    linkToProjectNavHandler() {
      this.$router.push({ path: `/projectNav/${this.id}` });
    },
    requestProjectIntro(id) {
      const exhibitionId = encodeURIComponent(id);

      this.$$axios.get('/exhibitionIntroduction', {
        params: { exhibitionId },
      })
        .then((res) => {
          const data = res.data;
          console.log(data);
          this.data.title = data.title;
          this.data.authors = data.authors;
          this.data.coverImage = data.coverImage;
          this.data.introduction = data.introduction;
          this.data.introVoiceover = data.introVoiceover;
        })
        .catch((err) => {
          console.log(err);
          alert('introduction page loading failed');
        });
    },
  },
  watch: {
  },
  created() {
    this.id = this.$route.params.id;
  },
  mounted() {
    const mockupIntro = {
      rating: 4.7,
      partners: [
        // eslint-disable-next-line
        { name: 'github', logo: require('src/assets/logo1.png')},
        // eslint-disable-next-line
        { name: 'brand1', logo: require('src/assets/logo2.jpg')},
        // eslint-disable-next-line
        { name: 'brand3', logo: require('src/assets/logo3.png')},
        // eslint-disable-next-line
        { name: 'brand4', logo: require('src/assets/logo4.png')},
        // eslint-disable-next-line
        { name: 'github12', logo: require('src/assets/logo1.png')},
        // eslint-disable-next-line
        { name: 'brand22', logo: require('src/assets/logo2.jpg')},
        // eslint-disable-next-line
        { name: 'brand32', logo: require('src/assets/logo3.png')},
        // eslint-disable-next-line
        { name: 'fadfsssssssss42', logo: require('src/assets/logo4.png')},
      ],
    };
    this.requestProjectIntro(this.id);
    this.data.partners = mockupIntro.partners;
    this.data.rating = mockupIntro.rating;
  },
};
</script>
<style src="@/project-intro.css"></style>

