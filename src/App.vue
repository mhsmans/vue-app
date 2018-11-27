<template>
  <div id="app">
    <div id="nav">
      <div class="container">
        <div>
          <router-link to="home">Home</router-link>
        </div>
        <div v-if="user === ''">
          <router-link to="login">Log in</router-link>
        </div>
        <div v-else>
          {{ user }}
          <a v-on:click="logOut">Log out</a>
        </div>
      </div>
    </div>
    <div class="content container">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.currentUser;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('userLogOut');
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

</style>
