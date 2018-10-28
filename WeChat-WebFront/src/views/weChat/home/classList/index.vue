<template>
  <article class="classList">
    <section v-for="(v,i) in dataInfo.children"
      :key="i"
      @click="itemTabClick(v)">
      <img :src="URL+v.imageUrl" />
      <label class="ellipsis">{{v.name}}</label>
    </section>
  </article>
</template>

<script>
import api from "../../classification/api/";
export default {
  data() {
    return {
      URL: utils.url.curr,
      dataInfo: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      let that = this;
      //显示loadding
      that.$vux.loading.show({
        text: "加载中"
      });
      api.getList(
        data => {
          that.$vux.loading.hide();
          for (let i = 0; i < data.length; i++) {
            if (data[i].code === "店内杂志") {
              that.dataInfo = data[i];
            }
          }
        },
        error => {
          that.$vux.loading.hide();
        }
      );
    },
    itemTabClick() {
      utils.toast("杂志请到店阅览");
    }
  }
};
</script>

<style lang="less">
.classList {
  height: 84%;
  overflow: hidden;
  overflow-y: auto;

  background: #ffffff url(./img/right.png) no-repeat center center;
  background-size: 100% 100%;
  //width: calc(100% - 86px);
  width: 100%;
  margin: 0 auto;
  text-align: center;
  padding: 0 6px;
  padding-bottom: 92px;
  section {
    width: 28%;
    margin: 0 auto;
    height: 140px;
    min-height: 140px;
    text-align: center;
    margin-top: 6px;
    border-radius: 3px;
    border: 1px solid #f7f7f7;
    //background: #ffffff;
    float: left;
    margin-left: 3px;
    padding: 6px;
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
</style>
