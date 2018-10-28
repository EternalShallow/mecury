<!--会员-->
<template>
  <div class="member iconfont">
    <header :class="isShowRegistMember?'header2':'header1'">

      <router-link v-if="isShowRegistMember" class="noArticle" tag="article" :to="{ path: '/weChat/member/membershipCard' }">
        <img src="./img/portrait.png" />
        <code>{{qrcodeData.wpInfo.nickname}}</code>
        <section>
          <button type="button">立即成为读者
          </button>
        </section>
      </router-link>

      <article class="Article" v-else>
        <img @error="errorImg" :src="qrcodeData.wpInfo && qrcodeData.wpInfo.headimgurl || ''" />
        <section class="yanjin">
          <div>
            <code>{{qrcodeData.member && qrcodeData.member.babyName || (qrcodeData.wpInfo && qrcodeData.wpInfo.nickname)}}</code>
          </div>
          <div class="vip flex" style="background:#6e9679">
            <span>读者信息</span>
            <section class="qrcode" @click="qrcodeClick()">
              <qrcode v-if="qrcodeData.barCode" :value="qrcodeData.barCode" size="15"></qrcode>
            </section>
          </div>
        </section>
        <section class="vipNickName">
          <code></code>
          <div class="informationBu">
            <section>
              <div>借书有效期：{{qrcodeData.member && qrcodeData.member.borrowDeadline | dateFormat}}</div>
            </section>
            <section>
              <div>入场券有效期：{{qrcodeData.member && qrcodeData.member.ticketDeadline | dateFormat}}</div>
            </section>
          </div>
        </section>
      </article>
    </header>
    <article class="item-list">
      <dl>
        <dt>{{qrcodeData.member && qrcodeData.member.ticketNum}} 张</dt>
        <dd>入场券</dd>
      </dl>
      <dl>
        <dt>{{BorrowData.borrowBookCount}}本</dt>
        <dd>共借阅</dd>
      </dl>
      <dl>
        <dt>{{BorrowData.borrowValue && BorrowData.borrowValue /100}}元</dt>
        <dd>价值</dd>
      </dl>
    </article>

    <article class="item-list tablist">
      <router-link tag="dl" :to="{ path: '/weChat/member/wholeTab' }">
        <dt class="currentBook "></dt>
        <dd>当前书单</dd>
      </router-link>
      <router-link tag="dl" :to="{ path: '/weChat/member/historyBook' }">
        <dt class="borrowingHistory"></dt>
        <dd>借阅历史</dd>
      </router-link>
      <router-link tag="dl" :to="{ path: '/weChat/collection' }">
        <dt class="myCollection"></dt>
        <dd>我的收藏</dd>
      </router-link>
      <!-- <router-link tag="dl" :to="{ path: '/weChat/member/footprint' }">
				<dt class="icon-zuji"></dt>
				<dd>足迹</dd>
			</router-link> -->
    </article>
    <article class="item-tab">
      <ul>
        <li>
          <div class="icon-hongbao-m">我的押金</div>
          <div>￥{{qrcodeData.member && (qrcodeData.member.depositMoney/100) || '0.00'}}</div>
        </li>
        <router-link v-if="!isShowRegistMember" tag="li" :to="{ path: '/weChat/member/register', query: {_title: '完善会员信息'} }">
          <div class="icon-gerenzhongxin">我的信息</div>
          <div class="icon-youjiantou"></div>
        </router-link>
        <!-- <router-link tag="li" :to="{ path: '/weChat/member/myPoints' }">
					<div class="icon-lipin">我的积分</div>
					<div class="icon-youjiantou"></div>
				</router-link> -->
        <router-link tag="li" :to="{ path: '/weChat/member/membershipCard' }">
          <div class="icon-qiapian">购买会员卡</div>
          <div class="icon-youjiantou"></div>
        </router-link>
        <router-link tag="li" :to="{ path: '/weChat/member/address' }">
          <div class="icon-ziyuan">地址管理</div>
          <div class="icon-youjiantou"></div>
        </router-link>
        <router-link tag="li" :to="{ path: '/weChat/member/returnBook' }">
          <div class="icon-gouwuche">我要还书</div>
          <div class="icon-youjiantou"></div>
        </router-link>
        <router-link tag="li" :to="{ path: '/weChat/member/contactUs' }">
          <div class="icon-ziyuan1">读者帮助</div>
          <div class="icon-youjiantou"></div>
        </router-link>
      </ul>
    </article>

    <div v-transfer-dom v-if="qrcodeData.barCode">
      <x-dialog v-model="showHideOnBlur" class="dialog-qrcode" hide-on-blur>
        <div class="img-box">
          <barcode :value="qrcodeData.barCode" :options="barcode_option" tag="svg" class="barcode"></barcode>
          <qrcode :value="qrcodeData.barCode" size="180" class="qrcode"></qrcode>
        </div>
        <div @click="showHideOnBlur=false">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </div>

  </div>
