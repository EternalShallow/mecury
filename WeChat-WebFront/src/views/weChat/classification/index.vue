<!-- 分类 -->
<template>
  <div class="classification">
    <search placeholder="书名、作者、出版商" :autoFixed="true" @result-click="resultClick" v-model="value" position="absolute" :results="results" auto-scroll-to-top @on-focus="onFocus" @on-cancel="onCancel" @on-submit="onSubmit" ref="search"></search>
    <div class="ification">
      <article class="article leftContent">
        <ul ref="leftRef">
          <li v-for="(v,i) in dataList.left" :key="i" @click="setLeftTabClick(v.id)" :data-Id='v.id' :class="activeStyle(v,i)">{{v.name}}</li>
        </ul>
      </article>
      <article class="article rightContent">
        <section v-for="(v,i) in dataList.right" :key='i' @click="itemTabClick(v)">
          <img :src="URL+v.imageUrl" />
          <label class="ellipsis">{{v.name}}</label>
        </section>
      </article>
    </div>
  </div>
</template>
<script>
import { Scroller, Search } from "vux";
import api from "./api";
import { setTimeout } from "timers";
export default {
  beforeRouteLeave(to, from, next) {
    // 设置下一个路由的 meta
    to.meta.keepAlive = false; // 让 A 缓存，即不刷新
    next();
  },
  data() {
    return {
      URL: utils.url.curr,
      results: [], //搜索结果
      value: "",
      dataList: {
        arrList: [],
        left: [],
        right: []
      }
    };
  },
  components: {
    Scroller,
    Search
  },
  watch: {
    "dataList.right": function() {
      setTimeout(() => {
        let see = sessionStorage.getItem("classActive");
        if (see) {
          let liChild = this.$refs.leftRef.children;
          for (let i = 0; i < liChild.length; i++) {
            let aa = liChild[i].getAttribute("data-id");
            if (see == aa) {
              liChild[i].click();
              sessionStorage.classActive = "";
            }
          }
        }
      }, 0);
    }
  },
  computed: {
    activeStyle(v) {
      return function(vv, ii) {
        return ii === 0 ? "active" : "";
      };
    }
  },
  mounted() {},
  created() {
    this.getList();
  },
  methods: {
    //-------------搜索框-------------
    onFocus() {
      this.getResult();
    },
    getResult() {
      let searchList = localStorage.searchList
        ? localStorage.searchList.split(",")
        : [];
      let val = localStorage.searchVal;
      this.results = [];
      for (let i = 0; i < searchList.length; i++) {
        this.results.push({
          title: `${searchList[i]}`,
          other: i
        });
      }
    },
    resultClick(item) {
      this.value = item.title;
      this.$refs.search.setFocus();
    },
    setFocus() {
      this.$refs.search.setFocus();
    },
    onSubmit(val) {
      localStorage.searchVal = val;
      if (localStorage.searchList) {
        let str = localStorage.searchList.indexOf(val);
        if (str < 0) {
          localStorage.searchList += "," + val;
        }
      } else {
        localStorage.searchList = val || "";
      }
      this.$router.push({
        path: "/weChat/home/search",
        query: {
          _title: val
        }
      });

      this.$refs.search.setBlur();
    },
    //-------------搜索框-------end------
    getList() {
      api.getList(req => {
        this.dataList.arrList = req;
        this.setLeftList();
        this.setRightList(this.dataList.arrList[0].id);
      });
    },
    setLeftList() {
      const { dataList } = this;
      dataList.arrList.map(data => {
        this.dataList.left.push({
          name: data.name,
          id: data.id
        });
      });
    },
    setLeftTabClick(id) {
      let tar = event.target;
      let child = tar.parentNode.children;
      for (let i = 0; i < child.length; i++) {
        child[i].classList.remove("active");
      }
      tar.classList.add("active");

      this.setRightList(id);
    },
    setRightList(id) {
      if (id) {
        this.dataList.right = [];
        this.dataList.arrList.map(data => {
          if (data.id == id) {
            data.children.map(req => {
              req.parId = id;
              this.dataList.right.push(req);
            });
          }
        });
      }
    },
    itemTabClick(item) {
      let that = this;
      //店内杂志
      if (item.pathType && item.pathType === "journal") {
        return utils.toast("杂志请到店阅览");
      }
      sessionStorage.classActive = item.parId; //用于切换到另一个页面返回的记忆功能

      localStorage.searchVal = item.name || "";
      this.$router.push({
        path: "/weChat/home/search",
        query: {
          _title: item.name,
          type: "classification",
          data: encodeURIComponent(encodeURI(JSON.stringify(item)))
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.classification {
  height: 100%;

  .ification {
    height: 100%;
    display: -webkit-flex;
    -webkit-flex-flow: row;
    -webkit-align-items: stretch;
    -webkit-justify-content: space-between;
    /*IE10还不支持*/
    display: -ms-flex;
    -ms-flex-flow: row wrap;
    -ms-align-items: stretch;
    -ms-justify-content: space-between;

    display: flex;
    flex-flow: row;
    align-items: stretch;
    justify-content: space-between;
  }
  .leftContent {
    width: 85px;
    background: #f3f3f3 url(./img/left.png) no-repeat center center;
    background-size: 100% 100%;
    height: 94%;
    overflow: hidden;
    overflow-y: auto;
    ul {
      li {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px dashed #ececec;
        font-size: 13px;
        color: #3c3e4d;
        text-align: center;
        font-family: sans-serif;
        /* &:last-child {
          border-bottom: none;
        } */
      }
    }
  }
  .rightContent {
    height: 84%;
    overflow: hidden;
    overflow-y: auto;
    //border-left: 1px solid #efefef;

    background: #ffffff url(./img/right.png) no-repeat center center;
    background-size: 100% 91%;
    width: calc(100% - 86px);
    margin: 0 auto;
    text-align: center;
    padding: 0 6px;
    padding-bottom: 92px;
    section {
      width: 25%;
      height: 100px;
      min-height: 100px;
      text-align: center;
      margin-top: 6px;
      border-radius: 3px;
      /* border: 1px solid #e9e6e6; */
      background: #ffffff;
      float: left;
      margin-left: 3px;
      padding: 8px;
      padding-bottom: 2px;
      img {
        min-width: 55px;
        min-height: 82px;
        width: 85%;
        height: 80%;
        background-size: contain !important;
      }
      label {
        display: block;
        width: 100%;
        height: 25px;
        line-height: 20px;
        font-size: 12px;
      }
    }
  }
  .active {
    background: #ffffff;
    color: #000000;
    border-left: 2px solid #da3d2e;
  }
  //--------------------------------
}
</style>
