<template>
  <div>
    <div class="item-form-wrap">
      <h2>Create a new item.</h2>
      <form id="itemForm">
        <div class="form-step">
          <label for="title" class="label">Item title:</label>
          <hr>
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
          <label for="body" class="label">Item body:</label>
          <hr>
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
          <label for="file-upload" class="label">Image:</label>
          <hr>
          <p class="error-message" v-if="errors.hasImageError">Image is required.</p>
          <label for="file-upload" class="custom-file-upload">Upload image...</label>
          <input
            type="file"
            ref="file"
            accept="image/*"
            id="file-upload"
            class="form-image"
            v-bind:class="[errors.hasImageError ? 'error' : 'no-error']"
            v-on:change="handleFileUpload()"
          >
        </div>
        <div class="form-step">
          <div v-if="taxonomyTermQuery">
            <label for="category" class="label">Item category:</label>
            <hr>
            <p class="error-message" v-if="errors.hasCategoryError">Category is required.</p>
            <select
              id="category"
              class="category-select"
              v-model="itemData.category"
              v-bind:class="[errors.hasCategoryError ? 'error' : 'no-error']"
            >
              <option disabled value>Select category</option>
              <option
                v-for="category in taxonomyTermQuery.entities"
                v-bind:value="category.tid"
                :key="category.tid"
              >{{ category.name }}</option>
            </select>
          </div>
        </div>
        <div class="create-button">
          <button class="button" @click.prevent="create">Create</button>
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
        category: "",
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
        hasImageError: false,
        hasCategoryError: false
      },
      itemCreated: false,
      // Used to refresh tokens
      refreshExecuted: false
    };
  },
  methods: {
    create() {
      if (this.checkForm()) {
        // Convert image and store base64 image.
        ItemService.convertImage(this.itemData.image)
          .then(data => {
            if (data !== false) {
              // Success, store image.
              this.itemData.base64Image = btoa(data);
            } else {
              // Let user know if image conversion has failed.
              alert("Image conversion failed.");
              throw new Error("File conversion failed.");
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
                // Trhow error when failing.
                throw new Error("Image creation failed.");
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
                  // Throw error when failing.
                  throw new Error("Item creation failed.");
                }
              }
            );
          })
          .catch(err => {
            if (this.refreshExecuted === false) {
              // Could go wrong because of invalid tokens. Try to refresh them once.
              console.log("Trying again with refreshed tokens.");
              AuthService.refreshTokens(this.refreshToken).then(() => {
                this.refreshExecuted = true;
                // Retry method.
                this.create();
              });
            } else {
              console.log(err);
            }
          });
      }
    },
    // Store uploaded file in data.
    handleFileUpload() {
      this.itemData.image = this.$refs.file.files[0];
      this.itemData.imageName = this.$refs.file.files[0].name;
      this.imageCheck();
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

      if (this.itemData.category === "") {
        this.errors.hasCategoryError = true;
      } else {
        this.errors.hasCategoryError = false;
      }

      if (
        this.errors.hasTitleError === false &&
        this.errors.hasBodyError === false &&
        this.errors.hasImageError === false &&
        this.errors.hasCategoryError === false
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
.item-form-wrap {
  @include shadow;

  > h2 {
    color: $color-primary;
  }
}

.create-button {
  display: flex;
  justify-content: flex-end;
}

.label {
  color: $color-primary;
  font-size: 1.2em;
  font-weight: 700;
}

hr {
  margin: 5px 0 20px 0;
  color: $color-font;
  background-color: $color-font;
  font-size: 0;
  border: 0;
  height: 2px;
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

input[type="file"] {
  display: none;
}

.custom-file-upload {
  padding: 5px;
  background-color: $color-white;
  border: 2px solid $color-font-light;
  color: $color-font-light;
  display: inline-block;
  cursor: pointer;
  font-size: 1.2em;
}

.form-image {
  font-size: 1em;
  padding: 5px;
}

.form-textarea {
  resize: none;
  font-size: 1.4em;
  padding: 10px;
  width: 600px;
}

.category-select {
  border: 2px solid $color-font-light;
  background-color: $color-white;
  font-size: 1.1em;
  color: $color-font-light;
  padding: 5px;
}

select {
  /* for Firefox */
  -moz-appearance: none;
  /* for Chrome */
  -webkit-appearance: none;
}

/* For IE10 */
select::-ms-expand {
  display: none;
}

.item-form-wrap {
  background-color: $color-white;
  padding: 25px;
  width: fit-content;
  margin: auto;
  text-align: left;

  > h2 {
    text-align: center;
    margin: 0 0 40px 0;
  }
}
</style>
