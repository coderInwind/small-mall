<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

    export default {
        name: "scroll",
      props: {
          probeType: {
            type: Number,
            default: 0
          },
          pullUpLoad: {
            type: Boolean,
            default: false
          }

      },
      data() {
          return {
            scroll: null
          }
      },
      mounted() {
          this.scroll = new BScroll(this.$refs.wrapper, {
            click: true,
            probeType: this.probeType,
            pullUpLoad: this.pullUpLoad
          })
        //监听滚动位置
        if (this.probeType === 2 || this.probeType ===3) {
          this.scroll.on('scroll', (position) => {
            // console.log(position);
            this.$emit('scroll', position)
          })
        }
        //监听上拉事件
        if (this.pullUpLoad) {
            this.scroll.on('pullingUp', () => {
              this.$emit('pullingUp')
              // console.log('上拉');
            })
        }
      },
      methods: {
          scrollTo(x, y, time=300 ) {
            //防止没有值出现异常
            this.scroll && this.scroll.scrollTo(x, y, time)
          },
          refresh() {

            this.scroll && this.scroll.refresh()
          },
          finishPullUp() {
            this.scroll && this.scroll.finishPullUp()
          },
          getScrollY() {
            return this.scroll ? this.scroll.y : 0
          }
      }
    }
</script>

<style scoped>

</style>
