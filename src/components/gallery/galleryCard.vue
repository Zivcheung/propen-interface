<template>
  <section class="gallery-card"
    @click="clickHandler($event)"
    :class="{'is-open':openState}"
  >
    <div class="gallery-card__cover" >
      <div class="gallery-card__cover-left">
        <img :src="data.coverImage" :alt="'cover image'" draggable="false">
      </div>
      <div class="gallery-card__cover-right">
        <img :src="data.coverImage" alt="cover image" draggable="false">
      </div>
    </div>
    <div class="gallery-card__description">
    </div>
    <div class="gallery-card__abstract">
      <h3 class="gallery-card__abstract-title">{{data.title}}</h3>
      <p>{{authors}}</p>
      <p>Published at: {{this.data.publishedAt}}</p>
      <p class="gallery-card__abstract-author">{{data.author}}</p>
      <p class="gallery-card__abstract-content">{{introduction}}</p>
      <btn class="gallery-card__enter-btn"
        type="normal"
        name="Enter"
        @click="enterProjectHandler"></btn>
    </div>
  </section>
</template>

<script>
import btn from 'src/components/common/btn';
export default {
  name: 'galleryCard',
  components: {
    btn,
  },
  props: {
    openState: false,
    data: {
      /* {
        eid,
        coverImg,
        title,
        author,
        abstract,
      } */
      required: true,
      type: Object,
      state: 'loading',
    },
  },
  data() {
    return {
    };
  },
  computed: {
    introduction() {
      let text = this.data.introduction.slice(0, 300);
      text = text.replace(/\s\w*$/, '...');
      return text;
    },
    authors() {
      console.log(typeof this.data.publishedAt)
      return this.data.authors.reduce((acc, cur, i) => {
        if (i === 0) return cur.toString();
        return `${acc}, ${cur}`;
      }, '');
    },
  },
  methods: {
    enterProjectHandler() {
      // enter project
      console.log('enter project');
      this.$router.push({
        path: `/projectIntro/${this.data.id}`,
      });
    },
    clickHandler(e) {
      e.stopPropagation();
      this.$emit('click', this.data.id, e);
    },
  },
  mounted() {
  },
};
</script>

<style src="@/gallery-card.css"></style>
