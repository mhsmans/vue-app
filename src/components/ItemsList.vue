<template>
  <div>
    <!-- Display items that are created during this session -->
    <div class="user-created-data" v-if="createdItems.length > 0">
      <div v-for="item in createdItems" :key="item.nid[0].value">
        <div class="item">
          <div class="title">
            <h3>{{ item.title[0].value }}</h3>
          </div>
          <div class="wrap">
            <div class="body" v-if="item.body">
              <p>{{ item.body[0].value }}</p>
            </div>
            <!-- This image is invisible before page refresh. This is caused by the image url.. -->
            <div class="image" v-if="item.img">
              <img :src="item.img[0].url" alt>
            </div>
          </div>
          <div class="category" v-if="item.category">
            <div v-for="category in item.category" :key="category.name">{{ category.entity.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Displaying items fetched from drupal site -->
    <div class="graphql-data" v-if="nodeQuery">
      <div v-for="item in nodeQuery.entities" :key="item.nid">
        <div class="item">
          <div class="title">
            <h3>{{ item.title }}</h3>
          </div>
          <div class="wrap">
            <div class="body" v-if="item.body">
              <p>{{ item.body.value }}</p>
            </div>
            <div class="image" v-if="item.img">
              <img :src="item.img.url" alt>
            </div>
          </div>
          <div class="category" v-if="item.category">
            <div v-for="category in item.category" :key="category.name">{{ category.entity.name }}</div>
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
    createdItems() {
      return this.$store.getters.createdItems;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.item {
  display: grid;
  grid-template-rows: auto;
  margin-top: 20px;
}

.wrap {
  display: grid;
  grid-template-columns: 2fr 1fr;
  column-gap: 20px;
  padding: 20px;
}

.body {
  overflow: scroll;
  height: 300px;
}

.image {
  img {
    object-fit: cover;
    max-height: 300px;
    min-width: 100%;
    vertical-align: bottom;
  }
}

.category {
  padding: 20px;
}
</style>
