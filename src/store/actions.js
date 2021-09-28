const actions ={
  addCart(context, payload) {
    // let oldProduct = null;
    // for(let item of state.cartList) {
    //   if(item.iid === payLoad.iid) {
    //     oldProduct = item;
    //   }
    // }
    //判断数组中是否有商品

    return new Promise((resolve, reject) => {
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      if(oldProduct) {
        context.commit('addCounter', oldProduct)
        resolve('当前商品数量+1')
      }else {
        payload.count = 1
        //context.state.cartList.push(payload)
        context.commit('addToCart', payload)
        resolve('添加新商品')
      }
    })

  }
}

export default actions
