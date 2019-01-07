<template>
  <div>
    <!-- When query is loading -->
    <div v-if="$apollo.loading">
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>

    <!-- Item list -->
    <transition name="fade">
      <div class="graphql-data" v-if="items.length > 0">
        <div v-for="item in items" :key="item.nid">
          <div class="item">
            <div class="title">
              <h2>{{ item.title }}</h2>
            </div>
            <div class="wrap">
              <div class="image" v-if="item.img">
                <img :src="item.img.url" alt>
              </div>
              <div class="body" v-if="item.body">
                <p style="white-space: pre-line">{{ item.body.value }}</p>
                <button @click="revealBody(item)" class="reveal-button">Read more</button>
              </div>
              <div class="category" v-if="item.category">
                <p>
                  <span style="font-style: normal">Category -</span>
                  {{ item.category.entity.name }}
                </p>
              </div>
              <div class="owner">
                <p>
                  <span style="font-style: normal">Owner -</span>
                  {{ item.entityOwner.name }}
                </p>
              </div>
              <div class="pdf" v-if="item.file">
                <a :href="item.file.entity.url">
                  <font-awesome-icon size="2x" class="pdf-icon" icon="file-pdf"/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- When there is no content available -->
      <div v-else-if="items.length === 0 && $apollo.loading === false">
        <h2>No content available.</h2>
      </div>
    </transition>

    <!-- Item detail view -->
    <transition name="fade" mode="in-out">
      <div v-if="selectedItem" class="modal-mask">
        <div class="container">
          <div class="detail-wrap">
            <font-awesome-icon @click="close" size="2x" class="icon" icon="arrow-left"/>
            <div class="detail-title">
              <h2>{{ selectedItem.title }}</h2>
            </div>
            <div class="detail-body-wrap">
              <div class="detail-body">
                <p style="white-space: pre-line">{{ selectedItem.body.value }}</p>
              </div>
            </div>
            <div class="detail-button">
              <Button class="close-button" @click="close">Close</Button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ITEMS_QUERY } from "@/services/graphql/Graphql";

export default {
  name: "ItemsList",
  data() {
    return {
      selectedItem: null
    };
  },
  apollo: {
    nodeQuery: {
      query: ITEMS_QUERY,
      // Interval for updating data from back-end. Can be near real-time.
      pollInterval: 30000
    }
  },
  computed: {
    items() {
      const itemArray = [];
      // Check if data from Drupal back-end is present.
      if (this.nodeQuery) {
        this.nodeQuery.entities.forEach(element => {
          itemArray.push(element);
        });
      }
      return itemArray;
    }
  },
  methods: {
    revealBody(item) {
      this.selectedItem = item;
    },
    close() {
      this.selectedItem = null;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.graphql-data {
  display: grid;
  grid-template-rows: auto;
  row-gap: 20px;
}

.pdf {
  text-align: right;
  position: relative;
  grid-row-start: 4;
  grid-row-end: 5;

  @include sm {
    grid-column-start: 2;
    grid-column-end: 3;
  }
}

.pdf-icon {
  color: $color-error;
  position: absolute;
  bottom: 0;
  right: 0;
  transition: all 0.1s ease;

  &.pdf-icon:hover {
    transform: scale(1.1);
  }
}

.item {
  display: grid;
  grid-template-rows: auto;
  background-color: $color-white;
  border-top: 5px solid $color-primary;
  padding: 20px;
  @include shadow;

  p {
    font-size: 1.2em;
  }
}

.title {
  color: $color-primary;
}

.wrap {
  display: grid;
  grid-template-rows: auto;
  column-gap: 20px;
  padding: 20px;
  text-align: left;
  grid-template-columns: 1fr;

  @include sm {
    grid-template-columns: 1fr 2fr;
  }
}

.body {
  height: 200px;
  overflow: hidden;
  position: relative;
  grid-row-start: 2;
  grid-row-end: 3;

  @include sm {
    grid-row-start: 1;
    grid-row-end: 4;
    grid-column-start: 2;
    grid-column-end: 3;
  }

  > p {
    margin-top: 0;
    font-size: 1.1em;
  }
}

.body:before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(transparent 50px, $color-white);
}

.detail-wrap {
  background-color: $color-white;
  padding: 20px;
  max-height: 80vh;
  overflow-y: scroll;
  overflow-x: hidden;
  opacity: 1;
  transition: all 0.2s ease;
  margin: 0;

  @include sm {
    margin: 0 50px 0 50px;
  }

  > .icon {
    color: $color-error;
    position: absolute;
    margin: 0;
    transition: all 0.1s ease;
  }

  > .icon:hover {
    transform: scale(1.2);
  }
}

.detail-wrap:before {
  opacity: 0;
}

.detail-body-wrap {
  padding: 25px 40px 25px 40px;
  text-align: left;
}

.detail-title {
  font-size: 1.2em;
  color: $color-primary;

  > h2 {
    margin-bottom: 0;
  }
}

.detail-body {
  font-size: 1.3em;
  color: $color-font-light;
}

.detail-button {
  margin-bottom: 20px;
}

.reveal-button {
  position: absolute;
  top: 160px;
  left: 50%;
  border: 2px solid $color-font-light;
  padding: 5px;
  background-color: transparent;
  color: $color-font-light;
  cursor: pointer;
  transform: translateX(-50%);
}

.image {
  grid-row-start: 1;
  grid-row-end: 2;
  margin-bottom: 10px;

  > img {
    object-fit: cover;
    height: 250px;
    width: 100%;
    vertical-align: bottom;

    @include sm {
      height: 200px;
    }
  }

  @include sm {
    margin-bottom: 0;
  }

}

.owner {
  color: $color-font-light;
  font-style: italic;
  font-weight: 700;
  margin-top: 10px;
  grid-row-start: 4;
  grid-row-end: 5;

  > p {
    margin: 0;
    font-size: 1.1em;
  }
}

.category {
  margin-top: 10px;
  text-align: left;
  grid-row-start: 3;
  grid-row-end: 4;

  @include sm {
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 2;
    grid-row-end: 3;
  }
}

.category {
  > p {
    color: $color-font-light;
    margin: 0;
    font-style: italic;
    font-weight: 700;
    font-size: 1.1em;
  }
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 51px;
  height: 51px;
  margin: 6px;
  border: 6px solid $color-primary;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: $color-primary transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
