<!--地址管理-->
<template>

  <div class="address iconfont" ref="addressListRef">
    <div class="itemList">
      <article v-if="dataList.length>0" class="item-list" v-for="(v,i) in dataList">
        <section>
          <div class="phone">
            <span>{{v.name}}</span>
            <span>{{v.phone}}</span>
          </div>
          <div class="addressDetails">{{v.address}}</div>
          <div>
            <checklist :options="[{key:v.addrid,inlineDesc:'默认地址'}]" class="checkBox" :disabled="i==0 && v.activeFlag ==1" :max="1" v-model="inlineDescListValue" @change.native="change(v.addrid)"></checklist>
            <!-- <check-icon :value.sync="v.activeFlag"> </check-icon> -->
            <span class="upd-del">
              <router-link tag="label" class="icon-edit" :to="{ path: '/weChat/member/addAddress',query:{_title:'编辑地址',info:encodeURIComponent(JSON.stringify(v))}}">编辑</router-link>
              <label class="icon-delete" @click="isDelTab(v.addrid)">删除</label>
            </span>
          </div>
        </section>
      </article>
      <router-link tag="article" class="btns" :to="{ path: '/weChat/member/addAddress' }">
        <i class="icon-btn"></i>
        <button type="button">新建地址</button>
      </router-link>
    </div>

    <actionsheet v-show="isDelShow" v-model="isDelShow" :menus="menus1" @on-click-menu="onDelete" show-cancel>
      <p slot="header">
        <span class="delStyle">删除后就无法撤消了哦</span>
      </p>
    </actionsheet>

  </div>
</template>

<script>
import { Checklist, Actionsheet } from 'vux';
import api from './api';

export default {
  components: {
    Checklist,
    Actionsheet
  },
  created() {
    this.getAddressList();
  },
  data() {
    return {
      dataList: [],
      isActiveFlag: false, //选择框
      inlineDescListValue: [],
      isDelShow: false, //是否显示删除提示框
      delAddrid: "",//删除id
      menus1: {
        del: "<span class='red'>删除</span>",
      }
    }
  },
  methods: {
    change(val) {
      if (val == this.inlineDescListValue[0]) {
        let source = this.$store.state.route.query.source || "";
        if (source == "orderDetails") {//表示从订单详情过来的
          window.history.back();
        }
        return false;
      }

      if (val) {
        api.defaultAddress(val, req => {
          if (req.code == 200) {
            this.getAddressList();
            this.$vux.toast.show({
              text: '操作成功',
              position: "position"
            })
          }
        })
        let source = this.$store.state.route.query.source || "";
        if (source == "orderDetails") {//表示从订单详情过来的
          window.history.back();
        }
      }
    },
    getAddressList() {
      api.getAddressList(data => {
        if (data.code == 200) {
          data && data.data.map(req => {
            req.isActiveFlag = req.activeFlag == 1 ? true : false;
            if (req.activeFlag == 1) {
              this.inlineDescListValue = [];
              this.inlineDescListValue.push(req.addrid);
            }
          })
          let aaa = data.data.filter(req2 => {
            return req2.activeFlag == 1;
          });
          let bbb = data.data.sort((a, b) => {
            return b.addrid - a.addrid
          }).filter(req2 => {
            return req2.activeFlag != 1;
          });

          let list = aaa.concat(bbb);
          this.dataList = [...list];
        }
      });
    },
    defaultTabAddress(val) {
      console.log(val)
    },
    isDelTab(val) {
      this.isDelShow = !this.isDelShow;
      this.delAddrid = val || "";
    },
    onDelete(name) {
      if (name === "del") {
        // 显示文字
        api.delAddress(this.delAddrid, req => {
          if (req.code == 200) {
            this.$vux.toast.show({
              text: '删除成功',
              position: "position"
            })
            this.getAddressList();
          }
        })

      }
    },
  },
  mounted() {
    if (this.dataList.length > 0) {
      //this.$refs.addressListRef.style.height = (window.screen.availHeight - 165) + "px";
      //this.$refs.addressListRef.style.minHeight = (window.screen.availHeight - 165) + "px";
    } else {
      // this.$refs.addressListRef.style.height = "100%";
    }
  },
}
</script>
<style lang="less">
body {
  background: #f1f2f6 url(./img/back2.png) no-repeat center center;
  background-size: 100% 100%;
}

.address {
  overflow: hidden;
  height: 100%;
  .flex {
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
  }
  .itemList {
    height: 100%;
    overflow: auto;
  }
  .item-list {
    background: #ffffff;
    margin: 0 auto;
    padding: 12px 0 0;
    margin: 12px;
    section {
      padding: 0 12px;
      div {
        font-size: 12px;
        color: #222222;
        padding: 4px 0;
        &:last-child {
          height: 40px;
          line-height: 30px;
          margin-left: -6px;
          position: relative;
          .upd-del {
            position: absolute;
            right: 0;
            top: 10px;
          }
          label {
            font-size: 13px;
            margin-right: 16px;
            &:before {
              font-size: 17px;
              margin-right: 3px;
            }
            &:first-child {
              &:before {
                font-size: 20px;
                position: relative;
                top: 3px;
              }
            }
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
      .phone {
        color: #000000;
        font-size: 16px;
      }
      .addressDetails {
        border-bottom: 1px solid #e8e8e8;
        line-height: 22px;
        font-size: 13px;
        padding-top: 0;
        padding-bottom: 12px;
      }
    }
  }
  .btns {
    display: block;
    width: 100%;
    padding: 0 0 20px;
    .icon-btn {
      background: url(./img/iconBtn.png) no-repeat center center;
      width: 74px;
      height: 74px;
      text-align: center;
      margin: 0 auto;
      display: block;
      background-size: 50%;
    }
    button {
      margin: 0 auto;
      color: #000000;
      background: unset;
      border: none;
      display: block;
      font-size: 16px;
      margin-top: -11px;
    }
  }
  .red {
    color: red;
  }
  .delStyle {
    color: #666;
    font-size: 14px;
  }
  .checkBox {
    width: 60%;
    div {
      padding: 0 !important;
    }
    .weui-cells {
      &:before,
      &:after {
        border: none;
      }
      label {
        .weui-cell__hd {
          margin-top: -11px;
          margin-right: 6px;
        }
      }
      .weui-cell {
        padding: 0;
        text-indent: 4px;
      }
    }
  }
  .weui-actionsheet {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #efeff4;
    z-index: 1001;
    height: auto;
    -webkit-transition-property: -webkit-transform;
    transition-property: -webkit-transform;
    transition-property: transform;
    transition-property: transform, -webkit-transform;
    -webkit-transition-duration: 300ms;
    transition-duration: 300ms;
    max-height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .weui-cells_checkbox {
    &:before,
    &:after {
      border: none;
    }
  }
}

</style>