<template>
  <section class="contribox"
    :class="contriboxClass">
    <div class="contribox__box" ref='boxScroll'>
      <!-- stored contribution -->
      <ul class="contribox__box-scroll" >
        <li class="contribox__item" v-for="item in contributions" :key="item.id">
          <div class="contribox__item-icon">
            <i :class="mapTypeToIcon(item.fileType)"></i>
          </div>
          <p class="contribox__item-name">{{formatName(item.name)}}</p>
        </li>
      </ul>
    </div>
    <!-- contribute new -->
    <div class="contribox__new" v-if="type === 'contribute'">
      <i class="fas fa-plus"></i>
    </div>
    <div class="contribox__close" @click="closeSelf">
      <i class="fas fa-plus"></i>
    </div>
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import SimpleBar from 'simplebar';

const { mapState } = createNamespacedHelpers('collabStore');

export default {
  name: 'contribox',
  props: {
    type: {
      // contribute or compile
      type: String,
      default: 'contribute',
    },
  },
  computed: {
    ...mapState({
      contributions: state => state.contriItems,
    }),
    contriboxClass() {
      const classes = {};
      const typeClass = this.type === 'contribute' ?
        'is-contribute' : 'is-compile';
      classes[typeClass] = true;
      classes['is-folded'] = this.isBoxFolded;
      return classes;
    },
  },
  data() {
    return {
      isBoxFolded: true,
    };
  },
  methods: {
    mapTypeToIcon(type) {
      let iconClass = '';
      switch (type) {
        case 'image':
          iconClass = 'far fa-file-image';
          break;
        case 'audio':
          iconClass = 'far fa-file-audio';
          break;
        case 'video':
          iconClass = 'far fa-file-video';
          break;
        case 'text':
          iconClass = 'far fa-file-word';
          break;
        case 'graphic':
          iconClass = 'fas fa-chart-bar';
          break;
        default:
          iconClass = 'far fa-file';
      }
      return iconClass;
    },
    formatName(_name) {
      let name = _name;
      name = name.replace(/^(.{0,12})(.*)(.{4}$)/, '$1...$3');
      return name;
    },
    closeSelf() {
      this.$$observer.$emit('closeContriBox');
    },
    registerEvent() {
      this.$$observer.$on('openContriBox', () => {
        console.log('open');
        this.isBoxFolded = false;
        console.log(this.isBoxFolded);
      });
      this.$$observer.$on('closeContriBox', () => {
        console.log('close');
        this.isBoxFolded = true;
        console.log('open');
      });
    },
  },
  mounted() {
    console.log(this.contributions);
    console.log(SimpleBar);
    const simpleBar = new SimpleBar(this.$refs.boxScroll, {
      autoHide: true,
    });
    this.registerEvent();
  },
};
</script>

<style src="@/contribox.css"></style>
