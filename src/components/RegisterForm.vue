<template>
  <div class="form-wrap">
    <div class="valid-registration" v-if="validRegistration">
      <h2>Successfully registered!</h2>
      <p>You can now use your credentials to log in.</p>
      <div class="form-step-buttons">
        <button class="close-button" @click.prevent="close">Close</button>
        <button class="button" @click.prevent="login">Log in</button>
      </div>
    </div>

    <div v-else>
      <form id="register">
        <div class="form-step">
          <p class="error-message" v-if="hasUsernameError">Username is required.</p>
          <input
            type="text"
            id="username"
            placeholder="Username"
            class="form-input"
            v-bind:class="[hasUsernameError ? 'error' : 'no-error']"
            v-model="userData.username"
          >
        </div>
        <div class="form-step">
          <p class="error-message" v-if="hasEmailError">Enter a valid e-mail address.</p>
          <input
            type="email"
            id="email"
            placeholder="E-mail"
            class="form-input"
            v-bind:class="[hasEmailError ? 'error' : 'no-error']"
            v-model="userData.email"
          >
        </div>
        <div class="form-step">
          <p class="error-message" v-if="hasPasswordError">Make sure the passwords match.</p>
          <input
            type="password"
            id="password"
            placeholder="Password"
            class="form-input"
            v-bind:class="[hasPasswordError ? 'error' : 'no-error']"
            v-model="userData.password"
          >
        </div>
        <div class="form-step">
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirm password"
            class="form-input"
            v-bind:class="[hasPasswordError ? 'error' : 'no-error']"
            v-model="userData.confirmPassword"
          >
        </div>
        <div class="register-link">
          <a @click.prevent="login">Already have an account?</a>
        </div>
        <div class="form-step-buttons">
          <button class="close-button" @click.prevent="close">Close</button>
          <button class="button" @click.prevent="submit">Register</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/api/Auth";

export default {
  name: "RegisterForm",
  data() {
    return {
      userData: {
        username: null,
        email: null,
        password: null,
        confirmPassword: null
      },
      hasUsernameError: false,
      hasEmailError: false,
      hasPasswordError: false,
      validRegistration: false
    };
  },
  methods: {
    submit() {
      if (this.checkForm()) {
        AuthService.register(
          this.userData.username,
          this.userData.password,
          this.userData.email
        )
          .then(res => {
            if (res === true) {
              this.validRegistration = true;
            } else {
              alert("Something went wrong.");
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    close() {
      this.$store.commit("closeModal");
    },
    login() {
      this.$store.commit("setLoginModal");
    },
    validEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    checkForm() {
      if (!this.userData.username) {
        this.hasUsernameError = true;
      } else {
        this.hasUsernameError = false;
      }

      if (!this.userData.email || !this.validEmail(this.userData.email)) {
        this.hasEmailError = true;
      } else {
        this.hasEmailError = false;
      }

      if (
        !this.userData.password ||
        !this.userData.confirmPassword ||
        this.userData.password !== this.userData.confirmPassword
      ) {
        this.hasPasswordError = true;
      } else {
        this.hasPasswordError = false;
      }

      if (
        this.hasUsernameError === false &&
        this.hasEmailError === false &&
        this.hasPasswordError === false
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.valid-registration {
  h2 {
    color: $color-success;
  }
}
</style>
