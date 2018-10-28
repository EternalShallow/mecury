<!--书框-->
<template>
  <div class="bookBox iconfont" ref="bookBoxRef">
    <header class="bookBox-header" v-if="commonList.length>0">
      <group class="selectAddress">
        <checklist :max="1" required :options="select.radio003" v-model="select.checklist001" @on-change="changeAddressType" label-position="left"></checklist>
      </group>
      <router-link v-if="select.checklist001[0] == 2" tag="div" class="address_border" :to="{ path: '/weChat/member/address',query: {source:'orderDetails'}}">
        <ul v-if="objAddress.name">
          <li>
            <strong>{{objAddress.name}} {{objAddress.phone}}</strong>
          </li>
          <li>{{objAddress.address}} </li>
        </ul>
        <ul v-else>
          <li>
            <strong>选择地址</strong>
          </li>
          <li>请选择配送地址</li>
        </ul>
      </router-link>
    </header>
    <article ref="itemListBook" class="item-list-par" v-if="commonList.length>0">
      <swipeout class="item-list">
        <swipeout-item :threshold=".5" underlay-color="#ccc" v-for="(v,i) in commonList">
          <div slot="right-menu">
            <swipeout-button @click.native="onButtonClick('delete',v.bookBaseInfo.id)" background-color="#FF3333">删除</swipeout-button>
          </div>
          <div slot="content">
            <section>
              <checklist :options="[{key:v.bookBaseInfo.id}]" class="checkBoxBook" :disabled="!v.flag" v-model="inlineDescListValue" @on-change="i==0 && change()"></checklist>
              <div class="bookBox-imgBook" @click="details(v.bookBaseInfo.id)">
                <img :src="URL+[v.bookBaseInfo.headImage.split(',')[0]]" />
              </div>
              <div class="bookBox-details" @click="details(v.bookBaseInfo.id)">
                <code>{{v.bookBaseInfo.name}}</code>
                <span class="ellipsis2" v-if="v.bookBaseInfo.editor">作者：{{v.bookBaseInfo.editor||' '}}</span>
                <span class="red" v-if="!v.flag">暂无库存</span>
              </div>
            </section>
          </div>
        </swipeout-item>
      </swipeout>
    </article>
    <no-data v-if="commonList.length<=0"></no-data>
    <div class="btns" @touchmove.prevent v-if="commonList.length>0">
      <checklist :disabled="checkAllFlag.length<=0" :options="allCheckBox" class="btns-checkBoxBook" v-model="allCheckBoxValue" @change.native="selectLeft()"></checklist>
      <span class="selectBook" v-if="inlineDescListValue.length>0">
        <code>共选中{{inlineDescListValue.length}}本</code>
      </span>
      <x-button mini type="primary" :disabled="inlineDescListValue.length<=0" @click.native="jieshuSbumit">借书</x-button>
    </div>
  </div>
</template>

<script>
import "@/js/utils";
import {
  Checklist,
  Swipeout,
  SwipeoutItem,
  SwipeoutButton,
  XButton,
  Group,
  Radio,
  AlertModule,
  TransferDomDirective as TransferDom
} from "vux";
//import _ from "lodash";
import NoData from "components/common/noData";
import api from "./api";
import addressApi from "../member/address/api";
import bookShop from "./api/utils";
import memberApi from "../member/api";

