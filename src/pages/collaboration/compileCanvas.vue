<template>
  <article class="window-page-wp compile-page">
   <working-canvas-layout :open-right="openRightArea">
      <template v-slot:center>
         <div class="compile-page__workingspace-editor">
          <document-editor></document-editor>
          <button @click="openRightHandler">secret btn</button>
          <div class="compile-page__file-operation">
            <btn name="Discard"></btn>
            <btn name="Preview"></btn>
            <btn name="Publish"></btn>
          </div>
          <contribox
            type="compile"
            ></contribox>
        </div>
      </template>
      <template v-slot:right>
        <div></div>
      </template>
   </working-canvas-layout>
  </article>
</template>

<script>
import topNav from 'src/components/common/topNavigation';
import documentEditor from 'src/components/collaboration/documentEditor';
import workingCanvasLayout from 'src/components/common/workingCanvasLayout';
import contribox from 'src/components/collaboration/contributeBox';
import btn from 'src/components/common/btn';

export default {
  name: 'compilingCanvas',
  components: {
    btn,
    topNav,
    documentEditor,
    workingCanvasLayout,
    contribox,
  },
  data() {
    return {
      openRightArea: false,
      isContriBoxFolded: true,
    };
  },
  computed: {
  },
  methods: {
    openRightHandler() {
      this.openRightArea = !this.openRightArea;
    },
    openContriBox() {
      this.isContriBoxFolded = false;
    },
  },
  mounted() {
  },
  updated() {
  },
};
</script>

<style src="@/compile-page.css"></style>
