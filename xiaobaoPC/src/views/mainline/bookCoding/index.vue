<!-- 图书编码 -->
<template>
  <Form :label-width="80">
    <Card>
      <Row>
        <Col span="6">
        <FormItem label="请输入：">
          <Input ref="bookCoding"
            v-model="formItem.input"
            placeholder="请输入信息"
            autofocus
            @on-keydown="okKeydown"></Input>
        </FormItem>
        </Col>
        <Col span="1">
        <FormItem label-width="20">
          <Button :disabled="!formItem.input"
            type="primary"
            @click="getList">查找</Button>
        </FormItem>
        </Col>
      </Row>
    </Card>
    <Card style="margin-top:6px;">
      <Row>
        本次扫描记录（刷新页面恢复初始数据）：<br/><br/>
        <article class="red">
          <p v-for="(v,i) in formItem.dataList"
            :key="i">{{v}}</p>
        </article>
      </Row>
    </Card>
  </Form>

</template>

<script>
import api from './js/api'
export default {
  data() {
    return {
      formItem: {
        input: '',
        dataList: []
      }
    }
  },
  methods: {
    okKeydown() {
      const e = event || window.event || arguments.callee.caller.arguments[0]
      if (e && e.keyCode == 13) {
        if (this.formItem.input) {
          this.getList()
        }
      }
    },
    getList() {
      const that = this
      api.getListInfo({
        searchName: that.formItem.input || '',
        success(req) {
          if (req.code === 200) {
            that.formItem.dataList.push(that.formItem.input);
            that.formItem.dataList = that.formItem.dataList.reverse();
            that.formItem.input = ''
            that.$refs.bookCoding.focus()
          }
          utils.toast(req.message)
        }
      })
    }
  }
}
</script>

<style lang="less">
.red {
  p {
    color: red;
  }
}
</style>
