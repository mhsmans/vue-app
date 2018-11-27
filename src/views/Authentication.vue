<template>
  <div class="authentication">
    <auth-form />
  </div>
</template>

<script>
// @ is an alias to /src
import AuthForm from '@/components/AuthForm.vue'

export default {
  name: 'authentication',
  components: {
    AuthForm
  }
}
</script>

<style lang="scss" scoped>

</style>
