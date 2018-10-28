<template>
  <article>
    <Modal
      v-model="modal1"
      title="修改数据"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form :label-width="80">
        <Card>
          <Row>
            <Col span="10">
            <FormItem label="原始书名：">
              {{ dataInfo.bookname }}
            </FormItem>
          </Col>
            <Col span="10">
            <FormItem label="书名ID：">
              {{ dataInfo.bookid }}
            </FormItem>
          </Col>
          </Row>
          <FormItem label="修改书名：">
            <Input
              v-model="bookId"
              placeholder="请输入书名编号"
              @on-keydown="okKeydown"></Input>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              @click="ok">
              确定修改
            </Button>
          </FormItem>
        </Card>
      </Form>
      <Button
        slot="footer"
        type="primary">关闭</Button>
    </Modal>

  </article>
</template>
<script>
import api from '../js/api';

export default {
  props: {
    dataInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      modal1: false,
      bookId: '',
    };
  },
  created() {
    this.bookId = ''; //设置默认值
  },
  methods: {
    okKeydown() {
      const e = event || window.event || arguments.callee.caller.arguments[0];
      if (e && e.keyCode == 13) {
        this.ok();
      }
    },
    ok() {
      const that = this;
      if (this.bookId) {
        api.editExchangeBook({
          detailid: this.dataInfo.detailid,
          bookid: this.bookId,
          success(req) {
            if (req.code === 200) {
              that.$Message.success('操作成功');
              window.location.reload();
            } else {
              utils.toast(req.message);
            }
          },
        });
      } else {
        that.$Message.warning('bookId为必填项');
      }
    },
    cancel() {
      this.modal1 = false;
    },
  },
};
</script>
