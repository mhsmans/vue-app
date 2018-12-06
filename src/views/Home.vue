<template>
  <div class="home">
    <items-list />
  </div>
</template>

<script>
// @ is an alias to /src
import ItemsList from '@/components/ItemsList.vue'

export default {
  name: 'home',
  components: {
    ItemsList
  }
}
</script>

<style lang="scss" scoped>

</style>

