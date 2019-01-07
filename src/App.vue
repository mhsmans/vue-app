<template>
  <div class="main-container">
    <div id="app">
      <header class="header">
        <!-- Mobile navigation -->
        <div class="mobile-nav">
          <div class="menu-button">
            <h2>Menu</h2>
            <div class="mobile-user">
              <p>{{ user }}</p>
            </div>
          </div>
          <div class="mobile-menu">
            <router-link :to="{ name: 'home' }">Home</router-link>
            <router-link :to="{ name: 'createItem' }">Create item</router-link>
            <div v-if="user === ''">
              <a @click.prevent="openModal" class="mobile-login">Log in</a>
            </div>
            <div v-else>
              <a @click="logOut" class="mobile-login">Log out</a>
            </div>
          </div>
        </div>

        <!-- Browser navigation -->
        <div id="nav">
          <div class="left-group">
            <router-link :to="{ name: 'home' }">
              <font-awesome-icon size="1x" icon="home"/>decoupled-vue.com
            </router-link>
          </div>
          <div class="right-group">
            <router-link :to="{ name: 'createItem' }">Create item</router-link>
            <div v-if="user === ''">
              <a @click.prevent="openModal">Log in</a>
            </div>
            <div v-else class="signed-in">
              <a @click="logOut">Log out</a>
              <div class="user">
                <font-awesome-icon size="1x" class="user-icon" icon="user"/>
                {{ user }}
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="content container">
        <transition name="fade" mode="out-in">
          <router-view/>
        </transition>
        <transition name="fade">
          <div v-if="modalState" class="modal-mask">
            <div class="wrap">
              <font-awesome-icon size="3x" @click="closeModal" class="icon" icon="times"/>
              <authentication/>
            </div>
          </div>
        </transition>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="container">
          <div class="footer-content">
            <p>This is footer text.</p>
            <router-link :to="{ name: 'home' }">
              <font-awesome-icon size="1x" icon="home" class="footer-icon"/>
            </router-link>
          </div>
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
      this.$store.dispatch("userLogOut");
      this.$router.push({ name: "home" });
    },
    openModal() {
      this.$store.commit("openModal");
    },
    closeModal() {
      this.$store.commit("closeModal");
    }
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Nunito");

* {
  box-sizing: border-box;
}

*:before,
*:after {
  box-sizing: border-box;
}

::-webkit-scrollbar {
  width: 0.5em;
}

::-webkit-scrollbar-track {
  background-color: $color-off-white;
}

::-webkit-scrollbar-button {
  display: none;
}

::-webkit-scrollbar-thumb {
  background-color: $color-accent;
}

#app {
  font-family: "Nunito", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $color-font;
}

html {
  height: 100%;
  position: relative;
}

body {
  margin: 0;
  background-color: $color-off-white;
  height: 100%;
  position: relative;
}

// Remove dots when link is clicked.
a {
  outline: 0;
}

#nav {
  display: none;

  @include sm {
    @include nav-shadow;

    background-color: $color-white;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-weight: bold;
    font-size: 1.2em;
    color: $color-font-extra-light;
    padding: 10px 0 10px 0;
    margin-bottom: 20px;

    a {
      cursor: pointer;
      text-decoration: none;
      color: $color-font-extra-light;

      &.router-link-exact-active {
        color: $color-accent;
      }
    }
  }
}

.mobile-nav {
  @include sm {
    display: none;
  }
}

.menu-button {
  background-color: $color-white;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 20px;
  width: 100%;
  @include nav-shadow;

  > h2 {
    margin: 0;
    cursor: pointer;
  }

  .mobile-user {
    > p {
      color: $color-accent;
      margin: 0;
    }
  }
}

.mobile-menu {
  display: grid;
  grid-template-columns: 1fr;
  text-align: left;
  font-size: 1.3em;
  
  > a {
    padding: 10px;
    text-decoration: none;
  }

  > div {
    padding: 10px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.left-group {
  display: flex;
  padding-left: 50px;
}

.right-group {
  display: flex;
  justify-content: flex-end;

  a {
    margin-right: 50px;
  }
}

.signed-in {
  display: flex;
}

.content {
  margin: 0 auto;
}

.modal-mask {
  position: fixed;
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

.user {
  margin-right: 50px;

  &:hover {
    cursor: default;
  }

  > .user-icon {
    color: $color-accent;
  }
}

.footer {
  width: 100%;
  height: 100px;
  position: absolute;
  bottom: 0;
  background-color: $color-dark-gray;
  color: $color-white;

  > .container {
    margin-bottom: 0;
    padding-bottom: 0;
    text-align: center;
  }

  p {
    margin-bottom: 10px;
  }
}

.footer-icon {
  color: $color-white;
}
</style>
