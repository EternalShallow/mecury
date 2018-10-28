<template>
  <div class="mainApp iconfont" ref="mainAppRef" @touchstart="mainAppMove" @touchmove="mainAppMove" @touchend="mainAppMove">
    <div v-transfer-dom>
      <loading v-model="isLoading"></loading>
    </div>

    <!-- <div style="position:absolute;top:0;z-index:100">{{$route.meta.keepAlive}}</div> -->
    <!-- main content -->
    <view-box ref="viewBoxBody" :body-padding-bottom="isTabbar==false?'45px':'0'">

      <!-- begin -->
      <!-- 
        <transition @after-enter="$vux.bus && $vux.bus.$emit('vux:after-view-enter')" :name="viewTransition" :css="!!direction">
        </transition>
      -->
      <!-- <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view> -->
      <router-view></router-view>
      <!-- <router-view></router-view> -->
      <!-- end -->

      <tabbar style="touch-action: none;display:flex;display:-webkit-flex" icon-class="vux-center" v-show="!isTabbar" slot="bottom">
        <tabbar-item :link="{path:'/weChat/home/index'}" :selected="route.path === '/weChat/home/index'">
          <img slot="icon" src="./img/tab/4.png">
          <img slot="icon-active" src="./img/tab/3.png">
          <span slot="label">首页</span>
        </tabbar-item>
        <tabbar-item :link="{path:'/weChat/classification'}" :selected="route.path === '/weChat/classification'">
          <img slot="icon" src="./img/tab/1.png">
          <img slot="icon-active" src="./img/tab/2.png">
          <span slot="label">分类</span>
        </tabbar-item>
        <tabbar-item :link="{path:'/weChat/bookBox'}" :selected="route.path === '/weChat/bookBox'" :badge="badge">
          <img slot="icon" src="./img/tab/7.png">
          <img slot="icon-active" src="./img/tab/8.png">
          <span slot="label">书筐</span>
        </tabbar-item>
        <tabbar-item :link="{path:'/weChat/member/index'}" :selected="route.path === '/weChat/member/index'">
          <img slot="icon" src="./img/tab/5.png">
          <img slot="icon-active" src="./img/tab/6.png">
          <span slot="label">我的</span>
        </tabbar-item>
      </tabbar>
    </view-box>
    <!-- 返回顶部按钮 -->
    <div v-show="isShowTab" class="scrollTop" @click="headerTabClick">
      <img src="./img/ico-top.png" />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import {
  ToastPlugin,
  LoadingPlugin,
  AlertPlugin,
  WechatPlugin,
  AjaxPlugin
} from "vux";
// plugins
Vue.use(ToastPlugin);
Vue.use(AlertPlugin);
Vue.use(WechatPlugin);
Vue.use(AjaxPlugin);
Vue.use(LoadingPlugin);

import {
  Drawer,
  XHeader,
  Tabbar,
  TabbarItem,
  Loading,
  TransferDom,
  ViewBox
} from "vux";
import { mapState, mapActions } from "vuex";
import "@/js/utils";
import bookShop from "views/weChat/bookBox/api/utils";

