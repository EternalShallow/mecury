<!--地址管理 - 添加地址-->
<template>
  <div class="addAddress">
    <group class="newConsignee">
      <x-input title="收货人：" v-model="form.name"></x-input>
      <x-input title="联系方式：" v-model="form.phone" keyboard="number" is-type="china-mobile" :max="11"></x-input>
      <x-address title="所在地区：" v-model="form.postNum" :list="addressData" placeholder="请选择地址" :show.sync="showAddress" @on-shadow-change="onShadowChange"></x-address>
      <x-textarea title="详细地址：" v-model="form.address" placeholder="街道、楼牌号等" :show-counter="false" :rows="1" autosize></x-textarea>
    </group>
    <group class="btns">
      <x-button type="warn" @click.native="submitData">保存</x-button>
    </group>
  </div>
</template>

<script>
import { XAddress, Group, XInput, XButton, XTextarea, ChinaAddressV4Data } from 'vux'
import api from '../address/api';
export default {
  components: {
    XAddress,
    XButton,
    XInput,
    Group,
    XTextarea,
    ChinaAddressV4Data
  },
  created() {
    const { form } = this;
    let info = this.$store.state.route.query.info || "";
    info = decodeURIComponent(info);
    if (info) {
      info = JSON.parse(info);
      this.isEditorAdd = true;
      form.name = info.name;
      form.phone = info.phone;
      form.address = info.address;
      form.addrid = info.addrid;
      form.postNum = info.postNum && JSON.parse(info.postNum);//市区
    }

  },
  data() {
    return {
      showAddress: false,
      isEditorAdd: false,//false 新增按钮，true 编辑按钮
      addressData: ChinaAddressV4Data,
      form: {
        postNum: [],//地区邮编
        name: "",//收货人
        phone: "",//联系方式
        address: "",//详细地址
        addrid: "",//update 用到

        province: '',//省
        city: '',//市
        county: '',//区
      }
    }
  },
  methods: {
    onShadowChange(data, req) {
      this.form.province = req[0] || ""
      this.form.city = req[1] || ""
      this.form.county = req[2] || ""
    },
    submitData() {
      //utils.toast("提交成功")
      const { form, isEditorAdd } = this;
      let flag = this.submitCheck();//检查页面是否校验通过
      let editAdd = isEditorAdd ? "updateAddress" : "addAddress";
      if (flag) {
        api[editAdd]({
          ...form,
          postNum: JSON.stringify(form.postNum),
          activeFlag: "2",//activeFlag标识1为默认地址，2为非默认地址
          memo: "",//备注
        }, req => {
          if (req.code == 200) {
            window.history.back();
          } else {
            utils.toast(req.message);
          }
        });
      }
    },
    submitCheck() {
      const { form } = this;
      if (!form.name) { utils.toast("请填写收货人"); return false; }
      if (!form.phone) { utils.toast("请填写联系方式"); return false; }
      if (form.postNum.length <= 0) { utils.toast("请选择地区"); return false; }
      if (!form.address) { utils.toast("请填写详细地址"); return false; }
      return true;
    }
  }
}
</script>

<style lang="less" scoped>
.addAddress {
  .newConsignee {
    .weui-cells {
      margin-top: 0;
    }
    .weui-label {
      font-size: 16px;
      color: #000000;
    }
    .weui-input {
      font-size: 14px;
    }
    .vux-cell-placeholder {
      font-size: 14px;
    }
  }
  .btns {
    padding: 0 15%;
    button {
      background: #de443c;
    }
  }
  .vux-popup-picker-value {
    font-size: 13px;
  }
}
</style>