<template>
  <div class="category">
    <nav-bar class="category-nav">
      <slot slot="center">分类</slot>
    </nav-bar>
    <tab-control :titles="['特惠', '热销', '爆款']"
                 @tabClick="tabClick"
    ></tab-control>

    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore"
    >
      <goods-list :goods="showGoods"/>

    </scroll>
    <back-top @click.native="backClick" v-if="isShowBackTop"/>

  </div>

</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import {getHomeGoods} from "../../network/home";

  export default {
        name: "category",
      components: {
        NavBar,
        TabControl,
        GoodsList,
        Scroll,
        BackTop
      },
      data() {
          return {
            goods: {
              'sell': {page: 0, list: []},
              'new': {page: 0, list: []},
              'pop': {page: 0, list: []},
            },
            currentType: 'new',
            isShowBackTop: false,
          }
      },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
      created() {
          this.getHomeGoods('sell')
          this.getHomeGoods('pop')
          this.getHomeGoods('new')

      },
      methods: {
        getHomeGoods(type) {
          const page = this.goods[type].page + 1
          getHomeGoods(type, page).then(res => {
            this.goods[type].list.push(...res.data.list)
            this.goods[type].page ++

            this.$refs.scroll.finishPullUp()
            // console.log(this.goods['pop'].list)
            this.$refs.scroll.refresh()
          })
        },
        tabClick(index) {
          switch(index) {
            case 0:
              this.currentType = 'sell'
              break
            case 1:
              this.currentType = 'new'
              break
            case 2:
              this.currentType = 'pop'
              break
          }

        },
        backClick() {
          this.$refs.scroll.scrollTo(0, 0, 500)
        },

        contentScroll(position) {
          this.isShowBackTop = (-position.y) > 1000
        },
        loadMore() {
          this.getHomeGoods(this.currentType)
        }
      }
    }
</script>

<style scoped>
  .category {
    height: 100vh;
    position: relative;
  }
  .category-nav {
    background: var(--color-tint);
    color: #fff;
  }
  .content {
    position: absolute;
    overflow: hidden;
    top: 89px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>
