<template>
  <div class="form-wrap">
    <form id="login">
      <div class="error-message" v-show="hasError">
        <p>Invalid username and password combination.</p>
      </div>
      <div class="form-step">
        <input
          type="text"
          id="username"
          placeholder="Username"
          class="form-input"
          v-bind:class="[hasError ? 'error' : 'no-error']"
          v-model="userData.username"
        >
      </div>
      <div class="form-step">
        <input
          type="password"
          id="password"
          placeholder="Password"
          class="form-input"
          v-bind:class="[hasError ? 'error' : 'no-error']"
          v-model="userData.password"
        >
      </div>
      <div class="register-link">
        <a @click.prevent="register">New here? Sign up!</a>
      </div>
      <div class="form-step-buttons">
        <button class="close-button" @click.prevent="close">Close</button>
        <button class="button" @click.prevent="submit">Log in</button>
      </div>
    </form>
  </div>
</template>

<script>
import AuthService from '@/services/api/Auth'

export default {
  name: "LoginForm",
  data() {
    return {
        userData: {
            username: '',
            password: ''
        },
        hasError: false
    };
  },
  methods: {
      submit() {
          AuthService.passwordGrant(this.userData.username, this.userData.password)
          .then(data => {
              if (data !== false) {
                  this.hasError = false;
                  this.$store.commit('closeModal');
              } else {
                  this.hasError = true;
              }
          })
          .catch(err => {
              console.log(err);
          })
      },
      close() {
          this.$store.commit('closeModal');
      },
      register() {
          this.$store.commit('setRegisterModal');
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

.form-wrap {
    background-color: $color-white;
    padding: 25px;
    width: fit-content;
    margin: auto;
}

.form-step {
    margin: 20px 0 40px 0;
}

.form-step-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

input {
    font-size: 1.3em;
    padding: 10px;
    min-width: 350px;
}

.button {
    font-size: 1.3em;
    border: 0;
    padding: 10px 20px 10px 20px;
    background-color: $color-primary;
    color: $color-white;
    cursor: pointer;
}

.close-button {
    font-size: 1.3em;
    border: 0;
    padding: 10px 20px 10px 20px;
    background-color: $color-error;
    color: $color-white;
    cursor: pointer;
}

.register-link {
    font-size: 0.8em;
    text-decoration: underline;
    cursor: pointer;
    color: $color-link;
}

.error {
    border: 2px solid $color-error;
    transition: all 0.2s ease;
}

.no-error {
    border: 2px solid $color-primary;
}

.error-message {
    text-align: left;
    color: $color-error;
    margin-bottom: 5px;
}

</style>
