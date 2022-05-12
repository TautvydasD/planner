/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/store/modules/auth
*
*/
import authentication from '../../services/authentication';

const userData = JSON.parse(localStorage.getItem('user'));

const getUserObject = (isLoggedIn, user) => ({
  isLoggedIn,
  user,
});

const initialState = getUserObject(!!userData, userData);

export default {
  namespaced: true,
  state: initialState,
  mutations: {
    loginSuccess(state, user) {
      state.isLoggedIn = true;
      state.user = user;
    },
    loginFailed(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
    signupSuccess(state, user) {
      state.isLoggedIn = true;
      state.user = user;
    },
    signupFailed(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
    refreshToken(state, accessToken) {
      state.isLoggedIn = true;
      state.user = { ...state.user, accessToken };
    },
  },
  actions: {
    logout({ commit }) {
      localStorage.removeItem('user');
      commit('logout');
    },
    login({ commit }, user) {
      return authentication.login(user).then((data) => {
        if (!data) throw new Error('');
        commit('loginSuccess', data);
        return Promise.resolve(data);
      }).catch(() => {
        commit('loginFailed');
        return Promise.reject(new Error('Failed'));
      });
    },
    loginToFitbit({ commit }, urlData) {
      return authentication.fitbitLogin(urlData).then((data) => {
        if (!data) throw new Error('');
        commit('loginSuccess', data);
        return Promise.resolve(data);
      }).catch(() => {
        commit('loginFailed');
        return Promise.reject(new Error('Failed'));
      });
    },
    signup({ commit }, user) {
      return authentication.signup(user).then((data) => {
        if (!data) throw new Error('');
        commit('signupSuccess', data);
        return Promise.resolve(data);
      }).catch(() => {
        commit('signupFailed');
        return Promise.reject(new Error('Failed'));
      });
    },
    refreshToken({ commit }, accessToken) {
      commit('refreshToken', accessToken);
    },
  },
};
