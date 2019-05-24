<template>
  <div class="contentPath">
    <div class="contentPath__section" v-for="section in toc">
      <span class="contentPath__page" v-for="page in section"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'content-path',
  props: {
    toc: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style></style>
