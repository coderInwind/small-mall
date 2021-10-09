<template>
    <!--<h2>首页</h2>-->
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><slot slot="center">美丽商城</slot></nav-bar>

    <tab-control
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      v-show="isTabFixed"
      class="tab-control"
    />
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore"
            >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"
      />
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      />
      <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backClick" v-if="isShowBackTop"/>
  </div>
</template>

<script>

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import {getHomeMultidata, getHomeGoods} from "network/home"
  import {debounce} from 'common/utils'
  import {itemListenerMixin} from "common/mixin";


  export default {
        name: "home",
     components: {
       HomeSwiper,
       RecommendView,
       FeatureView,
       NavBar,
       TabControl,
       GoodsList,
       Scroll,
       BackTop
     },
    mixins: [itemListenerMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
        itemImgListener: null
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      this.getHomeMultidata()
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    destroyed() {
      console.log('home destroyed');
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
     this.saveY = this.$refs.scroll.getScrollY()

      //取消全局事件的监听
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    },
    mounted() {
      // //监听item中图片加载完成
      // this.$bus.$on('itemImageLoad', () => {
      //   // console.log('---------------')
      //   this.$refs.scroll && this.$refs.scroll.refresh()
      // })

      // const refresh = debounce(this.$refs.scroll.refresh, 50)
      // this.itemImgListener = () => {refresh()}
      // this.$bus.$on('itemImageLoad',this.itemImgListener)
      //获取tabControl的offsetTop
      //所有组件都有一个属性$el 用于获取组件中的元素


    },
    methods: {
      /**
       * 事件监听
       */

       tabClick(index) {
        switch(index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
        // console.log(this.$refs.tabControl1.currentIndex)
        // console.log(this.$refs.tabControl2.currentIndex)
      },
      /**
       * 网络请求
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // console.log(res)
          //     this.result = res
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          //解决无法上拉的问题 重新刷新图片

          this.$refs.scroll.finishPullUp()
        })
      },
      backClick() {

        this.$refs.scroll.scrollTo(0, 0)
      },
      contentScroll(position) {
        //判断是否显示backtop
        this.isShowBackTop = (-position.y) > 1000

        //判断tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      //事件监听相关
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
       this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      }
    }
    }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background: var(--color-tint);
    color: #fff;

    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
    /*因为使用了bscroll 不用使用脱标,会在规定的区域滚动*/
  }

  /*.tab-control {*/
    /*失效了*/
    /*position: sticky;*/
    /*top: 44px;*/
    /*z-index: 9;*/
  /*}*/

  .content {
    position: absolute;
    overflow: hidden;

    top:44px;
    bottom: 49px;
    left:0;
    right:0;
  }
  /*.content {*/
    /*height: calc(100% - 93px);*/
    /*overflow: hidden;*/
    /*margin-top: 44px;*/
  /*}*/

  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
