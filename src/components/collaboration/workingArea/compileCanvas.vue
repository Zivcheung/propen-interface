<template>
  <div class="compile-page" v-loading="saving">
    <div class="compile-page__file-operation">
      <btn name="Discard"></btn>
      <btn name="Publish" @click="publishHandler"></btn>
    </div>
    <template v-if="requestContent.state === 'loaded'">
      <document-editor ref="editor" :request-content="requestContent.content"></document-editor>
    </template>
    <contribox
      type="compile"
      ></contribox>
  </div>
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
      requestContent: {
        state: 'unloaded',
        content: '',
      },
      processId: '',
      saving: false,
      openRightArea: false,
      isContriBoxFolded: true,
    };
  },
  computed: {
  },
  methods: {
    publishHandler() {
      const content = this.$refs.editor.editor.serialize()['element-0'].value;
      this.saving = true;
      this.$$axios.post('publishDocument', {
        content,
        projectId: this.$store.state.collabStore.projectId,
        processId: this.$route.query.id,
      })
        .then(() => {
          this.saving = false;
          this.$router.push({ path: '/collaboration' });
        })
        .catch(err => alert(err));
    },
    requestDocument() {
      const docId = this.$route.query.id;
      this.$$axios.get('/compileDocument', {
        params: {
          id: docId,
        },
      }).then((res) => {
        const resData = res.data;
        const { document } = resData;
        if (document) {
          this.requestContent.content = document.content;
          console.log(this.requestContent.content)
        }
        this.requestContent.state = 'loaded';
      }).catch(err => alert(err));
    },
    openRightHandler() {
      this.openRightArea = !this.openRightArea;
    },
    openContriBox() {
      this.isContriBoxFolded = false;
    },
  },
  created() {
    this.requestDocument();
  },
  mounted() {
    console.log(this.$route.query.id);
    this.processId = this.$route.query.id;
  },
  updated() {
  },
};
</script>

<style src="@/compile-page.css"></style>
