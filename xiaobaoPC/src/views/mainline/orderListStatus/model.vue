<template>
  <div>
    <Modal
      v-model="modal6"
      class="orderListStatusModel"
      title="物流信息"
      @on-ok="asyncOK">
      <article>
        <Timeline>
          <TimelineItem>
            <p class="time">1976年</p>
            <p class="content">Apple I 问世</p>
          </TimelineItem>
          <TimelineItem>
            <p class="time">1984年</p>
            <p class="content">发布 Macintosh</p>
          </TimelineItem>
          <TimelineItem>
            <p class="time">2007年</p>
            <p class="content">发布 iPhone</p>
          </TimelineItem>
          <TimelineItem>
            <p class="time">2010年</p>
            <p class="content">发布 iPad</p>
          </TimelineItem>
          <TimelineItem>
            <p class="time">2011年10月5日</p>
            <p class="content">史蒂夫·乔布斯去世</p>
          </TimelineItem>
        </Timeline>
      </article>
      <div slot="footer">
        <Button
          type="primary"
          @click="asyncOK()">关闭</Button>
      </div>
    </Modal>
    <Spin
      v-if="spinShow"
      size="large"
      fix/>
  </div>
</template>

<script>
import api from './api';

export default {
  data() {
    return {
      modal6: false,
      spinShow: false,
    };
  },
  watch: {

  },
  created() {

  },
  methods: {
    asyncOK() {
      this.modal6 = false;
    },
    getModalList(data) {
      const that = this;
      data.orderId = '249521150480';
      that.spinShow = true;
      api.getModalList({
        ...data,
        success(req) {
          that.spinShow = false;
          if (req.code === 200) {
            that.modal6 = true;
          } else {
            utils.toast(req.message);
          }
        },
        error(err) {
          that.spinShow = false;
          console.error(err);
        },
      });
    },
  },
};
</script>

<style lang="less">

</style>
