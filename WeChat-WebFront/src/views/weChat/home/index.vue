<!--首页-->
<template>
  <div class="home iconfont">
    <search placeholder="书名、作者、出版商" :autoFixed="true" @result-click="resultClick" v-model="value" position="absolute" :results="results" auto-scroll-to-top @on-focus="onFocus" @on-cancel="onCancel" @on-submit="onSubmit" ref="search"></search>
    <swiper auto loop :show-desc-mask="false" :list="imgCarousel.imgList" v-model="imgCarousel.img_index" @on-index-change="img_onIndexChange" @on-click-list-item="homeItemClick"></swiper>

    <article class="typeStage">
      <article>
        <section v-for="(v,i) in typeStateList" :key="i" @click="labelClick(v.title,v.value)">
          <img :src="URL+'img/home/'+v.value+'.gif'" />
          <span>{{v.title}}</span>
        </section>
      </article>
    </article>
    <article class="ageStage">
      <article>
        <section @click="ageClick('0-3')">
          <img src="./img/home/age/0-3.png" />
        </section>
        <section @click="ageClick('6-9')">
          <img src="./img/home/age/6-9.png" />
        </section>
        <section @click="ageClick('3-6')">
          <img src="./img/home/age/3-6.png" />
        </section>
        <section @click="ageClick('9-12')">
          <img src="./img/home/age/9-12.png" />
        </section>
      </article>
    </article>
    <article class="ageStage famousBook">
      <article>
        <section @click="labelClick('小猪佩奇')">
          <img src="./img/xiaozhupeiqi.png" />
          <span>小猪佩奇</span>
        </section>
        <section @click="labelClick('托马斯')">
          <img src="./img/tuomasi.png" />
          <span>托马斯</span>
        </section>
        <section @click="labelClick('spot')">
          <img src="./img/spot.png" />
          <span>spot</span>
        </section>
        <section @click="labelClick('小猪小象')">
          <img src="./img/xiaozhuxiaoxiang.png" />
          <span>小猪小象</span>
        </section>
        <section @click="labelClick('彼得兔')">
          <img src="./img/bidetu.png" />
          <span>彼得兔</span>
        </section>
        <section @click="labelClick('maisymouse')">
          <img src="./img/maisymouse.png" />
          <span>maisymouse</span>
        </section>
        <section @click="labelClick('小马宝莉')">
          <img src="./img/xiaobaomali.png" />
          <span>小马宝莉</span>
        </section>
        <section @click="labelClick('漫威')">
          <img src="./img/manwei.png" />
          <span>漫威</span>
        </section>
      </article>
    </article>
    <article class="ageStage hotBook">
      <article v-if="hotList.length>0">
        <section v-for="(data,i) in hotList" :key='i'>
          <code @click="tabClick(data)">
            <img-lazy :imgUrl="URL+[data.bookBaseInfo.headImage && data.bookBaseInfo.headImage.split(',')[0]]" height="160px" />
            <span class="ellipsis" style="line-height:20px">{{data.bookBaseInfo.name || ' '}}</span>
            <label class="ellipsis" style="height:20px;line-height:20px">{{data.bookBaseInfo.introduction || ' '}}</label>
          </code>
          <div>
            <i :class="data.watch?'icon-shoucang1 red':'icon-shoucang'" @click="tabCollection(data.bookBaseInfo.id)"></i>
            <i class="icon-gouwuche" @click="tabShopping(data)"></i>
          </div>
        </section>
      </article>
      <p align="center" v-if="hotList.length<=0" style="margin-top: 30px;">
        <spinner type="android" style="stroke: #9fa974;"></spinner>
      </p>
    </article>
    <!-- 抛物线 -->
    <parabola ref="parabola"></parabola>
  </div>
</template>

<script>
import { Search, Swiper, Group, Cell, XButton, Spinner } from "vux";
import api from "./api";
import coll from "../collection/api/utils";
import bookShop from "../bookBox/api/utils";

import parabola from "components/common/parabola";

