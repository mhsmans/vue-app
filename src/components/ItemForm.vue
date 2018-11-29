<template>
  <div>
    <div class="item-form-wrap">
      <form id="itemForm">
        <div class="form-step">
          <p class="error-message" v-if="errors.hasTitleError">Title is required.</p>
          <input
            type="text"
            id="title"
            placeholder="Title"
            class="form-input"
            v-bind:class="[errors.hasTitleError ? 'error' : 'no-error']"
            v-model="itemData.title"
          >
        </div>
        <div class="form-step">
          <p class="error-message" v-if="errors.hasBodyError">Body is required.</p>
          <textarea
            type="text"
            id="body"
            placeholder="Item body"
            class="form-textarea"
            v-bind:class="[errors.hasBodyError ? 'error' : 'no-error']"
            v-model="itemData.body"
            rows="10"
          />
        </div>
        <!-- <div class="form-step">
        <div v-if="taxonomyTermQuery">
          <select id="category-select">
            <option
              v-for="category in taxonomyTermQuery.entities"
              :key="category.name"
            >{{ category.name }}</option>
          </select>
        </div>
        </div>-->
        <div class="create-button">
          <button class="button" @click.prevent="createItem">Create</button>
        </div>
      </form>
    </div>

    <div v-if="itemCreated" class="modal-mask">
      <div class="wrap">
        <font-awesome-icon size="3x" @click.prevent="closeModal" class="icon" icon="times"/>
        <div class="modal-content">
          <h2>Item created!</h2>
          <div class="modal-button-wrap">
            <button class="close-button" @click.prevent="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ItemService from "@/services/api/Items";
import AuthService from "@/services/api/Auth";
import { CATEGORIES_QUERY } from "@/services/graphql/Graphql";

export default {
  name: "ItemForm",
  data() {
    return {
      itemData: {
        category: null,
        body: null,
        title: null
      },
      errors: {
        hasTitleError: false,
        hasBodyError: false
      },
      itemCreated: false
    };
  },
  methods: {
    createItem() {
      if (this.checkForm()) {
        // Try to create new item
        ItemService.createItem(this.itemData, this.accessToken).then(data => {
          if (data !== false) {
            // Created!
            this.$store.dispatch("storeCreatedItem", data);
            this.itemCreated = true;
            console.log(data);
          } else {
            // Access token invalid, refresh the tokens
            AuthService.refreshToken(this.refreshToken).then(data => {
              if (data !== false) {
                // Store new tokens
                console.log("Trying again with refreshed tokens.");
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
    closeModal() {
      this.itemCreated = false;
      this.$router.push({ name: "home" });
    },
    checkForm() {
      if (!this.itemData.title) {
        this.errors.hasTitleError = true;
      } else {
        this.errors.hasTitleError = false;
      }

      if (!this.itemData.body) {
        this.errors.hasBodyError = true;
      } else {
        this.errors.hasBodyError = false;
      }

      if (
        this.errors.hasTitleError === false &&
        this.errors.hasBodyError === false
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  computed: {
    accessToken() {
      return this.$store.getters.accessToken;
    },
    refreshToken() {
      return this.$store.getters.refreshToken;
    }
  },
  apollo: {
    taxonomyTermQuery: {
      query: CATEGORIES_QUERY,
      prefetch: true
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.create-button {
  display: flex;
  justify-content: flex-end;
}

.modal-content {
  background-color: $color-white;
  padding: 25px;
  min-width: 350px;

  h2 {
    margin: 20px 0 40px 0;
  }
}

.modal-button-wrap {
  display: flex;
  justify-content: flex-end;
}

input {
  font-size: 1.3em;
  padding: 10px;
  min-width: 350px;
}

.form-textarea {
  resize: none;
  font-size: 1.3em;
  padding: 10px;
  width: 600px;
}

.item-form-wrap {
  background-color: $color-white;
  padding: 25px;
  width: fit-content;
  margin: auto;
  text-align: left;
}
</style>