</template>

<script>
import { Qrcode, XDialog, TransferDomDirective as TransferDom } from "vux";
import VueBarcode from "@xkeshi/vue-barcode";
import api from "./api";
import headImg from "./img/portrait.png";
export default {
  directives: {
    TransferDom
  },
  data() {
    return {
      isShowRegistMember: false,
      qrcodeData: {},
      showHideOnBlur: false,
      barcode_option: {
        displayValue: true, //是否默认显示条形码数据
        //textPosition  :'top', //条形码数据显示的位置
        background: "#fff", //条形码背景颜色
        valid: function(valid) {
          console.log(valid);
        },
        width: "2px",
        height: "55px",
        fontSize: "20px" //字体大小
      },
      BorrowData: {} //借阅数据信息
    };
  },
  filters: {
    dateFormat: function(val) {
      return val && utils.date.timeToStr(val, "YYYY年MM月dd日");
    }
  },
  mounted() {},
  components: {
    Qrcode,
    XDialog,
    barcode: VueBarcode
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    errorImg(event) {
      event.target.src = headImg;
    },
    qrcodeClick() {
      //弹框
      this.showHideOnBlur = true;
    },
    getUserInfo() {
      api["getUserInfo"](req => {
        if (req.code == 200) {
          this.isShowRegistMember = !req.data.barCode ? true : false;
          this.qrcodeData = req.data;
        }
      });
      api["getMemberBorrowBrief"](req => {
        this.BorrowData = req;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
}
.member {
  background: #f6f9fa;
  .header1 {
    //background: linear-gradient(to bottom, #ffe86b 0px, #875c12 100%) repeat-x scroll 0 0 rgba(0, 0, 0, 0);
    //background: #efbf3d;
  }
  .header2 {
    padding-bottom: 10px;
  }
  header {
    height: auto;
    min-height: 210px;
    background: #dbeada url(./img/header.png) no-repeat center center;
    background-size: 100% 100%;
    .flex;
    img {
      width: 90px;
      height: 90px;
      min-width: 90px;
      min-height: 90px;
      display: block;
      -webkit-border-radius: 100%;
      margin: 2% auto 0;
      border-radius: 50%;
      border: 2px solid #ececec;
    }

    //----------------------------------------------------------
    .noArticle {
      position: relative;
      text-align: center;
      img {
        border: none;
        margin-top: 15px;
      }
      code {
        font-size: 18px;
        width: auto;
        display: block;
        margin-top: 8px;
      }
      section {
        margin-top: 10px;
        button {
          width: 120px;
          height: 30px;
          padding: 0 10px;
          line-height: 30px;
          text-align: center;
          text-indent: 0;
          font-size: 13px;
          border: none;
          font-size: 12px;
          background: #6e9679;
          color: #ffffff;
          position: relative;
          border-radius: 8px;
          i {
            position: absolute;
            top: 3px;
            font-size: 30px;
            right: 0;
          }
        }
      }
    }
    .Article {
      .yanjin {
        font-family: "Courier New", Courier, monospace;
        text-align: center;
        margin-top: 10px;
        margin-bottom: -5px;
        div {
          font-size: 12px;
          margin-top: -7px;
          margin-bottom: 5px;
          code {
            font-size: 16px;
          }
        }
        .vip {
          //width: 120px;
          width: 100px;
          text-align: center;
          margin: 0 auto;
          height: 25px;
          line-height: 25px;
          color: #ffffff;
          border-radius: 8px;
          span {
            text-align: right;
            width: 60%;
            display: block;
            font-size: 13px;
            top: 2px;
            position: relative;
          }
          .qrcode {
            margin: 0 auto;
            width: 40%;
            margin-left: -1px;
            div {
              padding: 2px 2px;
              display: initial;
              background: #ffffff;
            }
          }
        }
      }
      .vipNickName {
        position: relative;
        text-align: center;
        top: -8px;
        code {
          font-size: 20px;
          display: block;
          text-indent: 10px;
          margin-top: 23px;
        }
        .informationBu {
          section {
            .flex;
            font-family: "Courier New", Courier, monospace;
            font-size: 12px;
            /* margin-top: 5px; */
          }
          div {
            width: 100%;
            text-align: center;
          }
        }
      }
    }

    article {
      color: #231815;
      width: 100%;
      font-size: 14px;
      position: relative;
      height: max-content;
      top: 10%;
    }
    //----------------------------------------------------------
  }

  .item-list {
    .flex;
    font-size: 16px;
    dl {
      width: 25%;
      padding: 20px;
      height: 40px;
      text-align: center;
      background: #ffffff;
      margin-bottom: 6px;
      dt {
        font-size: 18px;
        font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
        color: #231815;
      }
      dd {
        font-size: 12px;
        color: #898989;
      }
    }
  }
  .tablist {
    dl {
      height: auto;
      width: 30%;
      padding: 10px;
      dt {
        width: 55px;
        height: 55px;
        background-size: 100% 100% !important;
        text-align: center;
        margin: 0 auto 8px;
      }
      background: #f6f9fa;
      .currentBook {
        background: url(./img/tabList/1.png) no-repeat center center;
      }
      .borrowingHistory {
        background: url(./img/tabList/2.png) no-repeat center center;
      }
      .myCollection {
        background: url(./img/tabList/3.png) no-repeat center center;
      }
    }
  }

  .item-tab {
    padding-bottom: 60px;
    background: #ffffff;
    ul {
      border-bottom: 1px solid #f5f5f5;
      background: #f6f9fa;
      li {
        .flex;
        &:active {
          background-color: #ececec;
        }
        background: #ffffff;
        margin-bottom: 6px;
        font-size: 14px;
        color: #222222;
        height: 50px;
        border-bottom: 1px solid #f5f5f5;
        padding-left: 36px;
        line-height: 50px;
        &:last-child {
          border-bottom: none;
        }
        div {
          &:first-child {
            width: 75%;
            text-indent: -26px;
            font-size: 16px;
            &:before {
              margin-right: 12px;
              font-size: 22px;
              position: relative;
              top: 3px;
            }
          }
          &:last-child {
            width: 20%;
            text-align: right;
            &:before {
              font-size: 22px;
            }
          }
        }
      }
    }
  }
}

@import "~vux/src/styles/close";

.dialog-qrcode {
  .weui-dialog {
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .img-box {
    margin: 0 auto;
    height: 350px;
    overflow: hidden;
    border-bottom: 1px solid #dddddd;
  }
  .barcode {
    width: 96%;
    margin: 0 auto;
  }
  .qrcode {
    margin: 0 auto;
    margin-top: 22px;
    width: 96%;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
</style>