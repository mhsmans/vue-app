import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    'access-token': '',
    'refresh-token': '',
    modalState: false
  },
  getters: {
    accessToken(state) {
      return state["access-token"];
    },
    refreshToken(state) {
      return state["refresh-token"];
    },
    currentUser(state) {
      return state.username;
    },
    modalState(state) {
      return state.modalState;
    }
  },
  mutations: {
    storeAccessToken(state, accessToken) {
      state["access-token"] = accessToken;
    },
    storeRefreshToken(state, refreshToken) {
      state["refresh-token"] = refreshToken;
    },
    storeCurrentUser(state, username) {
      state.username = username;
    },
    userLogOut(state) {
      state["access-token"] = '';
      state["refresh-token"] = '';
      state.username = '';
    },
    openModal(state) {
      state.modalState = true;
    },
    closeModal(state) {
      state.modalState = false;
    }
  },
  actions: {
    storeAccessToken(context, accessToken) {
      context.commit('storeAccessToken', accessToken);
    },
    storeRefreshToken(context, refreshToken) {
      context.commit('storeRefreshToken', refreshToken);
    },
    storeCurrentUser(context, username) {
      context.commit('storeCurrentUser', username);
    },
    userLogOut(context) {
      context.commit('userLogOut');
    }
  }
})