export default {
  directives: {
    TransferDom
  },
  data() {
    return {
      URL: utils.url.curr,
      select: {
        radio003: [
          {
            key: "1",
            value: '<span class="notice">到店自取</span>'
          }, //（自取有礼）</span><i class="prize"></i>
          { key: "2", value: '<span class="express">快递到家</span>' }
        ], //地址选择
        checklist001: ""
      },
      objAddress: {}, //地址
      inlineDescListValue: [],
      commonList: [],
      allCheckBoxValue: [],
      allCheckBox: ["全选"],
      checkAllFlag: []
    };
  },
  components: {
    Checklist,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    XButton,
    Group,
    Radio,
    NoData
  },
  created() {
    this.getList();

    //获取地址列表
    addressApi.getAddressList(req => {
      req &&
        req.data &&
        req.data.map(data => {
          if (data.activeFlag == 1) {
            this.objAddress = data;
          }
        });
    });
  },
  mounted() {
    /* if (this.commonList.length > 0) {
      this.$refs.itemListBook.style.height =
        window.screen.availHeight - 306 + 'px'
      this.$refs.itemListBook.style.minHeight =
        window.screen.availHeight - 306 + 'px'
    } else {
      this.$refs.bookBoxRef.style.height = '100%'
    } */

    //2018-09-09 23:16:05
    if (this.commonList.length > 0) {
      this.$refs.itemListBook.style.height = "68vh";
    } else {
      this.$refs.bookBoxRef.style.height = "100vh";
    }
  },
  methods: {
    changeAddressType(val) {
      if (val && val[0] == "2") {
        this.$refs.itemListBook.style.marginTop = "161px";
        this.$refs.itemListBook.style.height =
          window.screen.availHeight - 370 + "px";
        this.$refs.itemListBook.style.minHeight =
          window.screen.availHeight - 370 + "px";
      } else {
        this.$refs.itemListBook.style.marginTop = "91px";
        this.$refs.itemListBook.style.height =
          window.screen.availHeight - 310 + "px";
        this.$refs.itemListBook.style.minHeight =
          window.screen.availHeight - 310 + "px";
      }
    },
    getList(key) {
      let that = this;
      let shopList = bookShop.getLocalStoreList(key, this);
      that.commonList = [];
      that.commonList = [...shopList];
      let list = [];
      that.commonList.map(req => {
        list.push(req.bookBaseInfo.id);
      });
      if (list.length > 0) {
        api.checkAvaliable(
          {
            data: list
          },
          data => {
            if (data) {
              data = data.data ? data.data : [];
              let arrList = [];

              for (let key in data) {
                for (let i = 0; i < that.commonList.length; i++) {
                  if (key == that.commonList[i].bookBaseInfo.id) {
                    that.$set(that.commonList[i], `flag`, data[key]);
                    if (data[key]) arrList.push(key);
                    break;
                  }
                }
              }
              that.checkAllFlag = [...arrList];
            }
          }
        );
      }
    },
    change(index) {
      if (this.inlineDescListValue.length >= this.commonList.length) {
        this.allCheckBoxValue = ["全选"];
      } else if (
        this.inlineDescListValue.length > 0 &&
        this.inlineDescListValue.length != this.commonList.length &&
        this.checkAllFlag.length === this.commonList.length
      ) {
        this.allCheckBoxValue = [];
      }
    },
    selectLeft() {
      //const left = _.without.apply(_, [this.commonList].concat(this.inlineDescListValue));
      //this.inlineDescListValue = left;
      setTimeout(() => {
        if (this.allCheckBoxValue[0] != "全选") {
          this.inlineDescListValue = [];
          this.allCheckBoxValue = [];
        } else {
          this.allCheckBoxValue[0] = "全选";
          this.inlineDescListValue = [];
          this.commonList.map(data => {
            if (data.flag) this.inlineDescListValue.push(data.bookBaseInfo.id);
          });
        }
      }, 50);
    },
    details(id) {
      this.$router.push({
        path: "/weChat/home/details",
        query: {
          _title: "详情",
          detailId: id
        }
      });
    },
    onButtonClick(type, id) {
      //删除购物清当
      if (type == "delete") {
        this.getList([id]);
        this.inlineDescListValue = [];
        this.allCheckBoxValue = [];
      }
    },
    jieshuSbumit() {
      //必须选购10本图书才可以下单
      let leng = this.inlineDescListValue.length;

      //代码没有问题，先行注释
      if (leng != 10) {
        // 显示
        this.$vux.alert.show({
          title: "提示信息",
          content:
            '<span style="line-height:25px;text-align:left;font-size:14px;display:block;">请挑选10本下单～ </span>'
        });
        return;
      }

      if (!this.select.checklist001[0]) return utils.toast("请选择地址类型");
      if (this.select.checklist001[0] == 2) {
        if (!this.objAddress.name) {
          return utils.toast("请选择邮寄地址");
        }
      }

      //判断下是否是会员，如果是会员进行下单，不是会员，则跳转到会员页面
      let memberFlag = false;
      memberApi.getUserInfo(req => {
        memberFlag = !req.data.barCode ? true : false;
      });
      if (memberFlag) {
        //立即成为会员，购买会员
        return this.$router.push({
          path: "/weChat/member/membershipCard"
        });
      }
      api.manageBorrow(
        {
          data: {
            bookids: this.inlineDescListValue,
            addressid:
              this.select.checklist001[0] == 2 ? this.objAddress.addrid : "-1"
          }
        },
        req => {
          if (req.code == 200) {
            //应该跳转到订单页面
            let data = req.data;
            let arr = [];
            data.map(data => {
              arr.push(data.bookid);
            });
            this.getList(arr); //清空购物车列表

            this.$router.push({
              path: "/weChat/member/checkoutSuccess",
              query: {
                _title: "订单成功"
              }
            });
          } else if (req.code == 523) {
            let data = req.data || [];
            let nameList = '<p class="stock">';
            data.map(item => {
              if (item.bookName) {
                nameList += "<span>" + item.bookName + "</span>";
              }
            });
            nameList += "</p>";
            return AlertModule.show({
              title: req.message,
              content: nameList
            });
          } else {
            return AlertModule.show({
              title: "提示信息",
              content: req.message
            });
          }
        }
      );
    }
  }
};
</script>

<style lang="less">
.flex {
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
}
.bookBox {
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
      background: #fff url("./img/all.png") -7px bottom repeat-x;
      background-size: 64px 5px;
      padding: 12px 10px;
      padding-right: 16px;
      position: relative;
      font-size: 14px;
      word-wrap: break-word;
      word-break: break-all;
      &:after {
        content: "\E735";
        position: absolute;
        right: 0;
        font-size: 22px;
        top: 22%;
      }
    }
  }

  .checkBoxBook {
    width: 40px;
    text-align: center;
    .weui-cells:before,
    .weui-cells:after {
      border: none;
    }
    .weui-cell {
      padding: 0 !important;
      display: block;
      height: 80px;
      line-height: 80px;
    }
    .weui-cells_checkbox .weui-cell__hd {
      padding-right: 0px;
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
    margin-left: 15px;
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
    padding: 16px 6px;
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
    margin-top: 91px;
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

    &-checkBoxBook {
      width: calc(100% - 100px);
      height: 50px;
      .weui-check_label {
        padding: 13px;
      }
    }
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
      content: "";
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
      content: "";
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
  .selectBook {
    position: absolute;
    text-align: center;
    left: 113px;
    top: 14px;
    code{
      color:red;
    }
  }
}
/* .weui-tab__panel {
    -webkit-overflow-scrolling: auto !important;
} */
.stock {
  span {
    display: block;
    text-align: left;
    line-height: 30px;
  }
}
</style>