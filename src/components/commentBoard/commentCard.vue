<template>
  <section class="comment-card" @click="$emit('click')" ref="card">
    <div class="comment-card__head">
      <img :src="data.avatar" alt="">
      <div class="comment-card__head-username">{{data.username}}</div>
    </div>
    <div class="comment-card__comment">
      <div class="comment-card__comment-scroll">
        {{data.comment}}
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'commentCard',
  props: {
    data: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  mounted() {
  },
};
</script>

<style src="@/comment-card.css"></style>
