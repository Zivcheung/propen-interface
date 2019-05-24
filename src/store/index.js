import Vue from 'vue';
import Vuex from 'vuex';
import axios from '../plugins/mainAxios';
import collaborationStore from './modules/collaborationStore';
import exhibitionStore from './modules/exhibitionStore';

const dev = process.env.NODE_ENV !== 'production';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    collabStore: collaborationStore,
    exhiStore: exhibitionStore,
  },
  state: {
    userId: '',
    login: false,
    userIcon: '',
    username: '',
  },
  mutations: {
    setLogin(state, status) {
      state.login = status;
    },
    setUserInfo(state, payload) {
      state.userIcon = payload.userIcon;
      state.username = payload.username;
    },
    clearUser(state) {
      state.login = false;
      state.userIcon = '';
      state.username = '';
    },
  },
  actions: {
    requestUserInfo({ commit }) {
      return axios.get('userInfo')
        .then((res) => {
          const { data } = res;
          if (data) {
            commit('setUserInfo', {
              userIcon: data.userIcon,
              username: data.username,
            });
            commit('setLogin', true);
          }
        });
    },
  },
  strict: dev,
});
