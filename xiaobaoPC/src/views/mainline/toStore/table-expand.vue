<style scoped>
.expand-row {
  margin-bottom: 16px;
}
</style>
<template>
  <div>
    <Table :columns="columns7" :data="data6" border />
    <edit ref="editRef" :data-info="editInfo" />
  </div>
</template>
<script>
import edit from './component/edit';
import api from './js/api';

export default {
  components: {
    edit
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      editInfo: {},
      columns7: [
        {
          title: 'ISBD',
          key: 'bookid',
        },
        {
          title: '书名',
          key: 'bookname',
          render: (h, params) => h(
              "span",
              {
                props: {
                  type: "primary",
                  size: "small"
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    this.show(params.index);
                  }
                }
              },
              params.row.bookname
            ),
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      this.editInfo = params.row;
                      this.UpdateInfo(params.row);
                    },
                  },
                },
                '编辑',
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      this.remove(params.row.detailid, params.index);
                    },
                  },
                },
                '删除',
              ),
            ]),
        },
      ],
      data6: [],
    };
  },
  created() {
    let { row } = this;
    let that = this;

    api.getOrderDetails({
      detailid: row.orderid,
      success(data) {
        if (data.code === 200) {
          that.data6 = [...(data.data || [])];
        }
      }
    });
  },
  methods: {
    show(index) {
      this.$Modal.info({
        title: "提示信息",
        content: `ISBN：${this.data6[index].bookid}<br>书名：${
          this.data6[index].bookname
        }`
      });
    },
    UpdateInfo() {
      this.$refs.editRef.modal1 = true;
    },
    remove(bookid, index) {
      let that = this;
      this.$Modal.confirm({
        title: "操作提示",
        content: "<p>确定要删除该图书吗？</p>",
        onOk: () => {
          this.data6.splice(index, 1);

          api.delCancelBook({
            detailid: bookid,
            success(req) {
              if (req.code === 200) {
                that.$emit("getList");
              } else {
                utils.toast(req.message);
              }
            }
          });
        },
        onCancel: () => {}
      });
    }
  },
};
</script>
