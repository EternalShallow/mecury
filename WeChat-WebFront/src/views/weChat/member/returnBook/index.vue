<!--我要还书-->
<template>
  <div class="bookBox iconfont returnBook"
    ref="bookBoxRef">
    <header class="bookBox-header"
      v-if="commonList.length>0">
      <div class="address_border"
        v-if="select.checklist001 == 1">
        <router-link tag="ul"
          v-if="objAddress.name"
          :to="{ path: '/weChat/member/address',query: {source:'orderDetails'}}">
          <li>
            <strong>{{objAddress.name}} {{objAddress.phone}}</strong>
          </li>
          <li>{{objAddress.address}} </li>
        </router-link>
        <router-link v-else
          tag="ul"
          :to="{ path: '/weChat/member/address',query: {source:'orderDetails'}}">>
          <li>
            <strong>选择取件地址</strong>
          </li>
          <li>请选择取件地址</li>
        </router-link>
        <div class="limitHourValueStyle">
          <datetime v-model="limitHourValue"
            format="YYYY-MM-DD HH:mm"
            :min-hour='7'
            :max-hour='17'
            :min-year="2018"
            :max-year="2019"
            placeholder="请预约取件时间"
            title="上门取件时间"></datetime>
        </div>
      </div>
    </header>
    <article ref="returnBook"
      class="item-list-par"
      v-if="commonList.length>0">
      <swipeout class="item-list">
        <swipeout-item :threshold=".5"
          underlay-color="#ccc"
          v-for="(v,i) in commonList">
          <div slot="right-menu">
            <swipeout-button @click.native="onButtonClick('delete',v.id)"
              background-color="#FF3333">删除</swipeout-button>
          </div>
          <div slot="content">
            <section>
              <div class="bookBox-imgBook"
                @click="details(v.id)">
                <img :src="URL+[v.headImage.split(',')[0]]" />
              </div>
              <div class="bookBox-details"
                @click="details(v.id)">
                <code>{{v.name}}</code>
                <span class="ellipsis2" v-show="v.publisher">出版社：{{v.publisher}}</span>
                <span class="ellipsis2" v-show='v.editor'>作者：{{v.editor}}</span>
              </div>
            </section>
          </div>
        </swipeout-item>
      </swipeout>
    </article>
    <no-data v-if="commonList.length<=0"></no-data>
    <div class="btns"
      @touchmove.prevent
      v-if="commonList.length>0">
      <x-button mini
        type="primary"
        @click.native="huanshuSbumit">还书</x-button>
    </div>
  </div>
</template>

