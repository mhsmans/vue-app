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
              <div id="bottom-fade"></div>
            </div>
            <div class="category" v-if="item.category">
              <div v-for="category in item.category" :key="category.name" class="category-item">
                <p>{{ category.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="loading">Loading...</p>
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

.item {
  display: grid;
  grid-template-rows: auto;
  border: 2px solid $color-primary;
  background-color: $color-white;
  padding: 20px;

  p {
    font-size: 1.2em;
  }
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
  overflow: hidden;
  height: 300px;
  position: relative;

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

.category {
  margin-top: 20px;
  text-align: left;
}

.category-item {
  > p {
    margin: 5px;
    color: $color-primary;
    font-style: italic;
    font-size: 1.2em;
    font-weight: 700;
  }
}

</style>
