<template>
  <span class='radar-nav__instruction' @mouseenter='hover' @click='click' :style='cbStyle'>
    <span>-</span>
    <span>{{ data.attr.title }}</span>
  </span>
</template>

<script>
import event from 'src/utils/observer';
// import pDataHolder from './radar_canvas/pDataHolder';

export default {
  props: {
    /*
      data:{
          id,
          particle,
          attr,
        }
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
      // select tag
      event.$emit('selectTag', this.data.attr.title);
    },
    init() {
      this.cbStyle = {
        transform: `translate3d(${this.data.particle.x}px, ${this.data.particle
          .y - 10}px, 0px ) rotate(${this.data.angle}rad`,
        'transform-origin': '0% 50%',
      };
    },
  },
  mounted() {
    this.init();
  },
};
</script>
