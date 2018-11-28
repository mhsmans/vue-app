<template>
  <div class="authentication">
    <div v-if="loginModal">
      <login-form/>
    </div>
    <div v-else>
      <register-form/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'

export default {
  name: 'authentication',
  components: {
    LoginForm,
    RegisterForm
  },
  computed: {
    loginModal() {
      return this.$store.getters.loginModal;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
