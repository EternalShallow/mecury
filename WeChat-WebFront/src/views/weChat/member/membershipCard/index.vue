<!--购买会员卡-->
<template>
  <div class="membershipCard">
    <header class="membershipCard-header">
      <img :src="URL+'img/xiaobao.jpeg'" />
      <div>
        <span>欢迎成为小宝图书馆的读者</span>
        <span>我们愿为孩子播下一颗阅读的种子</span>
        <span>让阅读成为伴随孩子一生的力量</span>
      </div>
    </header>
    <group class="form">
      <article>
        <div class="form-list" v-for="(v,i) in list" @click="pay(v.id)">
          <div class="left">
            <header>{{v.title}}</header>
            <label>{{v.brief}}</label>
            <code></code>
          </div>
          <section>
            <div>
              <span>￥{{v.recvValue && v.recvValue / 100}}</span>
              <code>
                <!-- （5折） -->
              </code>
            </div>
            <div>
              <span>原价:
                <code>￥{{v.needValue / 100}}</code>
              </span>
            </div>
          </section>
        </div>
      </article>
    </group>
  </div>
</template>

<script>
import { Group } from 'vux';
import api from './api';
const allShare = require('@/js/utils/allShare.js').default;

export default {
  components: {
    Group
  },
  created() {
    this.getList();
  },
  data() {
    return {
      URL: utils.url.curr,
      list: [],
    }
  },
  methods: {
    getList() {
      api.getGoodsList(req => {
        if (req.code == 200) {
          this.list = [...req.data];
        }
      });
    },
    pay(val) {
      let that = this;
      this.$vux.loading.show({
        text: '加载中',
        delay: 1e3
      })
      api.payTab(val, req => {
        if (req.code == 200) {
          api.goodBuy(req.data, req1 => {
            if (req1.code == 200) {
              this.$vux.loading.hide();
              allShare.onBridgeReadyPay(req1.data, callback => {
                this.$vux.loading.hide();
                that.$router.push({
                  path: '/weChat/member/register',
                  query: {
                    _title: "完善会员信息",
                  }
                });
              });
            } else {
              this.$vux.loading.hide();
            }
          })
        } else {
          this.$vux.loading.hide();
        }
      })
    },
    /* payTabClick(val) {
        const { list } = this;
        if (list.length > 0) {
            let detail = "";
            for (let i = 0; i < list.length; i++) {
                if (val == list[i].id) {
                    detail = list[i];
                    break;
                }
            }
            detail = encodeURIComponent(encodeURI(JSON.stringify(detail)));
            utils.Cookie.delCookie("payDetails", detail);
            utils.Cookie.setCookie("payDetails", detail);
            this.$router.push({
                path: '/weChat/member/membershipCardDetail',
                query: {
                    _title: "购买会员",
                }
            });
        }

    } */
  }
}
</script>

<style lang="less">
.membershipCard {
  background: #f2efea;
  padding-bottom: 16px;

  &-header {
    background: #ffffff;
    text-align: center;
    position: relative;
    top: 0;
    padding-bottom: 13px;
    img {
      width: 120px;
      height: 120px;
      min-height: 120px;
    }
    div {
      span {
        display: block;
        margin-top: 4px;
      }
      font-size: 14px;
      color: #999999;
    }
  }
  .flex {
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
  }
  .average(@column, @gap) {
    /*关键代码*/
    -moz-column-count: @column;
    -webkit-column-count: @column;
    column-count: @column;
    -moz-column-gap: @gap;
    -webkit-column-gap: @gap;
    column-gap: @gap;
  }

  .inside() {
    /*关键代码*/
    -moz-page-break-inside: avoid;
    -webkit-column-break-inside: avoid;
    break-inside: avoid;
  }
  .form {
    margin-top: -12px;

    .weui-cells {
      &:before,
      &:after {
        border: none;
      }
    }
    .weui-cells__title {
      margin: 0;
      font-size: 14px;
      padding-bottom: 6px;
      background: #ffffff;
    }
    article {
      width: 100%;
      margin: 0 auto;
      background: #f2efea;
      .average(1,"6px");

      header {
        width: 50%;
        padding: 10px;
        padding-left: 0;
        font-size: 16px;
        color: #231815;
      }
      .form-list {
        background: #ffffff url(./img/sunlight.png) no-repeat center center;
        background-size: contain;
        &:last-child {
          margin-bottom: 20px;
        }
        position: relative;
        margin: 0 12px;
        border-radius: 5px;
        margin-top: 12px;
        font-size: 12px;
        color: #999999;
        //background: linear-gradient(90deg, rgb(29, 98, 240), rgb(25, 213, 253));
        //background:linear-gradient(90deg, #e3e5e8, #fffcfc);

        .left {
          width: 62%;
          padding: 0 12px;
          position: relative;
          header {
            width: 100%;
            padding-left: 0;
            padding-right: 0;
          }
          code {
            height: 70%;
            width: 1px;
            border-right: 1px solid #efefef;
            position: absolute;
            right: 0;
            z-index: 999;
            top: 12px;
          }
          label {
            display: block;
            padding: 0 0 12px;
            color: #65605f;
          }
        }
        section {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 30%;
          div {
            .flex;
            span {
              color: #999999;
              text-align: right;
              width: 100%;
              code {
                text-decoration: line-through;
              }
            }
            &:first-child {
              span {
                text-align: right;
                display: block;
                font-size: 22px;
                font-family: Arial, Helvetica, sans-serif;
                color: #231815;
                width: 100%;
              }
              code {
                font-size: 12px;
                margin-top: 15px;
                color: #999999;
              }
            }

            &:last-child {
              text-indent: 8px;
            }
          }
        }
      }
    }
  }
  .btns {
    width: 90%;
    padding: 4px;
    font-size: 16px;
    margin: 30px auto 20px;
  }
  .weui-cells:after {
    border: none;
  }
}
</style>