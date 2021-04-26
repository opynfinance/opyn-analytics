import Vue from 'vue';
import Vuex from 'vuex';

import modules from './modules';
// import createPersistedState from "vuex-persistedstate";


Vue.use(Vuex);
Vue.use(require('vue-moment'));


export default new Vuex.Store({
  modules,
  strict: false,
  // plugins: [createPersistedState()],
})