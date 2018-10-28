<!--搜索结果-->

<template>
  <div class="home searchList">
    <article class="hotBook" v-if="dataList.length>0">
      <scroller lock-x scrollbar-y use-pullup :pullup-config="pullupConfig2" :height="demo2Hegiht" ref="demo2" @on-pullup-loading="load2" scroll-bottom-offset='80'>
        <article>
          <section v-for="(v,i) in dataList" :key="i">
            <code @click="tabClick(v)">
              <p class="imgProcessing">
                <img-lazy :imgUrl="URL+[v.bookBaseInfo.headImage.split(',')[0]]" height="160px" />
              </p>
              <span class="ellipsis">{{v.bookBaseInfo.name}}</span>
              <label class="ellipsis" style="height:20px;line-height:20px">{{v.bookBaseInfo.introduction || ' '}}</label>
            </code>
            <div>
              <i :class="v.watch?'icon-shoucang1 red':'icon-shoucang'" @click="tabCollection(v.bookBaseInfo.id)"></i>
              <i class="icon-gouwuche" @click="tabShopping(v)"></i>
            </div>
          </section>
        </article>
      </scroller>
    </article>
    <no-data v-if="dataList.length<=0"></no-data>
    <parabola ref="parabola"></parabola>
  </div>
</template>

<script>
import NoData from "components/common/noData";
import coll from "../../collection/api/utils";
import bookShop from "../../bookBox/api/utils";

import parabola from "components/common/parabola";

import { Scroller } from "vux";

export default {
  beforeRouteLeave(to, from, next) {
    // 设置下一个路由的 meta
    to.meta.keepAlive = false; // 让 A 缓存，即不刷新
    next();
  },
  deactivated() {
  },
  name: "homeSearch",
  data() {
    return {
      URL: utils.url.curr,
      dataList: [],
      //分页条件
      refreshInfo: {
        noFlag: false,
        pageSize: 20, //一页20条
        currIndex: 0 //第一页开始
      },
      pullupConfig2: {
        content: "上拉加载更多",
        downContent: "松开进行加载",
        upContent: "上拉加载更多",
        loadingContent: "加载中..."
      }
    };
  },
  watch: {
    "$store.state.getSearchList.list": function(data) {
      let that = this;
      //关闭loadding
      that.$vux.loading.hide();
      data &&
        data.map(req => {
          that.dataList.push(req);
        });
      if (data.length < that.refreshInfo.pageSize) {
        that.refreshInfo.noFlag = true;
        setTimeout(() => {
          that.$vux.loading.hide();
          that.$refs.demo2.disablePullup();
        }, 10);
      } else {
        that.refreshInfo.noFlag = false;
        that.refreshInfo.currIndex++;
      }
    }
  },
  components: {
    NoData,
    parabola,

    Scroller,
    "img-lazy": require("components/common/lazyloadImg").default
  },
  computed: {
    demo2Hegiht() {
      //return window.screen.availHeight - 140;
      return "93vh";
    }
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    load2() {
      let that = this;
      setTimeout(() => {
        //首次数据不足分页的条数的时候，不进行拉取数据
        if (that.dataList.length >= that.refreshInfo.pageSize) {
          this.getList();
        }

        setTimeout(() => {
          that.$vux.loading.hide();
          that.$refs.demo2.donePullup();
        }, 100);
        if (this.refreshInfo.noFlag) {
          // unload plugin
          setTimeout(() => {
            that.$refs.demo2.disablePullup();
          }, 10);
        }
      }, 50);
    },
    onInfinite(end) {
      this.refreshInfo.currIndex++;
      this.getList();
      end();
    },
    onRefresh(end) {
      this.refreshInfo.currIndex = 0;
      //上啦数据
      this.getList();
      end();
    },

    getList() {
      //显示loadding
      this.$vux.loading.show({
        text: "加载中"
      });

      let value = localStorage.searchVal || "";
      this.$store.dispatch("getSearchList", {
        name: value,
        refreshInfo: this.refreshInfo
      });
    },
    tabCollection(val) {
      //收藏
      coll.tabCollection(val, event);
    },
    tabShopping(item) {
      //购物车
      let flag = bookShop.tabShopping(item, this);
      if (flag) {
        this.$refs.parabola.drop(event.target);
      }
    },
    tabClick(item) {
      localStorage.searchListDetails = JSON.stringify(item);
      this.$router.push({
        path: "/weChat/home/details",
        query: {
          _title: item.bookBaseInfo.name,
          detailId: item.bookBaseInfo.id
        }
      });
    }
  }
};
</script>
<style lang="less">
@import url("../less/index");
.searchList {
  background: #f7f4f0;
  .ellipsis2 {
    width: 93%;
    display: -webkit-box !important;
  }
  .hotBook {
    margin: 0 auto;
    .imgProcessing {
      max-height: 160px;
      width: 90%;
      margin: 0 auto;
      height: 90%;
      margin-top: 6px;
      text-align: center;
      background: #ffffff;
      img {
        max-height: 160px;
        width: 100%;
      }
    }
    article section {
      div {
        height: 38px;
      }
      label {
        line-height: 16px;
      }
    }
    .xs-plugin-pullup-container {
      padding-bottom: 20px;
      font-size: 12px;
      bottom: -70px !important;
    }
  }
  .red {
    color: red;
  }
}
</style>