
<template>
  <article class="comment-board">
    <div class="comment-board__tab" @click="tabJumpHandler">
      <i class="iconfont iconcomment-icon"></i>
    </div>
    <div class="comment-board__header">
      <h2 draggable="true">Comment Board</h2>
    </div>
    <div class="comment-board__newpost" v-show="login">
      <span class="comment-board__newpost-l0" ref="npl0"></span>
      <span class="comment-board__newpost-l1" ref="npl1"></span>
      <span class="comment-board__newpost-l2" ref="npl2"></span>
      <span class="comment-board__newpost-l3" ref="npl3" draggable="true" >
        <i class="iconfont iconadd"></i>
      </span>
      <div class="comment-board__newpost-indicator-add"
      :class="newPostIndicatorClass"
      ref="npIndicator">
        <i class="iconfont iconadd"></i>
        Add New
      </div>
    </div>
    <div class="comment-board__placeholder" v-show ="commentsBucket.length == 0">
      <p> <i>'Be</i> the <i>First'</i></p>
      <p><i class="far fa-grin-stars"></i></p>
    </div>
    <VNodes :vnodes="renderColumns"></VNodes>
    <el-dialog
      :visible.sync="commentDialogVisible"
      width="40%"
      center>
      <h3 class="comment-board__dialog-title">
        Comment <span :style="{'font-size': '12px'}"><i class="fas fa-heart"></i>&nbsp;Share</span>
      </h3>
      <el-input
        type="textarea"
        v-model="comment.content"
        maxlength="1000"
        placeholder="Comment here"
        autofocus
        resize="none"
        :autosize="{
          minRows:5,
          maxRows:20,
        }"
        show-word-limit
        >
      </el-input>
      <el-button class="comment-board__dialog-button"
        @click="postCommentHandler">Share It !</el-button>
    </el-dialog>
  </article>
</template>

<script>
import anime from 'animejs';
import { mapState } from 'vuex';
// import render from 'src/components/common/render';
import observer from 'src/utils/observer';
import commentCard from './commentCard';
import commentGroup from './commentGroup';

