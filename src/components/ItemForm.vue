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
        <div class="form-step">
          <p class="error-message" v-if="errors.hasImageError">Image is required.</p>
          <input
            type="file"
            ref="file"
            accept="image/*"
            id="image"
            class="form-image"
            v-bind:class="[errors.hasImageError ? 'error' : 'no-error']"
            v-on:change="handleFileUpload()"
          >
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
          <button class="button" @click.prevent="test">Create</button>
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
import { CATEGORIES_QUERY } from "@/services/graphql/Graphql";

export default {
  name: "ItemForm",
  data() {
    return {
      itemData: {
        category: null,
        body: null,
        title: null,
        image: null,
        imageName: null,
        base64Image: null,
        createdImageId: null
      },
      errors: {
        hasTitleError: false,
        hasBodyError: false,
        hasImageError: false
      },
      itemCreated: false,
      // Used to refresh tokens only once
      refreshExecuted: false
    };
  },
  methods: {
    // TOKEN REFRESH NOT WORKING YET
    test() {
      if (this.checkForm()) {
        // Convert image and store base64 image.
        ItemService.convertImage(this.itemData.image)
          .then(data => {
            if (data !== false) {
              // Success, store image.
              this.itemData.base64Image = btoa(data);
            } else {
              console.log("File conversion failed.");
            }
          })
          .then(() => {
            // Create image and store image ID for referencing.
            return ItemService.createImage(
              this.itemData,
              this.accessToken
            ).then(data => {
              if (data !== false) {
                // Success, store image ID.
                this.itemData.createdImageId = data;
              } else {
                console.log("Image creation failed.");
                // if (this.refreshExecuted === false) {
                //   // Could go wrong because of invalid tokens. Try to refresh them once.
                //   console.log("Trying again with refreshed tokens.");
                //   AuthService.refreshTokens(this.refreshToken).then(() => {
                //     this.refreshExecuted = true;
                //   });
                // }
              }
            });
          })
          .then(() => {
            // Create item.
            return ItemService.createItem(this.itemData, this.accessToken).then(
              data => {
                if (data !== false) {
                  // Success
                  this.$store.dispatch("storeCreatedItem", data);
                  this.itemCreated = true;
                } else {
                  console.log("Item creation failed.");
                  // if (this.refreshExecuted === false) {
                  //   // Could go wrong because of invalid tokens. Try to refresh them once.
                  //   console.log("Trying again with refreshed tokens.");
                  //   AuthService.refreshTokens(this.refreshToken).then(() => {
                  //     this.refreshExecuted = true;
                  //   });
                  // }
                }
              }
            );
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // Store uploaded file in data.
    handleFileUpload() {
      this.itemData.image = this.$refs.file.files[0];
      this.itemData.imageName = this.$refs.file.files[0].name;
    },
    // Close modal window.
    closeModal() {
      this.itemCreated = false;
      this.$router.push({ name: "home" });
    },
    // Validate form.
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

      if (!this.itemData.image) {
        this.errors.hasImageError = true;
      } else {
        this.errors.hasImageError = false;
      }

      if (
        this.errors.hasTitleError === false &&
        this.errors.hasBodyError === false &&
        this.errors.hasImageError === false
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
