/* eslint-disable no-shadow */
import axios from 'src/plugins/mainAxios';

const state = {
  user: {
    icon: '',
    username: '',
  },
  currentProject: {
    id: '',
    tableOfContent: [],
    content: [],
    projectId: '',
  },
};

const mutations = {
  resetCurrentProject(state) {
    state.currentProject = {
      tableOfContent: [],
      content: [],
      id: '',
      projectId: '',
    };
  },
  setId(state, id) {
    state.currentProject.id = id;
  },
  setProjectId(state, id) {
    state.currentProject.projectId = id;
  },
  setTableOfContent(state, toc) {
    state.currentProject.tableOfContent = toc;
  },
  setFrameOfContent(state, frame) {
    // todo: implement split lazy loading while needed
    state.currentProject.content = frame;
  },
  setContent(state, content) {
    state.currentProject.content = content;
  },
};

const getters = {
  flatPageList(state) {
    const pages = [];
    const content = state.currentProject.content;
    content.forEach((section) => {
      // load pages to list for contentButton;
      section.pages.forEach((page) => {
        pages.push(page);
      });
    });
    return pages;
  },
};

const actions = {
  requestTocAndContent({ state, commit }, id) {
    if (!id) throw new Error('requestTocAndContent need id param');
    return axios.get('exhibitionContent', {
      params: {
        id,
      },
    })
      .then((res) => {
        const data = res.data;
        if (!data.content || !data.tableOfContent) throw new Error('missing required data from url: exhibitionContnt');
        commit('setContent', data.content);
        commit('setTableOfContent', data.tableOfContent);
        commit('setProjectId', data.projectId);
      });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
