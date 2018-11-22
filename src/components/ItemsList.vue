<template>
  <div>
    <p class="loading" v-if='loading'>Loading...</p>
    
  </div>
</template>

<script>
import ItemsApi from "@/services/api/Items";
import { ITEMS_QUERY } from '@/services/graphql/Graphql'

export default {
  name: "ItemsList",
  data() {
    return {
      loading: true,
      items: []
    };
  },
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
</style>
