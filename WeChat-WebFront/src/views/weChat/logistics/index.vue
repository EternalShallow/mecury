<!-- 物流信息 -->
<template>
  <article class="logistics">
    <header>
      <div>
        <span>订单编号：</span>
        <span>{{id}}</span>
      </div>
    </header>
    <section class="timeline-demo" v-if="list.length>0">
      <timeline>
        <timeline-item v-for="(v,i) in list" :key="i">
          <h4 :class="i==0?'recent wuliu':'wuliu'">{{v.acceptaddress}}</h4>
          <p :class="i==0?'recent wuliu':'wuliu'">{{v.accepttime}}</p>
          <p class="wuliu" v-if="v.remark">备注：{{v.remark}}</p>
        </timeline-item>
      </timeline>
    </section>
    <no-data v-if="list.length<=0"></no-data>
  </article>
</template>

<script>
import { Timeline, TimelineItem } from "vux";
import NoData from "components/common/noData";
import api from "./js/api";
export default {
  components: {
    Timeline,
    TimelineItem,
    NoData
  },
  data() {
    return {
      list: []
    };
  },
  mounted() {
    let id = utils.url.getParamObj().id;
    let that = this;
    if (id) {
      that.id = id || "";
      api.getRouteId(id, req => {
        that.list = [...req];
      });
    }
  }
};
</script>

<style lang="less">
body {
  background-color: #ffffff !important;
}
.logistics {
  background: #ffffff;
  header {
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    color: #000000;
    border-bottom: 1px solid #dddddd;
    div {
      display: block;
      span {
        font-size: 14px;
        display: inline-block;

        &:first-child {
          text-indent: 12px;
        }
      }
    }
  }
  .timeline-demo {
    p {
      color: #888;
      font-size: 14px;
    }
    h4 {
      color: #666;
      font-weight: normal;
    }
    .recent {
      color: rgb(4, 190, 2);
    }
    .wuliu {
      margin-left: 10px;
    }
  }
}
</style>
