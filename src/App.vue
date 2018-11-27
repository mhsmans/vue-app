<template>
  <div id="app">
    <div id="nav">
      <div class="container">
        <div>
          <router-link to="home">Home</router-link>
        </div>
        <div v-if="user === ''">
          <a @click.prevent="openModal">Log in</a>
        </div>
        <div v-else>
          {{ user }}
          <a @click="logOut">Log out</a>
        </div>
      </div>
    </div>
    <div class="content container">
      <router-view/>
      <div v-if="modalState === true" class="modal-mask">
        <div class="wrap">
          <font-awesome-icon size="3x" @click="closeModal" class="icon" icon="times"/>
          <test/>
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

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $color-font;
}

body {
  margin: 0;
}

#nav {
  background-color: $color-white;

  @include nav-shadow;
}

#nav > .container {
  display: grid;
  grid-template-columns: 1fr 1fr;

  a {
    font-weight: bold;
    color: $color-primary;
    cursor: pointer;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.content {
  margin: 0 auto;
}

.container {
  padding: 20px 15px 20px 15px;
  margin-right: auto;
  margin-left: auto;

  @include sm {
    width: 750px;
  }

  @include md {
    width: 970px;
  }

  @include lg {
    width: 1170px;
  }
}

.modal-mask {
  position: fixed;
  padding: 20px;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color-dark-gray, 0.7);
}

.icon {
  color: $color-white;
  display: flex;
  margin: 10px 0 10px auto;
  cursor: pointer;
  transition: all 0.3s ease;

  :hover {
    color: $color-error;
    transform: scale(1.1);
  }
}

.wrap {
  width: fit-content;
  padding: 20px;
  margin: 0 auto;
}

</style>
