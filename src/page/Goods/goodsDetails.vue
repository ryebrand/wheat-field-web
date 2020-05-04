<!--商品详情-->
<template>
  <div class="w store-content">
    <div class="gray-box">
      <div class="gallery-wrapper">
        <div class="gallery">
          <div class="thumbnail">
            <ul>
              <li v-for="(item,i) in small" :key="i" :class="{on:big===item}" @click="big=item">
                <img v-lazy="item" :alt="product.title">
              </li>
            </ul>
          </div>
          <div class="thumb">
            <div class="big">
              <img :src="big" :alt="product.title">
            </div>
          </div>
        </div>
      </div>
      <!--右边-->
      <div class="banner">
        <div class="sku-custom-title">
          <h4>{{product.title}}</h4>
          <h6>
            <span>{{product.description}}</span>
            <span class="price">
              <!-- <em>¥</em><i>{{product.salePrice.toFixed(2)}}</i></span> -->
              <del v-if="product.promoPrice" class="original">原价：￥{{product.promoPrice}}</del>
              <em>¥</em><i>{{product.price}}</i></span>
          </h6>
        </div>
        <div class="num">
         <div class="left">
           <span class="params-name">数量</span>
           <buy-num @edit-num="editNum" :limit="Number(product.limitNum)"></buy-num>
         </div>
          <div class="right" v-if="startTime && endTime">
            <countDown :serverTime="serverTime"
                       :endTime="endTime" :startTime="startTime" v-model="leftTime"></countDown>
            结束倒计时：{{leftTime | consumingTimeToMS}}
          </div>
        </div>
        <div class="buy">
          <y-button text="加入购物车"
                    v-if="this.$route.query.isPromo !== 'promo'"
                    @btnClick="addCart(product.itemId,product.price,product.title,product.imgUrl)"
                    classStyle="main-btn"
                    style="width: 145px;height: 50px;line-height: 48px"></y-button>
          <y-button text="现在购买"
                    @btnClick="checkout(product.itemId)"
                    style="width: 145px;height: 50px;line-height: 48px;margin-left: 10px"></y-button>
        </div>
      </div>
    </div>
    <!--产品信息-->
    <div class="item-info">
      <y-shelf title="产品信息">
        <div slot="content">
          <div class="img-item" v-if="productMsg">
            <div v-html="productMsg">{{ productMsg }}</div>
          </div>
          <div class="no-info" v-else>
            <img src="/resources/static/images/no-data.png">
            <br>
            该商品暂无内容数据
          </div>
        </div>
      </y-shelf>
    </div>
  </div>
