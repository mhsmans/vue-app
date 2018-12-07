<template>
  <div>
    <div class="item-form-wrap">
      <h2>Create a new item.</h2>
      <form id="itemForm" @keydown.enter="create">
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
          <div class="upload-wrap">
            <label for="file-upload" class="custom-file-upload">Upload image</label>
            <input
              type="file"
              ref="file"
              accept="image/*"
              id="file-upload"
              class="form-image"
              v-bind:class="[errors.hasImageError ? 'error' : 'no-error']"
              v-on:change="handleImageUpload()"
            >
            <font-awesome-icon
              v-if="itemData.image !== null"
              size="2x"
              class="check-icon"
              icon="check"
            />
          </div>
        </div>
        <div class="form-step">
          <label for="pdf-upload" class="label">PDF:</label>
          <hr>
          <p class="error-message" v-if="errors.hasPdfError">PDF is required.</p>
          <div class="upload-wrap">
            <label for="pdf-upload" class="custom-file-upload">Upload PDF</label>
            <input
              type="file"
              ref="pdf"
              accept="application/pdf"
              id="pdf-upload"
              class="form-pdf"
              v-bind:class="[errors.hasPdfError ? 'error' : 'no-error']"
              v-on:change="handlePdfUpload()"
            >
            <font-awesome-icon
              v-if="itemData.pdf !== null"
              size="2x"
              class="check-icon"
              icon="check"
            />
          </div>
        </div>
        <div class="form-step">
          <div v-if="taxonomyTermQuery">
            <label for="category" class="label">Item category:</label>
            <hr>
            <p class="error-message" v-if="errors.hasCategoryError">Category is required.</p>
            <div class="upload-wrap">
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
              <font-awesome-icon
                v-if="itemData.category !== ''"
                size="2x"
                class="check-icon"
                icon="check"
              />
            </div>
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
          <p>The item will be added to the items list.</p>
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
        createdImageId: null,
        pdf: null,
        pdfName: null,
        base64Pdf: null,
        createdPdfId: null
      },
      errors: {
        hasTitleError: false,
        hasBodyError: false,
        hasImageError: false,
        hasPdfError: false,
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
        ItemService.convert(this.itemData.image)
          .then(data => {
            if (data !== false) {
              // Success, store image.
              this.itemData.base64Image = btoa(data);
            } else {
              // Let user know if image conversion has failed.
              alert("Image conversion failed.");
              throw new Error("Image conversion failed.");
            }
          })
          .then(() => {
            ItemService.convert(this.itemData.pdf).then(data => {
              if (data !== false) {
                this.itemData.base64Pdf = btoa(data);
              } else {
                alert("Pdf conversion failed");
                throw new Error("Pdf conversion failed.");
              }
            });
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
            // Create pdf and store pdf ID for referencing.
            return ItemService.createPdf(this.itemData, this.accessToken).then(
              data => {
                if (data !== false) {
                  // Success, store pdf ID.
                  this.itemData.createdPdfId = data;
                } else {
                  // Trhow error when failing.
                  throw new Error("Pdf creation failed.");
                }
              }
            );
          })
          .then(() => {
            // Create item.
            return ItemService.createItem(this.itemData, this.accessToken).then(
              data => {
                if (data !== false) {
                  // Success
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
    handleImageUpload() {
      this.itemData.image = this.$refs.file.files[0];
      this.itemData.imageName = this.$refs.file.files[0].name;
    },

    // Store uploaded file in data.
    handlePdfUpload() {
      this.itemData.pdf = this.$refs.pdf.files[0];
      this.itemData.pdfName = this.$refs.pdf.files[0].name;
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

      if (!this.itemData.pdf) {
        this.errors.hasPdfError = true;
      } else {
        this.errors.hasPdfError = false;
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
        this.errors.hasPdfError === false &&
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

.upload-wrap {
  display: inline-flex;
  height: fit-content;
}

.check-icon {
  color: $color-success;
  margin-left: 10px;
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

  > h2 {
    margin: 20px 0 20px 0;
    color: $color-success;
  }
}

.modal-button-wrap {
  display: flex;
  justify-content: flex-end;

  > button {
    margin-top: 20px;
  }
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
  font-size: 1.1em;
  font-weight: 700;
  height: fit-content;
}

.form-image{
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
  font-weight: 500;
  color: $color-font-light;
  padding: 5px;
  height: fit-content;
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
