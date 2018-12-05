<template>
  <div>
    <!-- Display items that are created during this session -->
    <!-- <div class="user-created-data" v-if="createdItems.length > 0">
      <div v-for="item in createdItems" :key="item.nid[0].value">
        <div class="item">
          <div class="title">
            <h3>{{ item.title[0].value }}</h3>
          </div>
          <div class="wrap">
            <div class="body" v-if="item.body">
              <p>{{ item.body[0].value }}</p>
    </div>-->
    <!-- This image is invisible before page refresh. This is caused by the image url.. -->
    <!-- <div class="image" v-if="item.img">
              <img :src="item.img[0].url" alt>
            </div>
          </div>
          <div class="category" v-if="item.category">
            <div v-for="category in item.category" :key="category.name">{{ category.entity.name }}</div>
          </div>
        </div>
      </div>
    </div>-->
    <!-- Displaying items fetched from drupal site -->
    <div class="graphql-data" v-if="nodeQuery">
      <div v-for="item in nodeQuery.entities" :key="item.nid">
        <div class="item">
          <div class="title">
            <h2>{{ item.title }}</h2>
          </div>
          <div class="wrap">
            <div class="image" v-if="item.img">
              <img :src="item.img.url" alt>
            </div>
            <div class="body" v-if="item.body">
              <p>{{ item.body.value }}</p>
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
                <font-awesome-icon size="3x" class="pdf-icon" icon="file-pdf"/>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ITEMS_QUERY } from "@/services/graphql/Graphql";

export default {
  name: "ItemsList",
  data() {
    return {};
  },
  apollo: {
    nodeQuery: {
      query: ITEMS_QUERY,
      prefetch: true
    }
  },
  computed: {
    // Used to get created items during this user session. These items can be added above fetched item list.
    createdItems() {
      return this.$store.getters.createdItems;
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
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 4;
  text-align: right;
  position: relative;
}

.pdf-icon {
  color: $color-error;
  position: absolute;
  bottom: 0;
  right: 0;
  transition: all 0.1s ease;

  &.pdf-icon:hover {
    transform: scale(1.1)
  }
}

.item {
  display: grid;
  grid-template-rows: auto;
  background-color: $color-white;
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
  grid-template-columns: 1fr 2fr;
  grid-template-rows: auto;
  column-gap: 20px;
  padding: 20px;
  text-align: left;
}

.body {
  height: 300px;
  overflow: hidden;
  position: relative;
  grid-row-start: 1;
  grid-row-end: 4;
  grid-column-start: 2;
  grid-column-end: 3;

  > p {
    margin-top: 0;
  }
}

.body:before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(transparent 150px, white);
}

.image {
  > img {
    object-fit: cover;
    height: 300px;
    width: 100%;
    vertical-align: bottom;
  }
}

.owner {
  color: $color-primary;
  font-style: italic;
  font-size: 1em;
  font-weight: 700;
  margin-top: 10px;

  > p {
    margin: 0;
  }
}

.category {
  margin-top: 10px;
  text-align: left;
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 2;
  grid-row-end: 3;
}

.category {
  > p {
    color: $color-primary;
    margin: 0;
    font-style: italic;
    font-size: 1.2em;
    font-weight: 700;
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
