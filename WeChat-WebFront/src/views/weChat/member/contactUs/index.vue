<!--联系我们-->
<template>
    <div class="contactUs">
        <header>
            <img class="contactUs-previewer-img"
                :src="previewer.list[0].src"
                @click="isImgShow(0)" />
        </header>
        <!-- <article class="customerService">
            <div class="spanCode">客服联系</div>
            <section class="flex qrcode">
                <div><img src="./img/xiaoye.jpg" /></div>
                <div><img src="./img/xiaoshun.jpg" /></div>
            </section>
        </article> -->
        <div v-transfer-dom>
            <previewer :list="previewer.list"
                ref="previewer"
                :options="previewer.options"></previewer>
        </div>
        <group title="常见问题"
            class="commonProblem">
            <section v-for="v in list">
                <cell :title="v.title"
                    is-link
                    :border-intent="false"
                    :arrow-direction="v.flag ? 'up' : 'down'"
                    @click.native="v.flag = !v.flag"></cell>
                <template v-if="v.flag">
                    <cell-box class="details">{{v.value}}</cell-box>
                </template>
            </section>
        </group>
        <article class="phone">
            <div>
                联系我们：<a href="tel:18911208625">189-1120-8625</a>&nbsp;&nbsp;
                <a href="tel:18911195818">189-111-95818</a>
            </div>
        </article>
    </div>
</template>
<script>
import { Cell, Group, CellBox, Previewer, TransferDom } from 'vux'
import api from './js'

import xiaocong from './img/xiaocong.jpg'

export default {
  directives: {
    TransferDom
  },
  components: {
    Cell,
    Group,
    CellBox,
    Previewer
  },
  data() {
    return {
      URL: utils.url.curr,
      showContent002: false,
      list: [],
      previewer: {
        list: [
          {
            src: xiaocong
          }
        ],
        options: {
          getThumbBoundsFn(index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll(
              '.contactUs-previewer-img'
            )[index]
            // get window scroll Y
            let pageYScroll =
              window.pageYOffset || document.documentElement.scrollTop
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect()
            // w = width
            return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    //图片显示
    isImgShow(index) {
      this.$refs.previewer.show(index)
    },
    //列表数据
    getList() {
      let that = this
      api.getQaOnline(req => {
        if (req.code === 200) {
          that.list = []
          let list = []
          req.data.map(item => {
            list.push({
              title: item.question,
              flag: false,
              value: item.answer
            })
          })
          that.list = [...list] || []
        }
      })
    }
  }
}
</script>
<style lang="less">
.contactUs {
  header {
    margin: 0 auto;
    display: block;
    text-align: center;
    margin-top: 24px;
    img {
      border: 1px solid #efefef;
      width: 130px;
      height: 160px;
    }
  }
  .customerService {
    .spanCode {
      text-align: center;
      padding: 20px 0 17px;
      /* margin-bottom: 15px; */
      color: #222222;
      font-size: 14px;
    }
    .qrcode {
      justify-content: center;
      div {
        border: 1px solid #efefef;
        margin-left: 16px;
        img {
          width: 140px;
          height: 180px;
          min-height: 180px;
        }
      }
    }
  }
  .commonProblem {
    margin-top: 30px;
    font-size: 12px;
    color: #999999;
    section {
      font-size: 14px;
      color: #333333;
      font-family: serif;
      font-weight: normal;
      border-bottom: 1px solid #f1f1f1;
    }
    .weui-cell {
      padding: 16px 15px;
    }
    .details {
      font-size: 12px;
      background: #f4f4f4;
      color: #666666;
      padding: 16px;
      line-height: 20px;
      &::before {
        border: none;
      }
    }
    .weui-cells:after {
      border: none;
    }
  }
  .phone {
    text-align: center;
    position: relative;
   display: block;
    left: 0;
    height: 80px;
    line-height: 80px;
    font-size: 13px;
    a {
      text-decoration: underline;
      color: #5a5ace;
    }
  }
}
</style>
