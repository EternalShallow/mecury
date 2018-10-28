<!--搜索结果详情-->
<template>
  <div class="home searchDetails">
    <article class="ageStage hotBook">
      <article class="detail">
        <section>
          <img :src="urlCheck" />
          <span style="font-weight:bold;olor: #333333;">{{data.bookBaseInfo && data.bookBaseInfo.name}}</span>
          <span>{{data.bookBaseInfo && data.bookBaseInfo.type?(data.bookBaseInfo.type+'：'):""}}{{data.bookBaseInfo && data.bookBaseInfo.recommendMinAge}} - {{data.bookBaseInfo && data.bookBaseInfo.recommendMaxAge}}岁</span>
          <span>{{data.bookBaseInfo && data.bookBaseInfo.editor}}</span>
          <span>{{data.bookBaseInfo && data.bookBaseInfo.publisher}}</span>
          <div>
            <i :class="data.watch?'icon-shoucang1 red':'icon-shoucang'" @click="tabCollection(data.bookBaseInfo.id)"></i>
            <i class="icon-gouwuche" @click="tabShopping(data)"></i>
          </div>
        </section>
      </article>
    </article>
    <article class="fotter">
      <h3>图书详情</h3>
      <label v-html="introduction"></label>
      <img v-for="(v,i) in contentImage(data.bookBaseInfo.contentImage)" :src="URL+v" v-if="data.bookBaseInfo && data.bookBaseInfo.contentImage && data.bookBaseInfo.contentImage.length>0" :key="i" />
    </article>
  </div>
</template>

<script>
import api from "../searchList/js/api";
import coll from "../../collection/api/utils";
import bookShop from "../../bookBox/api/utils";
export default {
  beforeRouteLeave(to, from, next) {
    this.$destroy && this.$destroy();

    // 设置下一个路由的 meta
    to.meta.keepAlive = true; // 让 A 缓存，即不刷新

    next();

    //设置滚动距离
    if (to.meta.top) {
      let that = this;
      setTimeout(() => {
        that.$parent.scrollTo(to.meta.top);
      }, 0);
    }
  },
  name: "homeDetails",
  data() {
    return {
      URL: utils.url.curr,
      data: {}
    };
  },
  components: {},
  created() {
    let id = this.$store.state.route.query.detailId || "";
    if (id) {
      let list = this.$store.state.getSearchList.list;
      for (let i = 0; i < list.length; i++) {
        if (id == list[i].bookBaseInfo.id) {
          this.data = list[i];
          break;
        }
      }
    }
    if (!this.data.bookBaseInfo) {
      /* let detail = localStorage.searchListDetails;
			if (detail) {
				this.data = detail ? (JSON.parse(detail)).bookBaseInfo : "";
			} else {
				api.getDetails({
					detailsId: id
				}, data => {
					this.data = data.data.bookBaseInfo;
				});
			} */
      api.getDetails(
        {
          detailsId: id
        },
        data => {
          this.data = data.data;
        }
      );
    }
  },
  computed: {
    urlCheck() {
      let str = "";
      let headImage = this.data && this.data.bookBaseInfo;
      if (headImage && headImage.headImage) {
        if (headImage.headImage.indexOf(",") >= 0) {
          str = this.data.bookBaseInfo.headImage.split(",")[0];
        } else {
          str = this.data.bookBaseInfo.headImage;
        }
      }
      return str ? this.URL + str : str;
    },
    introduction() {
      let str = "";
      if (this.data.bookBaseInfo) {
        let introduction = this.data.bookBaseInfo.introduction;
        if (introduction) {
          str = introduction.replace(/\r\n/g, "<br>&nbsp;&nbsp;&nbsp;&nbsp;");
          str = introduction.replace(/\n/g, "<br>&nbsp;&nbsp;&nbsp;&nbsp;");
        }
      }
      return str;
    },
    contentImage(data){
      return function(data){
        let arr = [];
        if(data){
          arr = data.split(',')
        }
        return arr;
      }
    }
  },
  methods: {
    tabCollection(val) {
      //收藏
      coll.tabCollection(val, event);
    },
    tabShopping(item) {
      //购物车
      bookShop.tabShopping(item, this);
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../less/index");
.searchDetails {
  .detail {
    -moz-column-count: 1;
    -webkit-column-count: 1;
    column-count: 1 !important;
    img {
      width: 61% !important;
      height: 220px;
      margin: 0 auto;
      display: block;
    }
    section {
      width: 100% !important;
    }
  }
  .fotter {
    margin: 12px;
    padding-bottom: 20px;
    h3 {
      font-weight: normal;
      font-size: 16px;
      text-align: center;
      padding-bottom: 8px;
      margin-bottom: 12px;
      color: #ff8400;
      border-bottom: 1px solid #ff8400;
    }
    label {
      line-height: 25px;
      font-size: 13px;
      color: #666666;
      text-indent: 24px;
      display: block;
    }
    img {
      width: 100%;
      margin-top: 20px;
    }
  }
  .red {
    color: red;
  }
}
</style>