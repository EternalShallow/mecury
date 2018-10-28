<!-- 全部按钮 -->
<template>
  <div class="wholeTab iconfont">
    <tab :scroll-threshold="form.tabList.length" v-model="form.tabIndex">
      <tab-item v-for="n in form.tabList" :key="n" :selected="n===1">{{ n }}</tab-item>
    </tab>
    <swiper ref="itemStyle" class="itemStyle" :show-dots="false">
      <div v-if="form.tabIndex == 0">
        <article v-for="v in orderList">
          <header>
            单号：{{v.orderid}}
            <div>
              <label>借阅时间：{{v.borrowTime | dateFormat}}</label>
              <router-link tag="span" style="color: #2e2eb9;" :to="{ path: `/weChat/logistics?id=${v.orderid}` }">
                查看物流
              </router-link>
            </div>
          </header>
          <section v-for="vv in v.details" @click="tabClick(vv)">
            <div>
              <img :src="URL+[vv.headImage && vv.headImage.split(',')[0]]" />
            </div>
            <div>
              <code>{{vv.name}}
                <label>{{vv.publisher}}</label>
              </code>
              <span class="br" v-show="vv.editor">作者：{{vv.editor}}</span>
              <!-- <span class="ellipsis2">{{vv.introduction}}</span> -->
            </div>
          </section>
        </article>
        <article class="historyHr" v-if="orderList.length>0">
          <label></label>
          <span>亲，看完了</span>
          <label></label>
        </article>
      </div>
      <div v-if="form.tabIndex == 1">
        <article class="historyHr">
          <label></label>
          <span>历史订单</span>
          <label></label>
        </article>
        <article class="historyItem" v-for="(v,i) in historyList" :key="i">
          <header>
            单号：{{v.orderid}}
            <div class="historyItem-div">
              <label>借阅时间：{{v.borrowTime | dateFormat}}</label>
              <span>{{v.borrowType}}</span>
              <div>
                <label>还书时间：{{v.returnTime | dateFormat}}</label>
                <span>{{v.borrowType}}</span>
              </div>
            </div>
          </header>
          <section v-for="(vv,ii) in v.details" @click="tabClick(vv)" :key="ii">
            <div>
              <img :src="URL+[vv.headImage && vv.headImage.split(',')[0]]" />
            </div>
            <div>
              <code>{{vv.name}}
                <label>{{vv.publisher}}</label>
              </code>
              <span class="br" v-show="vv.editor">作者：{{vv.editor}}</span>
              <!-- <span class="ellipsis2">{{vv.introduction}}</span> -->
            </div>
          </section>
        </article>
        <article class="historyHr" v-if="historyList.length>0">
          <label></label>
          <span>亲，看完了</span>
          <label></label>
        </article>
      </div>
    </swiper>
  </div>
</template>
<script>
import api from "./api";
import { Tab, TabItem, Swiper, SwiperItem } from "vux";
export default {
  components: { Tab, TabItem, Swiper, SwiperItem },
  data() {
    return {
      URL: utils.url.curr,
      orderList: [],
      historyList: [],
      form: {
        tabIndex: 0,
        tabList: ["当前订单", "历史订单"]
      }
    };
  },
  created() {
    this.getList();
  },
  filters: {
    dateFormat: function(val) {
      return val && utils.date.timeToStr(val, "YYYY-MM-dd");
    }
  },
  mounted() {
    this.$refs.itemStyle.height = window.screen.availHeight - 204 + "px";
  },
  methods: {
    getList() {
      //订单数据
      api.getBorrowOrder(req => {
        if (req.code == 200) {
          this.orderList = [...req.data];
        }
      });

      //历史订单
      api.borrowHistory(req => {
        if (req.code == 200) {
          this.historyList = [...req.data];
        }
      });
    },
    tabClick(item) {
      this.$router.push({
        path: "/weChat/home/details",
        query: {
          _title: item.name,
          detailId: item.id
        }
      });
    }
  }
};
</script>
<style lang="less">
html,
body {
  background: #f7f7f7 url(../img/back.png) no-repeat center center;
  background-size: 100% 100%;
  font-size: 12px;
}
.flex {
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
}
.wholeTab {
  article {
    &:last-child {
    }
    width: 90%;
    border-radius: 3px;
    display: block;
    margin: 15px auto;
    position: relative;
    margin-top: 12px;
    font-size: 12px;
    padding: 6px 12px 3px;
    background: #ffffff;
    box-shadow: 1px 1px 1px 0px #efefef;
    background: #fff;
    position: relative;
    header {
      display: block;
      position: relative;
      border-bottom: 1px solid #efe7e7;
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      font-weight: 700;
      color: #333;
      position: relative;
      div {
        font-size: 12px;
        display: inline-block;
        right: 0px;
        position: absolute;
      }
      label,
      span {
        font-weight: normal;
      }
      span {
        margin-left: 6px;
      }
    }
    section {
      .flex;
      border-bottom: 1px solid #efe7e7;
      padding: 10px 0;
      &:last-child {
        border: none;
      }
      div {
        &:last-child {
          width: 100%;
        }
      }
      img {
        width: 100px;
        height: 100px;
        margin-right: 8px;
        display: block;
      }
      .br {
        width: 96%;
        margin: 3px 0;
        margin-bottom: 4px;
        display: -webkit-box;
        color: #222222;
      }
      code {
        font-size: 16px;
        color: #333333;
        display: block;
        margin-top: 7px;
        label {
          font-size: 12px;
          color: #999999;
          padding: 2px 0px;
          display: block;
        }
      }
      .ellipsis2 {
        width: 96%;
        -webkit-line-clamp: 2;
      }
    }
  }

  .historyHr {
    padding-top: 30px;
    padding-bottom: 20px;
    background: unset;
    width: 80%;
    box-shadow: none;
    margin: 0 auto;
    justify-content: center;
    text-align: center;
    color: #999999;
    .flex;
    label {
      width: 66px;
      height: 1px;
      border-top: 1px solid #ded9d9;
      position: relative;
      top: 9px;
    }
    span {
      padding: 0 12px;
    }
  }

  .historyItem {
    header {
      height: 60px;
      div {
        margin-top: -18px;
      }
    }
    &-div {
      top: 16px;
    }
  }
  .vux-slider > .vux-swiper {
    overflow: initial;
    overflow-x: hidden;
  }
}
</style>

