import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import user from '../services/user';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    profile: {
      email: '',
      username: '',
    },
  },
  mutations: {
    setProfile(state, userData) {
      state.profile = userData;
    },
  },
  actions: {
    getProfileData({ commit }) {
      return user.getProfile().then(({ data }) => {
        commit('setProfile', data);
      });
    },
    updateProfileData({ commit }, userData) {
      return user.editProfile(userData).then(({ data }) => {
        commit('setProfile', data);
      });
    },
  },
  modules: {
    auth,
  },
});
