<template>
  <span class="radar-nav__content" @mouseenter="hover" @click="click" :style="cbStyle">
    <span class="radar-nav__content-title" :class="{hide:true}">{{data.attr.title || '* Beyound definition'}}</span>
  </span>
</template>
<script>

export default {
  props: {
    /*
      data:{id, particle, attr,}
    */
    data: {
      type: Object,
      requrie: true,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      cbStyle: {},
    };
  },
  methods: {
    hover() {
      // show preview is defiened in css
      this.data.particle.hover();
    },
    click() {
      // open the coresponding page
      this.$router.push({
        path: '/projectContent',
        query: {
          pageId: this.data.id,
        },
      });
    },
    init() {
      // find its position by looking into its coresponding particle
      this.cbStyle = {
        transform: `translate3d(${this.data.particle.x}px,${
          this.data.particle.y
        }px,0px)`,
      };
    },
  },
  mounted() {
    this.init();
  },
};
</script>
