<template>
  <div class="working-canvas-layout">
    <section class="working-canvas-layout__center">
      <slot name="center"></slot>
    </section>
    <section class="working-canvas-layout__right"
    :class="{'is-open': openRight}">
      <slot name="right"></slot>
    </section>
  </div>
</template>

<script>
export default {
  name: 'workingCanvas',
  props: {
    openRight: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
    };
  },
};
</script>

<style src="@/working-canvas.css"></style>
