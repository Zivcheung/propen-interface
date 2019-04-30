<template>
  <section class="gallery-card"
    @click="clickHandler($event)"
    :class="{'is-open':openState}"
  >
    <div class="gallery-card__cover" >
      <div class="gallery-card__cover-left">
        <img :src="data.coverImg" :alt="'cover image'" draggable="false">
      </div>
      <div class="gallery-card__cover-right">
        <img :src="data.coverImg" alt="cover image" draggable="false">
      </div>
    </div>
    <div class="gallery-card__description">
    </div>
    <div class="gallery-card__abstract">
      <h3 class="gallery-card__abstract-title">{{data.title}}</h3>
      <p class="gallery-card__abstract-author">{{data.author}}</p>
      <p class="gallery-card__abstract-content">{{data.abstract}}</p>
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
  methods: {
    enterProjectHandler() {
      // enter project
      console.log('enter project');
      this.$router.push({
        path: `/projectIntro/:${this.data.eid}`,
      });
    },
    clickHandler(e) {
      e.stopPropagation();
      this.$emit('click', this.data.eid, e);
    },
  },
  mounted() {
  },
};
</script>

<style src="@/gallery-card.css"></style>
