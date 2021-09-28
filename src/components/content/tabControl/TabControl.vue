<!--//这个组件可以复用,在后面 因为后面的选项和这个一样,所以不用搞插槽,-->
<!--//更方便-->
<template>
    <div class="tab-control">
      <div v-for="(item, index) in titles"
           class="tab-control-item"
           :class="{active: index === currentIndex}"
           @click="itemClick(index)"
      >
        <span>{{item}}</span>
      </div>
    </div>
</template>

<script>
    export default {
        name: "tab-control",
      props: {
          titles: {
            type: Array,
            default() {
              return []
            }
          }
      },
      data() {
          return {
            currentIndex: 0
          }
      },
      methods: {
          itemClick(index) {
            this.currentIndex = index
            this.$emit('tabClick', index)
            // console.log(index)
          },


      }
    }
</script>

<style scoped>
  .tab-control {
    display: flex;
    text-align: center;
    font-size: 15px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
  }
  .tab-control-item {
    flex: 1;

  }
  .active {
    color: var(--color-high-text);
  }
  .active span {
    border-bottom: 3px solid var(--color-tint)
  }


</style>
