import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    'access-token': '',
    'refresh-token': '',
    modalState: false,
    loginModal: true
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
    },
    loginModal(state) {
      return state.loginModal;
    }
  },
  mutations: {
    /****************TOKENS*********************/
    storeAccessToken(state, accessToken) {
      state["access-token"] = accessToken;
    },
    storeRefreshToken(state, refreshToken) {
      state["refresh-token"] = refreshToken;
    },
    /****************USERS**********************/
    storeCurrentUser(state, username) {
      state.username = username;
    },
    userLogOut(state) {
      state["access-token"] = '';
      state["refresh-token"] = '';
      state.username = '';
    },
    /****************MODAL**********************/
    openModal(state) {
      state.modalState = true;
    },
    closeModal(state) {
      state.modalState = false;
    },
    setRegisterModal(state) {
      state.loginModal = false;
    },
    setLoginModal(state) {
      state.loginModal = true;
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
