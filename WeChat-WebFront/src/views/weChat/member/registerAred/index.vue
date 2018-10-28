<!--立即领取 ->从活动页面进入-->
<template>
  <div class="register">
    <header>
      <div>感谢您对小宝图书馆的信任和支持！</div>
      <div>填写以下信息即可申请在开业期间免费体验一天。</div>
      <div>2018年9月19日截止领取喔～</div>
    </header>
    <div v-for="v in addForm"
      class="parentForm">
      <article class="form">
        <x-input title="昵称"
          class="nickName"
          v-model.trim="userInfo.wpInfo.nickname"
          placeholder="昵称"
          disabled>
          <div slot="restricted-label"
            class="leftBorder"></div>
        </x-input>
        <x-input title="姓名"
          class="nickName"
          v-model.trim="v.babyName"
          placeholder="请输入宝宝大名"
          is-type="china-name"
          required>
          <div slot="restricted-label"
            class="leftBorder"></div>
        </x-input>
        <x-input title="电话"
          class="nickName"
          v-model.trim="v.cellphone"
          mask="999 9999 9999"
          placeholder="提交后不可修改"
          :max="13"
          is-type="china-mobile"
          required>
          <div slot="label">*电话</div>
          <div slot="restricted-label"
            class="leftBorder"></div>
        </x-input>
        <!-- <x-input title="邮箱" class="nickName" v-model.trim="v.email" placeholder="邮箱" is-type="china-mobile" required></x-input> -->
        <popup-radio title="性别"
          class="nickName"
          v-model="v.babyGender"
          :options="sexList"></popup-radio>
        <datetime title="宝宝生日"
          class="nickName"
          v-model="v.babyBirth"
          min-year='1900'
          :max-year='currDate'></datetime>
      </article>
    </div>
    <section>
      <div>
        <check-icon class="registerCheckbox"
          :value.sync="isCheckBoxPro">
        </check-icon>
        <span class="registerCheckbox-details"
          @click="xieyixuzhi">已阅读并同意小宝图书馆会员协议及须知</span>
      </div>

      <div v-transfer-dom>
        <x-dialog v-model="showDialogStyle"
          hide-on-blur
          :dialog-style="{'max-width': '90%', width: '90%', 'background-color': '#ffffff', verflow: 'hidden',
    'overflow-y': 'auto'}">
          <p style="color:#fff;text-align:center;"
            @click="showDialogStyle = false">
            <p aclign="center"
              style="height:40px;line-height:40px;border-bottom:1px solid #9fa974;font-size:15px;color:#000000;">
              小宝图书馆会员协议及须知
              <x-icon type="ios-close-outline"
                @click="showDialogStyle = false"
                style="fill:#9fa974;right:16px;top:7px;position:absolute;">关闭</x-icon>
            </p>
            <Agreement></Agreement>
          </p>
        </x-dialog>
      </div>
    </section>
    <!-- <section class="addBoby" @click="addBaby">我有多个宝宝，添加宝宝信息 +  </section> -->
    <x-button class="btns"
      type="primary"
      :disabled="!isCheckBoxPro"
      @click.native="submitMembershipCard">立即领取</x-button>
    <div class="describe">请放心，我们会妥善保管您的个人信息。手机号码作为您到店入场时快速查询会员信息的依据。填写宝宝信息，我们将在宝宝生日时送上一份惊喜。</div>
  </div>
</template>

