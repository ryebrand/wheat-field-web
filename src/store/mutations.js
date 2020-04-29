import {
  INIT_BUYCART,
  ADD_CART,
  GET_USERINFO,
  RECORD_USERINFO,
  ADD_ANIMATION,
  SHOW_CART,
  REDUCE_CART,
  EDIT_CART
} from './mutation-types'
import { setStore, getStore } from '../utils/storage'
export default {
  // 网页初始化时从本地缓存获取购物车数据
  [INIT_BUYCART] (state) {
    let initCart = getStore('buyCart')
    if (initCart) {
      state.cartList = JSON.parse(initCart)
    }
  },
  // 加入购物车
  [ADD_CART] (state, {itemId, salePrice, productName, productImg, amount = 1}) {
    console.log(state, itemId, salePrice, productName, productImg);
    let cart = state.cartList // 购物车
    let falg = true
    let goods = {
      // itemId,
      // salePrice,
      // productName,
      // productImg
      itemId: itemId,
      amount: amount,
      id: itemId,
      imgUrl: productImg,
      title: productName,
      price: salePrice
    }
    if (cart.length > 0) {        // 有内容
      cart.forEach(item => {
        if (item.itemId === itemId) {
          if (item.amount >= 0) {
            falg = false
            item.amount += amount
          }
        }
      })
    }
    if (!cart.length || falg) {
      goods.amount = amount
      goods.checked = '1'
      cart.push(goods)
    }
    state.cartList = cart
    // 存入localStorage
    setStore('buyCart', cart)
  },
  // 加入购物车动画
  [ADD_ANIMATION] (state, {moveShow, elLeft, elTop, img, cartPositionT, cartPositionL, receiveInCart}) {
    state.showMoveImg = moveShow
    if (elLeft) {
      state.elLeft = elLeft
      state.elTop = elTop
    }
    state.moveImgUrl = img
    state.receiveInCart = receiveInCart
    if (cartPositionT) {
      state.cartPositionT = cartPositionT
      state.cartPositionL = cartPositionL
    }
  },
  // 是否显示购物车
  [SHOW_CART] (state, {showCart}) {
    // let timer = null
    state.showCart = showCart
    // clearTimeout(timer)
    // if (showCart) {
    //   timer = setTimeout(() => {
    //     state.showCart = false
    //   }, 5000)
    // }
  },
  // 移除商品
  [REDUCE_CART] (state, {itemId}) {
    let cart = state.cartList
    cart.forEach((item, i) => {
      if (item.itemId === itemId) {
        if (item.amount > 1) {
          item.amount--
        } else {
          cart.splice(i, 1)
        }
      }
    })
    state.cartList = cart
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
  // 修改购物车
  [EDIT_CART] (state, {itemId, amount, checked}) {
    let cart = state.cartList
    if (amount) {
      cart.forEach((item, i) => {
        if (item.itemId === itemId) {
          item.amount = amount
          item.checked = checked
        }
      })
    } else if (itemId) {
      cart.forEach((item, i) => {
        if (item.itemId === itemId) {
          cart.splice(i, 1)
        }
      })
    } else {
      cart.forEach((item) => {
        item.checked = checked ? '1' : '0'
      })
    }
    state.cartList = cart
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
  // 记录用户信息
  [RECORD_USERINFO] (state, info) {
    state.userInfo = info
    state.login = true
    setStore('userInfo', info)
  },
  // 获取用户信息
  [GET_USERINFO] (state, info) {
    if (state.userInfo && (state.userInfo.username !== info.username)) {
      return
    }
    if (!state.login) {
      return
    }
    if (!info.message) {
      state.userInfo = {...info}
    } else {
      state.userInfo = null
    }
  }
}
