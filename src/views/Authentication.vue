<template>
  <div class="authentication">
    <div v-if="loginModal">
      <transition name="slide-left" mode="out-in">
        <login-form/>
      </transition>
    </div>
    <div v-else>
      <transition name="slide-right" mode="out-in">
        <register-form/>
      </transition>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";

export default {
  name: "authentication",
  components: {
    LoginForm,
    RegisterForm
  },
  computed: {
    loginModal() {
      return this.$store.getters.loginModal;
    }
  }
};
</script>

<style lang="scss" scoped>

// Animations
.slide-left-enter {
  transform: translateX(-350px);
  opacity: 0;
}

.slide-left-enter-active, .slide-left-leave-active {
  transition: all 0.2s ease;
}

.slide-left-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-left-leave {
  transform: translateX(0);
  opacity: 1;
}

.slide-left-leave-to {
  transform: translateX(350px);
  opacity: 0;
}

.slide-right-enter {
  transform: translateX(350px);
  opacity: 0;
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: all 0.2s ease;
}

.slide-right-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-right-leave {
  transform: translateX(0);
  opacity: 1;
}

.slide-right-leave-to {
  transform: translateX(-350px);
  opacity: 0;
}
</style>
