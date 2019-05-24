
export default {
  name: 'render',
  props: {
    render: {
      type: Function,
      required: true,
    },
  },
  render(createElement) {
    return this.render(createElement);
  },
};
