<template>
  <section class="comment-card__group"
    :style="{height: this.groupHeight+'px', 'z-index': layerHeight}"
    ref="commentGroup"
    :class="groupClasses">
    <comment-card v-for="(comment,i) in comments"
      :key="comment.id"
      :data="comment"
      :style="cardStyles[i]"
      @click="cardClickHandler(i)"
      ref="commentCard"/>
  </section>
</template>

<script>
import observer from 'src/utils/observer';
import commentCard from './commentCard';

export default {
  name: 'commentGroup',
  components: {
    commentCard,
  },
  props: {
    comments: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      cardSize: 240, // card is a 240px square
      cardHeadHeight: 50, // closed tab
      cardsPosition: [],
      groupHeight: 240,
      layerHeight: 0, // z-index
      openedCards: [],
      groupClasses: {},
    };
  },
  computed: {
    cardStyles() {
      const styleList = [];
      this.cardsPosition.forEach((item) => {
        styleList.push({
          position: 'absolute',
          top: `${item.top}px`,
          transform: `translateY(${item.transformY}px)`,
        });
      });
      return styleList;
    },
    cardBodySize() {
      return this.cardSize - this.cardHeadHeight;
    },
  },
  methods: {
    cardClickHandler(clickedIndex) {
      if (this.openedCards.length === 0) {
        observer.$emit('singleOpenedGroup', this);
      }
      const openState = this.openedCards.indexOf(clickedIndex) >= 0;

      if (openState) {
        this.cardsPosition.forEach((pos, i) => {
          if (i > clickedIndex) {
            // eslint-disable-next-line
            pos.transformY -= this.cardBodySize - 12;
          }
        });
        // reassign here to deal with reactive update
        const list = this.openedCards;
        this.openedCards = _.without(list, clickedIndex);
        return;
      }

      this.cardsPosition.forEach((pos, i) => {
        if (i > clickedIndex) {
          // eslint-disable-next-line
          pos.transformY += this.cardBodySize - 12;
        }
      });
      this.layerHeight = 10;
      this.openedCards.push(clickedIndex);
    },

    resetCardsPos() {
      this.comments.forEach((item, i) => {
        this.$set(this.cardsPosition, i, {
          top: this.cardHeadHeight * i,
          transformY: 0,
        });
      });
    },
    initiateGroupDropEvent() {
      const commentGroupDom = this.$refs.commentGroup;
      let counter = 0; // counter for dragevent turbulance

      // enter indication
      commentGroupDom.ondragenter = () => {
        counter++;
        this.$set(this.groupClasses, 'is-dragenter', true);
      };
      // remove enter indication
      commentGroupDom.ondragleave = () => {
        counter--;
        if (counter <= 0) {
          this.$set(this.groupClasses, 'is-dragenter', false);
        }
      };

      // drop preparation (todo)
      commentGroupDom.ondragover = (e) => {
        e.preventDefault();
        e.dataTransfer.setData('text/plain', e.target.className);
        e.dataTransfer.dropEffect = 'copy';
      };
      // drop action (todo)
      commentGroupDom.ondrop = (e) => {
        e.preventDefault();
        counter = 0;
        this.$set(this.groupClasses, 'is-dragenter', false);
        observer.$emit('newPostDropped');
      };
    },
  },
  watch: {
    // while all card closed, set z-index back to 0 (its alias is layerheight)
    openedCards(val) {
      if (val.length === 0) {
        this.layerHeight = 0;
      }
    },
  },
  mounted() {
    this.initiateGroupDropEvent();
  },
  created() {
    // initiate card position
    this.resetCardsPos();
    // initiate sum height
    this.groupHeight =
      (this.cardHeadHeight * this.comments.length) + (this.cardSize - this.cardHeadHeight);
    // register instance to the cards pool observer store
    observer.$on('singleOpenedGroup', (self) => {
      if (self !== this) {
        this.layerHeight = 0;
        this.resetCardsPos();
        this.openedCards = [];
      }
    });
  },
};
</script>

<style class="@/comment-card.css"></style>