<script>
import Agreement from './agreement'
import {
  XInput,
  Group,
  XButton,
  Cell,
  PopupRadio,
  Datetime,
  AlertModule,
  CheckIcon,
  XDialog,
  TransferDomDirective as TransferDom
} from 'vux'
import api from './api'
import memberApi from '../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    XInput,
    XButton,
    Group,
    PopupRadio,
    Datetime,
    Cell,
    CheckIcon,
    XDialog,
    Agreement
  },
  created() {
    memberApi['getUserInfo'](req => {
      if (req.code == 200) {
        this.userInfo = req.data
        let form = this.userInfo.member
        let { addForm } = this

        addForm.map(req => {
          req.babyName = form.babyName || ''
          req.babyGender = form.babyGender && form.babyGender.toString()
          req.cellphone = form.cellphone || ''
          req.babyBirth = utils.date.timeToStr(
            form.babyBirth || new Date(),
            'YYYY-MM-dd'
          ) //出身日期
        })
      }
    })
  },
  data() {
    return {
      URL: utils.url.curr,
      currDate: utils.date.timeToStr(new Date(), 'yyyy'), //当前年份
      userInfo: {},
      sexList: [
        {
          key: '1',
          value: '男'
        },
        {
          key: '2',
          value: '女'
        }
      ],

      addForm: [
        {
          nickname: '', //微信的昵称
          babyName: '', //小孩名字
          babyGender: '1', //性别
          cellphone: '', //电话
          email: '', //邮箱
          babyBirth: utils.date.timeToStr(new Date(), 'YYYY-MM-dd'), //出身日期
          inviteCode: '' //邀请码，后期可能需要
        }
      ],
      isCheckBoxPro: false,
      showDialogStyle: false
    }
  },
  methods: {
    xieyixuzhi() {
      this.showDialogStyle = true
    },
    submitMembershipCard() {
      let that = this
      const { addForm } = this
      let message = ''
      for (let i = 0; i < addForm.length; i++) {
        let item = addForm[i]
        if (!item.babyName) {
          message = '姓名不能为空'
          break
        }
        if (!item.babyGender) {
          message = '性别不能为空'
          break
        }

        if (!item.cellphone) {
          message = '手机号不能为空'
          break
        }
        item.cellphone = item.cellphone.replace(/\s|\xA0/g, '')
        if (!/^[1][34578][0-9]{9}$/.test(item.cellphone)) {
          message = '手机号格式错误'
          break
        }
        if (!item.babyBirth) {
          message = '出生日期不能为空'
          break
        }
      }
      if (message) return utils.toast(message)

      let form = addForm[0]

      api.registeredMember(
        {
          name: form.babyName,
          gender: form.babyGender,
          birth: new Date(form.babyBirth).getTime(),
          phone: form.cellphone,
          type: '2' //表示从最外面的入口进入
          //email: form.email,
        },
        req => {
          if (req.code == 200) {
            return that.$vux.alert.show({
              title: '恭喜',
              content: '恭喜您！获得阅读劵一张',
              onShow() {},
              onHide() {}
            })
          } else if (req.code == 30004) {
            return that.$vux.alert.show({
              title: '提示信息',
              content: req.message,
              onShow() {},
              onHide() {}
            })
          }
        }
      )
    },
    addBaby() {
      this.addForm.push({
        nickname: '', //微信的昵称
        babyName: '', //小孩名字
        babyGender: '1', //性别
        cellphone: '', //电话
        email: '', //邮箱
        babyBirth: utils.date.timeToStr(new Date(), 'YYYY-MM-dd'), //出身日期
        inviteCode: '' //邀请码，后期可能需要
      })
    }
  }
}
</script>

<style lang="less">
body {
  background: #f4f4f5 url('./img/back.png') no-repeat center center;
  background-size: 100% 116%;
}
.register {
  header {
    padding: 16px 0;
    background: #ffffff;
    text-align: center;
    div {
      text-align: left;
      color: #222222;
      font-size: 14px;
      margin-left: 16px;  
    }
  }
  .addBoby {
    text-align: center;
    font-size: 14px;
    color: #999999;
    margin-top: 20px;
    cursor: pointer;
  }
  .parentForm {
    border-top: 1px solid #e8e8e8;
    .form {
      margin: 12px;
      .nickName {
        background: #ffffff;
        margin-bottom: 8px;
        color: #999999;
        font-size: 14px;
      }
      .hr {
        border-top: 1px solid red;
      }

      .weui-cell {
        &:before {
          border: none;
        }
      }
      label {
        margin: 0 auto;
        font-size: 14px;
      }
      input {
        position: relative;
        top: 1px;
        color: #222222;
      }
      input::-webkit-input-placeholder {
        color: #999999;
        font-size: 13px;
      }

      input:-moz-placeholder,
      textarea:-moz-placeholder {
        color: #666;
        font-size: 13px;
      }
      input::-moz-placeholder,
      textarea::-moz-placeholder {
        font-size: 13px;
        color: #666;
      }
      input:-ms-input-placeholder,
      textarea:-ms-input-placeholder {
        font-size: 13px;
        color: #666;
      }
    }
  }
  .btns {
    width: 80%;
    padding: 4px;
    font-size: 16px;
    margin: 30px auto 20px;
  }
  .describe {
    margin: 32px 16px;
    font-size: 12px;
    color: #999999;
  }
  .weui-cell__hd {
    position: relative;
    padding-right: 10px;
    .leftBorder {
      width: 1px;
      height: 20px;
      border-right: 1px solid #e0e0e0;
      position: absolute;
      top: 50%;
      right: 11px;
      transform: translateY(-50%);
    }
  }
  .registerCheckbox {
    text-indent: 5px;
    margin-top: 5px;
  }
  .registerCheckbox-details {
    font-size: 13px;
    color: blue;
    position: relative;
    top: -3px;
    text-decoration: underline;
  }
  .vux-check-icon > .weui-icon-success:before,
  .vux-check-icon > .weui-icon-success-circle:before {
    color: #9fa974;
  }
}
</style>
