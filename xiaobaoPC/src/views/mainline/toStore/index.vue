<!-- 到店取 -->
<template>
  <div>
    <Card>
      <Form label-width="80">
        <Row>
          <Col span="6">
          <FormItem label="手机号：">
            <Input
              v-model="searchName"
              placeholder="请输入手机号"
              @on-keydown="okKeydown" ></Input>
          </FormItem>
          </Col>
          <Col span="1">
          <FormItem label-width="20">
            <Button
              :disabled ="!searchName"
              type="primary"
              @click="getList">查找</Button>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Table
            :columns="columns10"
            :data="data9" />
        </Row>
      </Form>
    </Card>
  </div>

</template>
<script>
import expandRow from './table-expand.vue';

import api from './js/api';

export default {
  components: { expandRow },
  data() {
    return {
      searchName: '',
      columns10: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => h(expandRow, {
            props: {
              row: params.row,
              getList: this.getList,
            },
          }),
        },
        {
          title: '用户ID',
          key: 'uid',
          align: 'center',
        },
        {
          title: '用户名',
          key: 'uname',
          align: 'center',
        },
        {
          title: '手机号',
          key: 'phone',
          align: 'center',
          minWidth: 160,
        },
        {
          title: '下单时间',
          align: 'center',
          key: 'tsBorrow',
          minWidth: 160,
          render: (h, params) => h('span', new Date(params.row.tsBorrow).format('yyyy-MM-dd hh:mm')),
        },
        {
          title: '借阅数量',
          key: 'address',
          align: 'center',
          render: (h, params) => h('span', params.row.borrowNum),
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            let str = '';
            if (params.row.status === 2) {
              str = '借阅中';
            } else if (params.row.status === 4) {
              str = '已还清';
            } else if (params.row.status === 8) {
              str = '库存不够';
            } else if (params.row.status === 32) {
              str = '被替换';
            } else if (params.row.status === 32) {
              str = '已签收';
            } else if (params.row.status === 128) {
              str = '寄还';
            }
            return h('span', str);
          },
        },
      ],
      data9: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    okKeydown() {
      const e = event || window.event || arguments.callee.caller.arguments[0];
      if (e && e.keyCode == 13) {
        this.getList();
      }
    },
    getList() {
      const that = this;
      api.getMemberInfo({
        searchName: that.searchName || 0,
        success(req) {
          if (req.code === 200) {
            that.data9 = [...req.data];
          }
        },
      });
    },
  },
};
</script>
