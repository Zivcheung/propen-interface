import axios from 'src/plugins/mainAxios';

const state = {
  currentProjectId: '',
  contriItems: [
    {
      fileType: 'audio',
      name: 'Screen Shot 2019-03-30 at 3.47.43 pm',
    },
    {
      fileType: 'image',
      name: 'recording(1)_fie',
    },
    {
      fileType: 'text',
      name: 'qwwwwwwwwwwwwwwwwwwwwwwwww',
    },
  ],
  documentState: 'unloaded', // unloaded loaded
  document: {
    processes: [
    ],
    methods: [],
  },
};

const mutations = {
  setCurrentProjectId(state, id) {
    state.currentProjectId = id;
  },
  setDocumentProcesses(state, processes) {
    state.document.processes = processes;
  },
  setDocumentMethods(state, methods) {
    state.document.methods = methods;
  },
  setDocumentState(state, docState) {
    state.documentState = docState;
  },
};

const getters = {
};

const actions = {
  updateDocument({ state, commit }, payload) {
    return axios.get('/processesList', {
      params: {
        projectId: state.currentProjectId,
      },
    })
      .then((res) => {
        const { data } = res.data;
        const methods = data.reduce((acc, cur) => {
          if (acc.indexOf(cur.methodName) < 0) {
            acc.push(cur.methodName);
          }
          return acc;
        }, []);
        const sortedProcess = data.map(process => ({
          ...process,
          startDate: new Date(process.startDate),
          endDate: new Date(process.endDate),
        }))
          .sort((a, b) => a.startDate - b.startDate);
        commit('setDocumentProcesses', sortedProcess);
        commit('setDocumentMethods', methods);
        commit('setDocumentState', 'loaded');
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
