<template>
  <section class="document-editor">
    <template v-if="editor">
      <insert-menu :editor="editor"></insert-menu>
    </template>
    <div class="document-editor__scroll" ref="scroll">
      <section class="document-editor__editor" ref="editorSection"></section>
      <button @click = "saveHandler">save</button>
    </div>
  </section>
</template>

<script>
import MediumEditor from 'medium-editor';
import insertMenu from './insertMenu';
import SimpleBar from 'simplebar';

export default {
  name: 'doucmentEditor',
  components: {
    insertMenu,
  },
  data() {
    return {
      editor: null,
      editorOption: {
        placeholder: {
          text: 'Write your process...',
        },
        toolbar: {
          buttons: ['bold', 'italic', 'quote', 'justifyCenter', 'justifyFull', 'h1', 'h2', 'h3'],
        },
      },
    };
  },
  methods: {
    initEditor() {
      this.editor = new MediumEditor(this.$refs.editorSection, this.editorOption);
    },
    destroyEditor() {
      this.editor.destroy();
    },
    initSimpleBar() {
      const simpleBar = new SimpleBar(this.$refs.scroll, {
        autoHide: true,
        forceVisible: 'x',
      });
      simpleBar.getScrollElement().addEventListener('scroll', () => {
        this.$$observer.$emit('closeHideInsertMenu');
        console.log('scroll');
      });
    },
    saveHandler() {
      console.log(this.editor.serialize());
    },
  },
  mounted() {
    this.initEditor();
    this.initSimpleBar();
  },
  destroyed() {
    this.destroyEditor();
  },
  updated() {
  },
};
</script>

<style src="@/document-editor.css"></style>
<style src="src/../node_modules/medium-editor/dist/css/medium-editor.min.css"></style>
<style src="src/../node_modules/medium-editor/dist/css/themes/beagle.css"></style>



