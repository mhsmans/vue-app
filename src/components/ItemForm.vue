<template>
  <div class="form-wrap">
    <button @click.prevent="createItem">Create</button>
  </div>
</template>

<script>
import ItemService from "@/services/api/Items";
import AuthService from "@/services/api/Auth";

export default {
  name: "ItemForm",
  methods: {
    createItem() {
      // Try to create new item
      ItemService.createItem(this.accessToken).then(data => {
        if (data !== false) {
          // Created!
          console.log(data);
        } else {
          // Access token invalid, refresh the tokens
          AuthService.refreshToken(this.refreshToken).then(data => {
            if (data !== false) {
              // Store new tokens
              console.log('Trying again with refreshed tokens.')
              this.$store.dispatch("storeAccessToken", data.access_token);
              this.$store.dispatch("storeRefreshToken", data.refresh_token);
              this.createItem();
            } else {
              // Token refresh failed, log out user
              alert("Something went wrong, ending user session.");
              this.$store.dispatch("userLogOut");
            }
          });
        }
      });
    }
  },
  computed: {
    accessToken() {
      return this.$store.getters.accessToken;
    },
    refreshToken() {
      return this.$store.getters.refreshToken;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
