/** * 图片懒加载 * 2017-05-31 * yubai8 */
<template>
  <p class="imgLazy"
    :style="{ height: height}">
    <img @error="errorImg"
      v-lazy.container="imgUrl" />
  </p>
</template>
<style lang="less" scoped>
@import url('./less/index');
</style>
<script>
import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import loadding from './img/loadding.gif'
import errors from './img/error.png'
Vue.use(VueLazyload, {
  preLoad: 1, //预装高度的比例
  attempt: 1, //尝试计数
  loading: loadding,
  error: errors,
  adapter: {
    loaded(listender, Init) {
      if (listender) {
        listender.el.style.width = '90%'
        listender.el.style.height = '90%'
      }
    },
    loading(listender, Init) {
      if (listender) {
        listender.el.style.width = '32px'
        listender.el.style.height = '25px'
      }
    },
    error(listender, Init) {
      if (listender) {
        //listender.el.parentNode.style.backgroundColor = "#999999";
        //listender.el.style.width = "200px";
        //listender.el.style.height = this.height;
      }
    }
  }
})
export default {
  props: ['imgUrl', 'height'],
  methods: {
    errorImg(event) {
      event.target.src = utils.url.curr + 'img/xiaobao.jpeg'
    }
  }
}
</script>
<style lang="less">
.imgLazy {
  margin: 12px;
  margin-top:16px;
  margin-bottom:0px;
  text-align: center;
  background-color: #ffffff !important;
}
</style>
