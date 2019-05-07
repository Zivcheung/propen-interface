<template>
  <section class="contextmenu">
    <slot name="section-1"></slot>
    <template v-for="i in sectionNumber-1" >
      <span class="contextmenu__divider" :key="i"></span>
      <slot :name="'section-'+(i+1)">
      </slot>
    </template>
  </section>
</template>

<script>
export default {
  name: 'contextmenu',
  props: {
    sectionNumber: {
      type: Number,
      default: 1,
      required: false,
    },
  },
};
</script>

<style src="@/contextmenu.css"></style>
