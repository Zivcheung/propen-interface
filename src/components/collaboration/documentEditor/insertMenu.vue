<template>
  <div class="document-editor__insertmenu-wp"
    v-loading="uploading"
    element-loading-spinner = "el-icon-loading"
    v-show="this.menu.show"
    :class="{'is-open':menu.open}"
    :style="menu.position">
    <div class="document-editor__insertmenu-insertbtn" @click="openMenuHandler()">
      <i class="fas fa-plus"></i>
    </div>
    <div class="document-editor__insertmenu">
      <div class="document-editor__insertmenu-btn" @click="uploadFile">
        <i class="far fa-image"></i>
      </div>
      <div class="document-editor__insertmenu-btn" @click="$emit('videoClick')">
        <i class="far fa-play-circle"></i>
      </div>
      <div class="document-editor__insertmenu-btn" @click="$emit('audioClick')">
        <i class="fas fa-volume-down"></i>
      </div>
      <div class="document-editor__insertmenu-btn" @click="$emit('dividerClick')">
        <i class="fas fa-ellipsis-h"></i>
      </div>
       <div class="document-editor__insertmenu-btn" @click="contriBoxBtnHandler()">
        <i class="fas fa-archive"></i>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'editorInsertMenu',
  props: {
    editor: {
      type: [Object, null],
      required: true,
    },
  },
  data() {
    // constant
    this.menuAlignOffset = {
      top: -160, // pos from top of the window
      left: -50,
    };

    return {
      uploading: false,
      menu: {
        open: false,
        show: true,
        currentLine: undefined,
        position: {
          top: `${this.menuAlignOffset.top}px`,
          left: `${this.menuAlignOffset.left}px`,
        },
      },
    };
  },
  methods: {
    contriBoxBtnHandler() {
      this.$$observer.$emit('openContriBox');
    },
    openMenuHandler() {
      this.menu.open = !this.menu.open;
    },
    subscribeEvent() {
      if (this.editor) {
        this.editor.subscribe('editableClick', this.toggleMenu);
        this.editor.subscribe('editableKeyup', this.toggleMenu);
        this.editor.subscribe('editableScroll', this.toggleMenu);
      }
    },
    unsubscribeEvent() {
      if (this.editor) {
        this.editor.subscribe('editableClick', this.toggleMenu);
        this.editor.subscribe('editableKeyup', this.toggleMenu);
      }
    },
    closeMenu() {
      this.menu.open = false;
      this.menu.show = false;
      this.menu.currentLine = undefined;
    },
    toggleMenu() {
      // first close menu
      this.menu.open = false;

      const currentLine = this.editor.getSelectedParentElement();
      this.menu.currentLine = currentLine;
      const currentPos = currentLine.getBoundingClientRect();
      const content = currentLine.innerHTML.replace(/<br>/, '').trim();
      if (!content) {
        this.menu.show = true;
        this.menu.position.left = `${this.menuAlignOffset.left}px`;
        this.menu.position.top = `${currentPos.top + this.menuAlignOffset.top}px`;
      } else {
        this.closeMenu();
      }
    },
    uploadFile() {
      const input = document.createElement('input');
      const formData = new FormData();
      input.type = 'file';
      input.onchange = (e) => {
        // ajax upload
        const fileUrl = input.files[0];
        const fileReader = new FileReader();
        // register onload event
        fileReader.onload = () => {
          formData.set('file', fileUrl);
          formData.set('projectId', this.$store.state.collabStore.currentProjectId);
          // start loader
          this.uploading = true;
          // ajax
          this.$$axios({
            method: 'post',
            url: '/imageUpload',
            data: formData,
            config: {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          }).then((res) => {
            const data = res.data;
            const imgEle = document.createElement('img');
            const newLine = document.createElement('p');
            newLine.innerHTML = '<br>';
            this.uploading = false;
            imgEle.src = data.url;
            this.menu.currentLine.appendChild(imgEle);
            this.menu.currentLine.parentNode.appendChild(newLine);
          }).catch(err => alert(err));
        };

        fileReader.readAsDataURL(fileUrl);
      };
      input.click();
    },
    initEvent() {
      this.$$observer.$on('closeHideInsertMenu', () => {
        this.menu.open = false;
        this.menu.show = false;
      });
    },
  },
  mounted() {
    this.subscribeEvent();
    this.initEvent();
  },
  destroyed() {
    this.unsubscribeEvent();
  },
};
</script>

<style src="@/document-editor.css"></style>