export default {
  beforeRouteLeave(to, from, next) {
    // 设置下一个路由的 meta
    to.meta.keepAlive = false; // 让 A 缓存，即不刷新
    next();
  },
  name: "App",
  directives: {
    TransferDom
  },
  components: {
    Drawer,
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem,
    Loading
  },
  methods: {
    mainAppMove(event) {
      let that = this;
      if (that.route.path === "/weChat/home/index") {
        let scrollTop = that.$refs.viewBoxBody.getScrollTop();
        if (scrollTop >= 500) {
          that.isShowTab = true;
        } else {
          that.isShowTab = false;
        }
      }
    },
    headerTabClick() {
      let that = this;
      if (this.path === "/weChat/home/index") {
        //首页点击title返回
        let body = document.querySelector("#vux_view_box_body");
        let time = setInterval(req => {
          body.scrollTop -= 150;
          if (body.scrollTop <= 0) {
            clearInterval(time);
            that.isShowTab = false;
          }
        }, 10);
      }
    },
    ...mapActions(["updateDemoPosition"])
  },
  mounted() {
    this.handler = () => {
      if (this.path === "/weChat/home/index") {
        this.box = document.querySelector(".router-view");
        this.updateDemoPosition(this.box.scrollTop);
      }
    };
  },
  beforeDestroy() {
    this.box && this.box.removeEventListener("scroll", this.handler, false);
  },
  watch: {
    path(path) {
      //只有在首页的时候，触发去拉取书框的内容,显示购物车数字
      if (this.route.path == "/weChat/home/index") {
        bookShop.getLocalStoreList(null, this);
      }
      if (path === "/weChat/home/index") {
        setTimeout(() => {
          this.box = document.querySelector(".router-view");
          if (this.box) {
            this.box.removeEventListener("scroll", this.handler, false);
            this.box.addEventListener("scroll", this.handler, false);
          }
        }, 1000);
      } else {
        this.box && this.box.removeEventListener("scroll", this.handler, false);
      }
    }
  },
  computed: {
    ...mapState({
      route: state => state.route,
      path: state => state.route.path,
      deviceready: state => state.app.deviceready,
      demoTop: state => state.vux.demoScrollTop,
      isLoading: state => state.vux.isLoading,
      direction: state => state.vux.direction,
      badge: state => state.vux.badge
    }),
    isTabbar() {
      this.isShowTab = false;
      //是否显示地步导航
      if (this.route.path === "/weChat/member/address") return true; //地址管理
      //if (this.route.path === "/weChat/home/search") return true; //搜索结果
      //if (this.route.path === "/weChat/home/details") return true; //搜索结果
      let isShowbookShop = bookShop.getLocalStoreList(null, this);
      if (this.route.path === "/weChat/bookBox" && isShowbookShop.length > 0)
        return true; //书框
      if (this.route.path === "/weChat/member/orderDetails") return true; //订单详情
      //if (this.route.path === "/weChat/member/wholeTab") return true; //全部
      if (this.route.path === "/weChat/member/historyBook") return true; //借阅书单
      if (this.route.path === "/weChat/member/membershipCard") return true; //购买会员
      if (this.route.path === "/weChat/member/membershipCardDetail")
        return true; //购买会员详情
      if (this.route.path === "/weChat/member/contactUs") return true; //联系我们页面
      if (this.route.path === "/weChat/member/checkoutSuccess") return true; //订单成功页面
      if (this.route.path === "/weChat/member/returnBook") return true; //我要还书

      if (this.route.path === "/weChat/member/registerAred") return true; //从活动页面进入 ->完上会员信息页面

      if (this.route.path === "/active/sowingMap") return true; //活动页面
      return /tabbar/.test(this.route.path);
    },
    viewTransition() {
      if (!this.direction) return "";
      return "vux-pop-" + (this.direction === "forward" ? "in" : "out");
    }
  },
  data() {
    return {
      drawerVisibility: false,
      showMode: "push",
      showModeValue: "push",
      showPlacement: "left", //面板显示的位置
      showPlacementValue: "left",

      isShowTab: false
    };
  },
  created() {}
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
@import "~vux/src/styles/1px.less";
@import "~vux/src/styles/tap.less";

html,
body {
  /* height: 100%;
  width: 100%;
  overflow-x: hidden; */
  background-color: #f4f3f0 !important;
}

.mainApp {
  height: 100%;
  .app-logo {
    background: #35495e;
    background-size: 78%;
    width: 100%;
    display: block;
    height: 80px;
  }
  .vux-header {
    background: #6f763f;
    border-top: 1px solid #7b814f;
  }
  .header {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
  }
  .headerMenu {
    fill: #fff;
    position: relative;
    top: -8px;
    left: -3px;
  }
  .weui-tabbar__icon {
    span {
      font-size: 12px;
    }
    img {
      height: 86%;
    }
  }
  .menu-list {
    ul {
      border-top: 1px solid #55616f;
      border-bottom: 1px solid #55616f;
      padding-left: 6px;
      li {
        height: 40px;
        margin-left: 6px;
        line-height: 40px;
        color: #cccccc;
        font-size: 13px;
        position: relative;
        border-bottom: 1px solid rgba(66, 80, 95, 0.8);
        &:after {
          content: "\E6B9";
          position: absolute;
          right: 9px;
          display: inline-block;
          border: 1px solid #9a9a9a;
          color: #dddddd;
          font-size: 12px;
          height: 12px;
          top: 9px;
          width: 12px;
          text-align: center;
          line-height: 12px;
        }
        ul {
          display: none;
          border-top: none;
        }
        &:last-child {
          border-bottom: none;
        }
      }
      .active {
        &:after {
          content: "-";
        }
        ul {
          display: block;
          li {
            &:after {
              content: "\e735";
              border: none;
              font-size: 18px;
              top: 12px;
            }
          }
        }
      }
    }
  }

  /*动画*/

  .router-view {
    width: 100%;
  }
  .vux-badge-single {
    font-size: 12px !important;
    position: relative;
    top: 7px;
    left: -2px;
  }
  .vux-pop-out-enter-active,
  .vux-pop-out-leave-active,
  .vux-pop-in-enter-active,
  .vux-pop-in-leave-active {
    will-change: transform;
    transition: all 300ms;
    height: 100%;
    position: absolute;
    backface-visibility: hidden;
    perspective: 1000;
  }
  .vux-pop-out-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .vux-pop-out-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .vux-pop-in-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .vux-pop-in-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .menu-title {
    color: #888;
  }

  .scrollTop {
    cursor: pointer;
    display: block;
    position: absolute;
    border: 1px solid #ffffff;
    background: #f4f3f0;
    background-size: 100%;
    border-radius: 5px;
    z-index: 10000;
    width: 40px;
    bottom: 70px;
    right: 16px;
    height: 40px;
    -webkit-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
    img {
      width: 40px;
      cursor: pointer;
      height: 40px;
      border-radius: 5px;
    }
  }
}
</style>