export default {
  beforeRouteLeave(to, from, next) {
    // 设置下一个路由的 meta
    to.meta.keepAlive = false; // 让 A 缓存，即不刷新
    next();
  },
  name: "homeIndex",
  components: {
    Search,
    Group,
    Cell,
    Swiper,
    XButton,
    "img-lazy": require("components/common/lazyloadImg").default,
    parabola,
    Spinner
  },

  created() {
    this.getList();
    document.body.style.backgroundColor = "#ffffff";
  },
  data() {
    return {
      URL: utils.url.curr,
      results: [], //搜索结果
      value: "",
      //图片列表
      imgCarousel: {
        imgList: [
          /* {
            id: 1,
            img: utils.url.curr + 'img/active/active01.jpg',
            title: '招募小读者',
          }, */
          /* {
            id: 2,
            img: utils.url.curr + 'img/active/active02.jpg',
            title: '招募志愿者',
          }, */
          {
            id: 3,
            img: utils.url.curr + "img/active/active03.jpg",
            title: "您身边的美国社区图书馆"
          },
          {
            id: 4,
            img: utils.url.curr + "img/active/active04.jpg",
            title: "400平米图书馆场地免费用"
          },
          {
            id: 5,
            img: utils.url.curr + "img/active/active05.jpg",
            title: "寻找文化必要分子"
          }
        ], //轮播图列表
        img_index: 0 //轮播图的索引
      },
      hotList: [], //热门图书集合
      refreshInfo: {
        noFlag: false,
        pageSize: 20, //一页20条
        currIndex: 0 //第一页开始
      },
      typeStateList: [
        {
          title: "中文",
          value: "1"
        },
        {
          title: "英文",
          value: "2"
        },
        {
          title: "书单",
          value: "3"
        },
        {
          title: "杂志",
          value: "4"
        },
        {
          title: "其他语言",
          value: "5"
        },
        {
          title: "有声读物",
          value: "6"
        },
        {
          title: "名师大家",
          value: "7"
        },
        {
          title: "新书到店",
          value: "8"
        }
      ]
    };
  },
  methods: {
    homeItemClick(val) {
      this.$router.push({
        path: "/active/sowingMap",
        query: {
          imgIndex: val.id
        }
      });
    },
    ageClick(val) {
      this.$router.push({
        path: "/weChat/home/search",
        query: {
          _title: val + "岁",
          type: "age",
          ageValue: val || "0-9" //默认0-9岁
        }
      });
    },
    labelClick(val, classVal) {
      if (classVal && classVal == 4) {
        //4 表示杂志
        this.$router.push({
          path: "/weChat/home/classList",
          query: {
            _title: val,
            value: val || "" //默认
          }
        });
      } else {
        this.$router.push({
          path: "/weChat/home/search",
          query: {
            _title: val,
            type: "label",
            nameValue: val || "" //默认
          }
        });
      }
    },
    tabClick(item) {
      //获取父类的滚动事件，设置滚动距离
      if (this.$parent.getScrollTop){
        this.$route.meta.top = this.$parent.getScrollTop();
      }

      localStorage.searchListDetails = JSON.stringify(item);
      this.$router.push({
        path: "/weChat/home/details",
        query: {
          _title: item.bookBaseInfo.name,
          detailId: item.bookBaseInfo.id
        }
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
    getList() {
      api.getHotBooks(
        {
          pageSize: 100,
          currIndex: 0
        },
        req => {
          //热门图书
          this.hotList = req;
        }
      );
    },
    ageTabClick(event) {
      //年龄分段点击事件
      let tar = event.target;
      let HTML = tar.innerText;
      localStorage.searchVal = HTML || "";
      this.$router.push({
        path: "/weChat/home/search",
        query: {
          _title: HTML
        }
      });
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
    onFocus() {
      this.getResult();
    },
    onCancel() {},
    //轮播图
    img_onIndexChange(index) {
      this.imgCarousel.img_index = index;
    }
  }
};
</script>

<style lang="less">
@import "./less/index";
.home {
  background: #f7f4f0;
  .vux-swiper {
    height: auto !important;
    padding-top: 50%;
  }
  .hotBook {
    margin-bottom: 0;
  }
  .typeStage {
    article {
      padding: 5px 0 5px;
      margin: 5px auto;
      section {
        padding: 5px 0 0;
      }
    }
    img {
      width: 50% !important;
    }
  }
  .ageStage {
    margin-bottom: 5px;
    padding: 5px 0 1px;
    article {
      margin: 2px 10px 2px;
    }
    section {
      img {
      }
    }
  }
}
</style>