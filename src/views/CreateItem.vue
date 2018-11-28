<template>
  <div class="createItem">
    <div v-if="signedIn !== ''">
      <item-form/>
    </div>
    <div v-else>
      <div class="wrap">
        <p>To create new items you must be logged in.</p>
        <button class="button" @click.prevent="openModal">Log in</button>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ItemForm from "@/components/ItemForm.vue";

export default {
  name: "createItem",
  components: {
    ItemForm
  },
  computed: {
    signedIn() {
      return this.$store.getters.currentUser;
    }
  },
  methods: {
    openModal() {
      this.$store.commit("openModal");
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  p {
    font-size: 1.3em;
  }
}
</style>

