<template>
  <div>
    <div v-if="nodeQuery" >
      <div v-for="item in nodeQuery.entities" :key="item.title">
        <div class="item">
          <div class="title">
            <h3>{{ item.title }}</h3>
          </div>
          <div class="wrap">
            <div class="body">
              <p>{{ item.body.value }}</p>
            </div>
            <div class="image">
              <img :src='item.img.url' alt=''/>
            </div>
          </div>
        <!-- {{ item.file.entity.filename }}
        {{ item.file.entity.url }} -->
        <div class="category">
          <div v-for="category in item.category" :key="category.name">
            {{ category.entity.name }}
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
// import ItemsApi from "@/services/api/Items";
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
  }
  // created() {
  //   ItemsApi.getItems()
  //     .then(items => {
  //       console.log(items);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     })
  //     .finally(() => {
  //       this.loading = false;
  //     });
  // }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.item {
  display: grid;
  grid-template-rows: auto;
  border: 1px solid black;
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
  border: 1px solid black;
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
