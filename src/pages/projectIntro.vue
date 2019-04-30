<template>
  <section class="project-intro">
    <top-nav></top-nav>
    <section class="project-intro__cover">
      <div class="project-intro__cover-preview">
        <img :src="data.cover" alt="Cover Image">
      </div>
      <div class="project-intro__cover-description">
        <div class="project-intro__cover-descrip-info">
          <h3 class="project-intro__cover-descrip-title">{{data.title}}</h3>
          <p class="project-intro__cover-descrip-author">{{data.author}}</p>
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
      <audio-player class='project-intro__audioplayer'></audio-player>
      <p class="paragraph" v-for="(p,i) in data.introduction" :key="i">{{p}}</p>
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
      eid: undefined,
      data: {
        title: undefined,
        author: undefined,
        rating: 0,
        cover: '',
        introduction: '',
        voiceOver: '',
        // partners is frequently required in info page, it is denormalized
        partners: [],
      },
    };
  },
  methods: {
    linkToProjectNavHandler() {
      this.$router.push({ path: `/projectNav/:${this.eid}` });
    },
  },
  created() {
    this.eid = this.$route.params.eid;
  },
  mounted() {
    const mockupIntro = {
      title: 'Hope',
      author: 'Xavier Willamous', // here author may be a team
      rating: 4.7,
      // eslint-disable-next-line
      cover: require('src/assets/intro-cover.jpeg'),
      introduction: `If you doubt me, I challenge you to give it a try! By the end of this article, you will be able to run a Microservice based application on a Kubernetes Cluster. And I guarantee this because it’s how I introduce our clients to Kubernetes.

What does this guide do differently from the other resources, Rinor?

Quite a lot! Most guides start with the simple stuff: Kubernetes concepts and and kubectl commands. These guides assume the reader knows about application development, Microservices, and Docker containers.

In this Article we will go from :

Running a Microservice based application on your computer.
Building container images for each service of the Microservice application.
Introduction to Kubernetes. Deploying a Microservice based application into a Kubernetes Managed Cluster.
The gradual build up provides the depth required for a mere mortal being to grasp the simplicity of Kubernetes. Yes Kubernetes is simple when you know the context it is used in. Without further ado lets see what we will build.`,
      voiceOver: 'working on it',
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
    setTimeout(() => {
      this.data = mockupIntro;
      this.data.introduction = this.data.introduction.split(/\n+/g);
    }, 500);
  },

};
</script>
<style src="@/project-intro.css"></style>

