<template>
  <div class="btn" :class="btnClass" @click="$emit('click')">
    {{name}}
  </div>
</template>

<script>
export default {
  name: 'btn',
  props: {
    name: {
      type: String,
      required: true,
      default: 'button',
    },
    type: {
      type: String,
      required: false,
      default: 'normal',
    },
  },
  computed: {
    btnClass() {
      const cls = {};
      const modifier = `btn--${this.type}`;
      cls[modifier] = true;
      return cls;
    },
  },
};
</script>

<style src="@/btn.css">

</style>