export default {
  name: 'commentBoard',
  components: {
    commentCard,
    commentGroup,
    VNodes: {
      functional: true,
      render: (createElement, ctx) => ctx.props.vnodes(createElement),
    },
  },
  props: {
    where: {
      type: String,
      required: true,
    },
  },
  provide() {
    return {
      location: this.where,
    };
  },
  data() {
    return {
      cardWidth: 240,
      columnMargin: 32,
      screenPadding: 100,
      columnNumber: 0,
      commentsBucket: [],
      newPostAnimatePos: [0, 0, 0],
      newPostIndicatorClass: {
        'is-show': false,
        'is-indicated': true,
      },
      comment: {
        content: '',
        payload: {},
      },
      commentDialogVisible: false,
    };
  },
  computed: {
    ...mapState({
      login: state => state.login,
      currentProject: state => state.exhiStore.currentProject,
    }),
    columnHolder() {
      const holder = [];
      const columnNum = this.columnNumber;
      // culc columnholder
      for (let i = 0; i < columnNum; i++) {
        holder.push([]);
      }
      // refill
      const colLen = holder.length;
      this.commentsBucket.forEach((item, i) => {
        holder[i % colLen].push(item);
      });
      console.log('colum reculc')
      return holder;
    },
  },
  methods: {
    clearComment() {
      this.comment.content = '';
      this.comment.payload = {};
    },
    closeCommentDialog() {
      this.commentDialogVisible = false;
    },
    postCommentHandler() {
      const commentPayload = {
        ...this.comment.payload,
        comment: this.formatComment(this.comment.content),
      };
      this.$$axios.post('exhibitionComment', commentPayload)
        .then(() => {
          this.requestComments();
          this.closeCommentDialog();
        })
        .catch(err => alert(err));
      this.clearComment();
    },
    requestComments() {
      this.$$axios.get('/exhibitionComment', {
        params: {
          exhibitionId: this.currentProject.id,
          where: this.where,
        },
      })
        .then((res) => {
          this.commentsBucket = res.data.flattenComments;
        })
        .catch(err => alert(err));
    },
    formatComment(comment) {
      const formated = comment.trim().replace(/\s+/g, ' ');
      return formated;
    },
    culculateColumNum(screenWidth) {
      const avalibaleSpace = (screenWidth - (this.screenPadding * 2)) - this.columnMargin;
      const num = avalibaleSpace / (this.cardWidth + this.columnMargin);
      return Math.floor(num);
    },
    renderColumns(createElement) {
      const columnElement = index => (
        createElement(
          'section',
          {
            class: { 'comment-board__column': true },
          },
          this.columnHolder[index].map(item => createElement('comment-group', {
            props: { comments: item },
            key: item[0]._id,
          })),
        )
      );
      let columns = new Array(this.columnNumber).fill(0);

      columns = columns.map((item, i) => columnElement(i));
      console.log('rerender');
      return createElement('section',
        {
          class: { 'comment-board__row': true },
        },
        columns,
      );
    },
    tabJumpHandler() {
      window.scroll(0, window.innerHeight);
    },
    // new post drag animation
    initiateNewPostAnimation() {
      const np = this.$refs.npl3;
      const npl1 = this.$refs.npl1;
      const npl2 = this.$refs.npl2;
      const npIndicator = this.$refs.npIndicator;
      const shiftDist = 6;
      const dragStartPos = [];
      const startAnimation = [];
      let dropped = false;

      // drag end animation
      const dragendAnimation = (e) => {
        const fleetLevel = 0.05;
        // take care of fast hand
        startAnimation.forEach(item => item.pause());
        if (!dropped) {
          anime({
            targets: [npl1, npl2],
            translateX: 0,
            translateY: 0,
            duration: 1000,
          });
          np.style.opacity = 1;
          anime({
            targets: np,
            translateX: [(e.screenX - dragStartPos[0]) * fleetLevel, 0],
            translateY: [(e.screenY - dragStartPos[1]) * fleetLevel, 0],
            duration: 800,
            easing: 'easeOutElastic(1,.4)',

          });
        } else {
          const allNp = [np, npl1, npl2];
          allNp.forEach((item) => {
            item.style.transform = '';
            item.style.opacity = 1;
          });
          // reset
          dropped = false;
        }
        this.newPostIndicatorClass['is-show'] = false;
        this.newPostIndicatorClass['is-indicated'] = false;
      };

      // droped event
      observer.$on('newPostDropped', (payload) => {
        const { type, commentId, projectId } = payload;
        this.commentDialogVisible = true;
        this.comment.payload = payload;
        dropped = true;
      });

      np.ondragstart = (e) => {
        dragStartPos[0] = e.screenX;
        dragStartPos[1] = e.screenY;
        this.newPostIndicatorClass['is-show'] = true;
        startAnimation.push(
          anime({
            targets: [npl1, npl2],
            translateX: shiftDist - 4,
            translateY: -shiftDist,
            duration: 1000,
          }),
        );
        startAnimation.push(
          anime({
            targets: np,
            opacity: 0,
            duration: 1000,
          }),
        );
      };
      np.ondragend = e => dragendAnimation(e);
      npIndicator.ondragover = (e) => {
        e.preventDefault();
        e.dataTransfer.setData('text/plain', e.target.className);
        e.dataTransfer.dropEffect = 'copy';
        this.newPostIndicatorClass['is-indicated'] = true;
      };
      npIndicator.ondragleave = () => {
        this.newPostIndicatorClass['is-indicated'] = false;
      };
      npIndicator.ondrop = (e) => {
        e.preventDefault();
        observer.$emit('newPostDropped', {
          type: 'NEW_POST',
          where: this.where,
          exhibitionId: this.$store.state.exhiStore.currentProject.id,
        });
      };
    },
  },
  mounted() {
    this.initiateNewPostAnimation();
    this.requestComments();
  },
  created() {
    const screenWidth = window.innerWidth;
    this.columnNumber = this.culculateColumNum(screenWidth);

    // window resize handle
    window.addEventListener('resize', () => {
      this.columnNumber = this.culculateColumNum(window.innerWidth);
    });
  },
};
</script>

<style src="@/comment-board.css"></style>
