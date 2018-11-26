<template>

    <form id="login">
        <div class="form-step">
            <label for="username">Username:</label>
            <input
                type="text"
                id="username"
                class="form-input"
                v-model="userData.username"/>
        </div>
        <div class="form-step">
            <label for="password">Password:</label>
            <input 
                type="password"
                id="password"
                class="form-input"
                v-model="userData.password"/>
        </div>
        <div class="form-step">
            <button 
                class="button"
                @click.prevent="submit">
                Log in
            </button>
        </div>
    </form>

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
        }
    };
  },
  methods: {
      submit() {
          AuthService.passwordGrant(this.userData.username, this.userData.password)


          /*************TO DO ******************/
          // redirect 
          // clear userData object
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
