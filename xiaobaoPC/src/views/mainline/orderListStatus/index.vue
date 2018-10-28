<template>
  <div>
    <Card class="orderListStatus">
      <Form
        ref="formValidate"
        :label-width="80">
        <Row>
          <Col span="7">
          <FormItem
            label="手机号码"
            prop="name">
            <Input
              v-model="formValidate.phone"
              placeholder="Enter your name"></Input>
          </FormItem>
        </Col>
          <Col span="7">
          <FormItem
            label="会员条形码"
            prop="name">
            <Input
              v-model="formValidate.code"
              placeholder="Enter your name"></Input>
          </FormItem>
        </Col>
          <Col span="7">
          <FormItem
            label="订单类型"
            prop="name">
            <Select
              v-model="formValidate.borrowTypeList"
              multiple>
              <Option
                v-for="item in cityList.leixing"
                :value="item.key"
                :key="item.key">{{ item.value }}</Option>
            </Select>
          </FormItem>
        </Col>
        </Col>
          <Col span="7">
          <FormItem
            label="时间"

            prop="name">
            <DatePicker
              v-model="formValidate.time"
              type="datetimerange"
              placement="bottom-end"
              placeholder="Select date"
              style="width: 100%"/>
          </FormItem>
        </Col>
          <Col span="7">
          <FormItem
            label="订单状态"
            prop="name">
            <Select
              v-model="formValidate.borrowStatus"
              multiple>
              <Option
                v-for="item in cityList.zhuangtai"
                :value="item.key"
                :key="item.key">{{ item.value }}</Option>
            </Select>
          </FormItem>
        </Col>
          <Col span="7">
          <FormItem>
            <Button
              type="primary"
              @click="handleSubmit('formValidate')">查询</Button>
          </FormItem>
        </Col>
        </Row>
      </Form>
    </Card>
    <Card>
      <Table
        ref="selection"
        :columns="table.columns"
        :data="table.data"
        :loading="table.loading"
        border/>
      <Page
        :current = "formValidate.pageStart"
        :total="table.total"
        :page-size="formValidate.pageSize"
        class="page"
        show-total />
    </Card>
    <model ref="model"/>
  </div>
</template>

<script>
import model from './model.vue';
import api from './api';
import expandRow from './table-expand.vue';

export default {
  components: {
    model,
    expandRow,
  },
  data() {
    return {
      formValidate: {
        phone: '', //手机号码
        code: '', //会员条形码

        time: [], //时间

        borrowTypeList: ["0"],
        borrowStatus: ["0"],

        pageStart: 1,
        pageSize: 20,
      },
      cityList: {},
      table: {
        total: 0,
        loading: false,
        data: [],
        columns: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => h(expandRow, {
              props: {
                row: params.row,
                getList: this.getDetalisList,
              },
            }),
          },
          {
            title: '订单号',
            key: 'orderid',
          },
          {
            title: '会员ID',
            key: 'uid',
          },
          {
            title: '会员名',
            key: 'uname',
          }, {
            title: '手机号',
            key: 'phone',
          }, {
            title: '下单时间',
            key: 'tsBorrow',
            minWidth: 160,
            render: (h, params) => h('span', new Date(params.row.tsBorrow).format('yyyy-MM-dd hh:mm')),
          }, {
            title: '订单类型',
            key: 'borrowTypeText',
          }, {
            title: '订单状态',
            key: 'statusText',
          }, {
            title: '操作',
            key: 'Action',
            render: (h, params) => h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                },
                style: {
                  marginRight: '5px',
                },
                on: {
                  click: () => {
                    this.$refs.model.getModalList({
                      data: {
                        orderId: params.row.orderid,
                      },
                    });
                  },
                },
              }, '物流查看'),
            ]),
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getListStatus();
  },
  methods: {
    getDetalisList() {
      debugger;
      console.log(this);
    },
    getListStatus() {
      const that = this;
      api.getListStatus({
        success(data) {
          if (data.code === 200) {
            that.cityList = data.data;
          }
        },
        error(err) {
          console.error(err);
        },
      });
    },
    handleSubmit() {
      this.getList();
    },
    getList() {
      const that = this;
      that.table.loading = true;
      api.getList({
        data: that.formValidate,
        success(data) {
          that.table.loading = false;
          if (data.code === 200) {
            that.table.data = data.data;
            that.table.total = data.totalRecords;
          }
        },
        error(err) {
          that.table.loading = false;
          console.error(err);
        },
      });
    },
  },
};
</script>

<style lang="less">
.page{
  text-align: right;
  margin-top: 10px;
}
</style>
