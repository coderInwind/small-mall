<template>
  <div id="detail">
    <detail-nav-bar
      class="detail-nav"
      @titleClick="titleClick"
      ref="nav"
    />

    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">

      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>

      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comments" :comment-info="commentInfo"/>
      <goods-list ref="recommends" :goods="recommends">/</goods-list>



    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>

    <back-top @click.native="backClick" v-if="isShowBackTop"/>
    <toast :message="message" :show="show"/>
  </div>


</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import GoodsList from 'components/content/goods/GoodsList'
  import DetailBottomBar from './childComps/DetailBottomBar'
  import BackTop from 'components/content/backTop/BackTop'

  import Scroll from 'components/common/scroll/Scroll'

  import {getDetail, Goods, Shop, GoodsParam,formatDate,getRecommend} from "../../network/detail";
  import {debounce} from 'common/utils'
  import {itemListenerMixin} from "common/mixin";

  import {mapActions} from 'vuex'
  import Toast from 'components/common/toast/Toast'

  export default {
        name: "detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      BackTop,
      Toast
    },
    mixins: [itemListenerMixin],
      data() {
          return {
            iid: null,
            topImages: [],
            goods: {},
            shop: {},
            detailInfo: {},
            paramInfo: {},
            commentInfo: {},
            recommends: [],
            itemImgListener: null,
            themeTopYs: [],
            getThemeTopYs: null,
            currentIndex: 0,
            isShowBackTop: false,
            message: '',
            show: false

          }
      },
      created() {
          //获取id
          this.iid = this.$route.params.iid
          //请求详情数据
        getDetail(this.iid).then(res => {
          //获取顶部图片

          const data = res.result
          this.topImages = data.itemInfo.topImages
          //获取商品信息
          this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

          //获取店铺信息
          this.shop =  new Shop(data.shopInfo)

          //详情信息
          this.detailInfo = data.detailInfo
          //参数信息
          this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

          //评论信息
          if (data.rate.cRate !== 0) {
            this.commentInfo = data.rate.list[0]
          }

        })
        //请求推荐数据
        getRecommend().then(res => {
         this.recommends = res.data.list
        })

        this.getThemeTopYs = debounce(() => {
          this.themeTopYs = []
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop )
          this.themeTopYs.push(this.$refs.comments.$el.offsetTop )
          this.themeTopYs.push(this.$refs.recommends.$el.offsetTop )
          this.themeTopYs.push(Number.MAX_VALUE)

          // console.log(this.themeTopYs)
        },100)


      },
    mounted() {
      // const refresh = debounce(this.$refs.scroll.refresh, 100)
      // this.itemImgListener = () => {refresh()}
      // this.$bus.$on('itemImageLoad',this.itemImgListener)

    },
    updated() {

    },
    destroyed() {
          this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
     methods: {
       ...mapActions(['addCart']),
         imageLoad() {
         // this.$refs.scroll.refresh()
           this.refresh()
           this.getThemeTopYs()

        },
       titleClick(index) {
         // console.log(index);
         this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
       },
       contentScroll(position) {
         const positionY = -position.y
           // [0, 11036, 11964, 12296, __ob__: Observer]
          let length = this.themeTopYs.length
         for(let i = 0; i< length - 1; i++) {

           // if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY >=  this.themeTopYs[i])))
           if(this.currentIndex !== i && (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]))
           {
             this.currentIndex = i
             // console.log(this.currentIndex)
             this.$refs.nav.currentIndex = this.currentIndex
             }
//由于条件判断麻烦, 为了解决最后一个越界, 给数组中push一个最大值,然后就
           //可以用简单的方法处理
         }


          //是否显示回到顶部
         this.isShowBackTop = (-position.y) > 1000
       },
       backClick() {
         this.$refs.scroll.scrollTo(0, 0)
       },
       addToCart() {
           1//获取购物车需要展示的信息
         const product = {}
         product.image = this.topImages[0]
         product.title = this.goods.title
         product.desc = this.goods.desc
         product.price = this.goods.realPrice
         product.iid = this.iid
         //2 将商品添加到购物车里
         // this.$store.commit('addCart', product)
         // this.$store.dispatch('addCart', product).then(res => {
         //   console.log(res)
         // })

         //配置了mapAction映射 可以直接调用
         this.addCart(product).then((res) => {
           this.show = true
           this.message = res

           setTimeout(() => {
             this.show = false
             this.message = ''
           },1500)
         })

       }
   }




  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .content {
    height: calc(100% - 44px - 49px);
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>
