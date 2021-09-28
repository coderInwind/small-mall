<template>
  <div class="goods">
    <goods-list-item v-for="item in goods" :goods-item="item"/>


  </div>
</template>

<script>
   import GoodsListItem from './GoodsListItem'

    export default {
        name: "goods-list",
        components: {
          GoodsListItem
        },
        props: {
            goods: {
              type: Array,
              default() {
              return []
            }
          }
      }
    }
</script>

<style scoped>
  .goods {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 2px;
  }
</style>
