<template>
  <div class="window-page-wp">
    <div class="drawer__backdrop" @click="backdropClcikHandler"></div>
    <section class="drawer__wp"  :style="drawerPlacementStyle">
      <section class="drawer"  :style="drawerStyleMap">
          <slot></slot>
      </section>
    </section>
  </div>
</template>

<script>
export default {
  name: 'drawer',
  props: {
    placement: {
      type: String,
      required: false,
      default: 'left',
      validate: (d) => {
        return ['left', 'right', 'bottom', 'top'].indexOf(d) >=0;
      },
    },
    config: {
      type: Object,
      required: true,
      validate: (d) => {
        return d.deepth !== undefined;
      },
    },
  },
  data() {
    return {
      drawerWindowResizeListener: null,
      drawerHeight: 0,
      drawerWidth: 0,
    };
  },
  methods: {
    backdropClcikHandler() {
      this.$emit('closeDrawer');
    },
  },
  computed: {
    drawerStyleMap() {
      return {
        height: `${this.drawerHeight}px`,
        width: `${this.config.deepth}px`,
      };
    },
    drawerPlacementStyle() {
      let placement;
      switch (this.placement) {
        case 'top':
          placement = {
            top: '50px',
            left: 0,
          };
          break;
        case 'left':
          placement = {
            left: 0,
            top: 0,
          };
          break;
        case 'bottom':
          placement = {
            bottom: 0,
            right: 0,
          };
          break;
        case 'right':
          placement = {
            right: 0,
            top: '50px',
          };
          break;
        default:
          placement = {
            right: 0,
            top: '50px',
          };
      }
      return {
        ...placement,
      };
    },
  },
  mounted() {
    this.drawerHeight = window.innerHeight - 50;
    this.drawerWindowResizeListener = window.addEventListener('resize', () => {
      this.drawerHeight = window.innerHeight - 50;
      this.drawerWidth = window.innerWidth;
    });
  },
  destroyed() {
    window.removeEventListener('resize', this.drawerWindowResizeListener);
  },
};
</script>

<style src="@/drawer.css"></style>
