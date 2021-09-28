<template>
    <div class="bottom-bar">
      <div class="check-content" >
        <check-button
          :is-checked="isSelectAll"
          class="check-button"
        @click.native="checkClick"/>
        <span>全选</span>
      </div>

      <div class="price">
        合计:{{totalPrice}}
      </div>

      <div class="calculate">
        去结算:{{checkLength}}
      </div>
    </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton'
    export default {
        name: "cart-bottom-bar",
      components: {
        CheckButton
      },
      methods: {
          checkClick() {
            if(this.isSelectAll) {
              this.$store.state.cartList.forEach(item => item.checked = false)
            }
              else {
                this.$store.state.cartList.forEach(item => item.checked = true)
              }

          }
      },

      computed: {
        totalPrice() {
          return '￥' + this.$store.state.cartList.filter(item => item.checked).reduce((preValue, item) => {
            return preValue + item.count * item.price
          }, 0).toFixed(2)

        },
        checkLength() {
          return this.$store.state.cartList.filter(item => item.checked).length
        },
        isSelectAll() {
          if (this.$store.state.cartList.length === 0 )  return false


          // return !(this.$store.state.cartList.filter(item =>
          //   !item.checked).length)

          for (let item of this.$store.state.cartList) {
            if(!item.checked){
              return false
            }
          }
          return true

          }

        }

    }
</script>

<style scoped>
   .bottom-bar {
     display: flex;
     position: relative;

     height: 40px;
     line-height: 40px;

     background-color: #eee;
     font-size: 14px;
   }
   .check-content {
     display: flex;
     align-items: center;
     margin-left: 10px;
     width: 60px;
   }
  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .price {
    margin-left:10px;
    flex: 1;
  }
   .calculate {
     width: 90px;
     text-align: center;
     background-color: red;
     color: #Fff
   }
</style>