<script>
import '@/js/utils'
import {
  Checklist,
  Swipeout,
  SwipeoutItem,
  SwipeoutButton,
  XButton,
  Group,
  Radio,
  AlertModule,
  TransferDomDirective as TransferDom,
  Datetime
} from 'vux'
//import _ from "lodash";
import NoData from 'components/common/noData'
import api from './api'
import addressApi from '../../member/address/api'
import wholeTabApi from '../wholeTab/api'
export default {
  directives: {
    TransferDom
  },
  data() {
    return {
      URL: utils.url.curr,
      select: {
        radio003: [
          { key: '1', value: '<span class="express">快递到家</span>' }
        ], //地址选择
        checklist001: '1' //选中的地址
      },
      objAddress: {}, //地址信息管理
      commonList: [],
      orderId: '', //订单Id
      limitHourValue: '' //取件时间
    }
  },
  computed: {
    startDate(data) {
      return new Date()
    },
    endDate(data) {
      return utils.date.getDay(2)
    }
  },
  components: {
    Checklist,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    XButton,
    Group,
    Radio,
    NoData,
    Datetime
  },
  created() {
    this.getList()

    //获取地址列表
    addressApi.getAddressList(req => {
      req &&
        req.data &&
        req.data.map(data => {
          if (data.activeFlag == 1) {
            this.objAddress = data
          }
        })
    })
  },
  mounted() {},
  watch: {
    commonList: function() {
      setTimeout(() => {
        if (this.commonList.length > 0) {
          this.$refs.returnBook.style.height =
            window.screen.availHeight - 306 + 'px'
          this.$refs.returnBook.style.minHeight =
            window.screen.availHeight - 306 + 'px'
        } else {
          this.$refs.bookBoxRef.style.height = '100%'
        }
      }, 50)
    }
  },
  methods: {
    getList(key) {
      let that = this

      //订单数据
      wholeTabApi.getBorrowOrder(req => {
        if (req.code == 200) {
          that.commonList = []
          that.commonList = [...req.data[0].details]
          that.orderId = req.data[0].orderid
        }
      })
    },

    details(id) {
      this.$router.push({
        path: '/weChat/home/details',
        query: {
          _title: '详情',
          detailId: id
        }
      })
    },
    onButtonClick(type, id) {
      //删除购物清当
      if (type == 'delete') {
        this.getList([id])
      }
    },
    huanshuSbumit() {
      let that = this
      if (that.select.checklist001[0] == 1) {
        if (!this.objAddress.name) {
          return utils.toast('请选择邮寄地址')
        }
      }
      if (!that.limitHourValue) {
        return utils.toast('请预约取件时间')
      }

      //开始还书
      api.callExpressBack(
        {
          orderId: that.orderId,
          id: that.objAddress.addrid,
          time: new Date(that.limitHourValue).getTime()
        },
        req => {
          // 显示
          that.$vux.alert.show({
            title: '提示信息',
            content: req.message || '太棒了又读完10本书！还书信号已传递给快递小哥，将按约定时间上门取书。',
            onShow() {
              return window.history.back();
            },
            onHide() {}
          })
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
}
.bookBox,
.returnBook {
  overflow: hidden;
  background: #f2efea url(./img/back.png) no-repeat center center;
  background-size: 100% 116%;
  height: 100%;

  &-header {
    display: block;
    width: 100%;
    position: absolute;
    z-index: 101;
    background: #fff;
    .selectAddress {
      display: block;
      padding: 0;

      margin-top: 0;
      .weui-cells {
        margin-top: 0;
      }
      p {
        font-size: 14px;
        color: #000000;
      }
    }
    .address_border {
      padding-bottom: 16px;
      background: #fff url('./img/all.png') -7px bottom repeat-x;
      background-size: 64px 5px;
      padding: 12px 10px;
      padding-right: 16px;
      position: relative;
      font-size: 14px;
      word-wrap: break-word;
      word-break: break-all;
      &:after {
        content: '\E735';
        position: absolute;
        right: 12px;
        font-size: 22px;
        top: 12%;
      }
    }
  }

  &-imgBook {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    img {
      width: 100%;
      height: 100%;
      margin-right: 8px;
      margin-left: 16px;
      border: 1px solid #f9f6f6;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
  }
  &-details {
    width: 60%;
    margin-left: 20px;
    margin-top: 3px;

    code {
      font-size: 16px;
      display: block;
    }
    span {
      margin-top: 8px !important;
    }
    .red {
      color: red;
    }
  }
  section {
    padding: 16px;
    border-bottom: 1px solid #efefef;
    .flex;
    position: relative;
    cursor: pointer;
    div {
      span {
        width: 100%;
        margin-top: 3px;
        font-size: 12px;
        line-height: 16px;
      }
    }
  }

  .item-list-par {
    overflow: auto;
    margin-top: 71px;
    display: block;
    padding-bottom: 70px;
    position: relative;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
  .item-list {
    overflow: auto;
    overflow-x: hidden;
  }
  .btns {
    height: 50px;
    width: 100%;
    min-height: 50px;
    background: hsla(0, 0%, 100%, 0.95);
    color: #333;
    font-size: 14px;
    position: absolute;
    z-index: 101;
    bottom: 0;
    .flex;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    button {
      border-radius: 0;
      width: 100px;
      height: 50px;
      flex: 1;
      box-sizing: border-box;
      color: #ffffff;
      font-size: 16px;
      &:after {
        border-radius: 0;
      }
    }
  }
  i {
    display: inline-block;
  }
  .notice {
    display: inline-block;
    &:before {
      content: '';
      background: url(./img/notice.png) no-repeat center center;
      background-size: contain;
      left: 5px;
      width: 18px;
      height: 18px;
      display: inline-block;
      top: 4px;
      position: relative;
      margin-right: 13px;
    }
  }

  .prize {
    background: url(./img/prize.png) no-repeat center center;
    background-size: contain;
    width: 30px;
    height: 30px;
    position: absolute;
    top: 5px;
    display: inline-block;
  }
  .express {
    display: inline-block;
    position: relative;
    top: 0;
    left: -3px;
    &:before {
      content: '';
      background: url(./img/shop.png) no-repeat center center;
      background-size: contain;
      left: 5px;
      right: 0;
      width: 26px;
      height: 15px;
      display: inline-block;
      top: 4px;
      position: relative;
      margin-right: 13px;
    }
  }
  .limitHourValueStyle {
    border-top: 1px solid #dddddd;
    margin-top: 7px;
    padding: 0;
    .weui-cell {
      padding: 13px 1px 4px;
      margin: 0;
      display: flex;
      text-align: right;
    }
  }
}
.stock {
  span {
    display: block;
    text-align: left;
    line-height: 30px;
  }
}
</style>