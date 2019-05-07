import Vue from 'vue';
import Vuex from 'vuex';
import collaborationStore from './modules/collaborationStore';

const dev = process.env.NODE_ENV !== 'production';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    collabStore: collaborationStore,
  },
  strict: dev,
});