</template>
<script>
  import { productDet, addCart } from '/api/goods'
  import { mapMutations, mapState } from 'vuex'
  import YShelf from '/components/shelf'
  import BuyNum from '/components/buynum'
  import YButton from '/components/YButton'
  import { getStore } from '/utils/storage'
  import countDown from '/components/countDown'
  export default {
    data () {
      return {
        productMsg: {},
        small: [],
        big: '',
        product: {
          salePrice: 0
        },
        amount: 1,
        userId: '',
        // 倒计时
        leftTime: '',
        startTime: '',
        endTime: '',
        serverTime: '', // 服务器时间
      }
    },
    computed: {
      ...mapState(['login', 'showMoveImg', 'showCart'])
    },
    filters: {
      /* eslint-disable */
      /**
       * 剩余天时分秒
       * @param {Number} 时间s
       * @returns {String} x天x时x分x秒
       */
      consumingTimeToMS (s) {
        if (typeof s === 'string') return s;
        if (s <= 0) return 0;
        const day = parseInt(s / (24*60*60));
        const hour = parseInt(s / (60 * 60) % 24);
        const min = parseInt(s / 60 % 60);
        const sec = parseInt(s % 60, 0);
        return day + '天'
          + (+hour < 10 ? `0${hour}` : hour) + '时'
          + (+min < 10 ? `0${min}` : min) + '分'
          + (sec < 10 ? `0${sec}` : sec) + '秒';
      }
    },
    methods: {
      ...mapMutations(['ADD_CART', 'ADD_ANIMATION', 'SHOW_CART']),
      _productDet (itemId) {
        productDet({params: {id: itemId}}).then(res => {
          let result = res.data
          this.product = result
          this.product.limitNum = result.limitNum
          this.productMsg = result.detail || ''
          this.small = result.imgUrls
          this.big = this.small[0]
          // 倒计时
          this.startTime = new Date(result.startDate).getTime() / 1000;
          this.endTime = new Date(result.endDate).getTime() / 1000;
        })
      },
      addCart (itemId, price, name, img) {
        console.log(itemId, price, name, img);
        if (!this.showMoveImg) {     // 动画是否在运动
          if (this.login) { // 登录了 直接存在用户名下
            addCart({userId: this.userId, itemId: itemId, amount: this.amount}).then(res => {
              // 并不重新请求数据
              this.ADD_CART({
                itemId: itemId,
                salePrice: price,
                productName: name,
                productImg: img,
                amount: this.amount
                // id: id,
                // itemId: id,
                // amount: this.amount,
                // item: {
                //   imgUrl: img,
                //   title: name,
                //   price: price
                // }
              })
            })
          } else { // 未登录 vuex
            this.ADD_CART({

              itemId: itemId,
              salePrice: price,
              productName: name,
              productImg: img,
              amount: this.amount,
              // id: id,
              // itemId: id,
              // amount: this.amount,
              // item: {
              //   imgUrl: img,
              //   title: name,
              //   price: price
              // }
            })
          }
          // 加入购物车动画
          var dom = event.target
          // 获取点击的坐标
          let elLeft = dom.getBoundingClientRect().left + (dom.offsetWidth / 2)
          let elTop = dom.getBoundingClientRect().top + (dom.offsetHeight / 2)
          // 需要触发
          this.ADD_ANIMATION({moveShow: true, elLeft: elLeft, elTop: elTop, img: img})
          if (!this.showCart) {
            this.SHOW_CART({showCart: true})
          }
        }
      },
      checkout (itemId) {
        this.$router.push({
          path: '/checkout',
          query: {
            itemId,
            num: this.amount,
            isPromo: this.$route.query.isPromo // isPromo=promo 为秒杀商品
          }
        })
      },
      editNum (num) {
        this.amount = num
      },
    },
    components: {
      YShelf, BuyNum, YButton, countDown
    },
    created () {
      let id = this.$route.query.id
      this._productDet(id)
      this.userId = getStore('userId')
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/style/mixin";

  .store-content {
    clear: both;
    width: 1220px;
    min-height: 600px;
    padding: 0 0 25px;
    margin: 0 auto;
  }

  .gray-box {
    display: flex;
    padding: 60px;
    margin: 20px 0;
    .gallery-wrapper {
      .gallery {
        display: flex;
        width: 540px;
        .thumbnail {
          li:first-child {
            margin-top: 0px;
          }
          li {
            @include wh(80px);
            margin-top: 10px;
            padding: 12px;
            border: 1px solid #f0f0f0;
            border: 1px solid rgba(0, 0, 0, .06);
            border-radius: 5px;
            cursor: pointer;
            &.on {
              padding: 10px;
              border: 3px solid #ccc;
              border: 3px solid rgba(0, 0, 0, .2);
            }
            img {
              display: block;
              @include wh(100%);
            }
          }
        }
        .thumb {
          .big {
            margin-left: 20px;
          }
          img {
            display: block;
            @include wh(440px)
          }
        }
      }
    }
    // 右边
    .banner {
      width: 450px;
      margin-left: 10px;
      h4 {
        font-size: 24px;
        line-height: 1.25;
        color: #000;
        margin-bottom: 13px;
      }
      h6 {
        font-size: 14px;
        line-height: 1.5;
        color: #bdbdbd;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sku-custom-title {
        overflow: hidden;
        padding: 8px 8px 18px 10px;
        position: relative;
      }
      .params-name {
        padding-right: 20px;
        font-size: 14px;
        color: #8d8d8d;
        line-height: 36px;
      }
      .num {
        padding: 29px 0 8px 10px;
        border-top: 1px solid #ebebeb;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          display: flex;
          align-items: center;
        }
        .right {
          color: #d44d44;
        }
      }
      .buy {
        position: relative;
        border-top: 1px solid #ebebeb;
        padding: 30px 0 0 10px;
      }
      .original {
        min-width: 75px;
        text-align: right;
        color: #888;
        display: inline-block;
        font-size: 13px;
        font-weight: inherit;
      }
    }
  }

  .item-info {

    .gray-box {
      padding: 0;
      display: block;
    }
    .img-item {
      width: 1220px;
      // padding: 1vw;
      text-align: center;
      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }
  }

  .no-info {
    padding: 200px 0;
    text-align: center;
    font-size: 30px;
  }

  .price {
    display: block;
    color: #d44d44;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: right;
    margin-left: 5px;
    i {
      padding-left: 2px;
      font-size: 24px;
    }
  }
</style>
