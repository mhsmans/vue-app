<template>
  <div id="app">
    <div id="nav">
      <div class="left-group">
        <router-link to="home">
          <font-awesome-icon size="1x" icon="home"/>
          decoupled-vue.com
        </router-link>
      </div>
      <div class="right-group" v-if="user === ''">
        <a @click.prevent="openModal">Log in</a>
      </div>
      <div class="right-group" v-else>
        <a @click="logOut">Log out</a>
        <div class="user">
          <font-awesome-icon size="1x" icon="user"/>
          {{ user }}
        </div>
      </div>
    </div>
    <div class="content container">
      <router-view/>
      <div v-if="modalState === true" class="modal-mask">
        <div class="wrap">
          <font-awesome-icon size="3x" @click="closeModal" class="icon" icon="times"/>
          <authentication/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.currentUser;
    },
    modalState() {
      return this.$store.getters.modalState;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('userLogOut');
    },
    openModal() {
      this.$store.commit('openModal');
    },
    closeModal() {
      this.$store.commit('closeModal');
    }
  }
}

</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Quicksand');

#app {
  font-family: "Quicksand", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $color-font;
}

body {
  margin: 0;
}

#nav {
  @include nav-shadow;

  background-color: $color-secondary;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-weight: bold;
  font-size: 1.2em;
  color: $color-white;
  padding: 10px 25px 10px 25px;

  a {
    cursor: pointer;
    text-decoration: none;
    color: $color-white;

    &.router-link-exact-active {
      border-bottom: 1px solid white;
    }
  }
}

.left-group {
  display: flex;
}

.right-group {
  display: flex;
  justify-content: right;

  a {
    margin-right: 50px;
  }
}

.content {
  margin: 0 auto;
}

.modal-mask {
  position: fixed;
  padding: 20px;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color-dark-gray, 0.4);
}

.icon {
  color: $color-white;
  display: flex;
  margin: 10px 0 10px auto;
  cursor: pointer;
  transition: all 0.3s ease;

  :hover {
    color: $color-error;
  }
}

.wrap {
  width: fit-content;
  padding: 20px;
  margin: 0 auto;
}

.user:hover {
  cursor: default;
}

</style>
