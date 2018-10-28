<!--还书-->
<template>
  <article class="borrowBooksPar returnBooksPar">
    <div class="borrowBooks">
      <h3>还书</h3>
      <Header :search="search" :data="data" @searchUserName="searchUserName" @searchUserNameEvent="searchUserNameEvent" />
      <p class="address_border" />
      <header class="startBook">
        <section class="inputName bookName">
          <span>书名：</span>
          <div><input id="bookName" v-model="search.bookName" placeholder="扫描书的条形码" @keydown="searchBookNameEvent()"></div>
          <button :disabled="!search.bookName" type="button" @click="searchBookName()">查询</button>
        </section>
        <fieldset v-for="(v,i) in dataList" class="returnBookOrder" :key="i">
          <legend>单号：{{ v.orderid }}</legend>
          <div id="bookList">
            <section class="flex hr">
              <div>借书状态：{{ v.status }}</div>
              <div>借书类型：{{ v.borrowType }}</div>
              <div>借书日期：{{ v.borrowTime | dateFormat }}</div>
            </section>
            <Table :row-class-name="rowClassName" :ref="'selection'+i" :columns="columns4" :data="v.details" highlight-row @on-select="handleRowChange" @on-select-all="handleRowChangeAll" @on-select-cancel="handleRowChangeCal" />

            <!-- <Button @click="handleSelectAll(true)">全选</Button>
                        <Button @click="handleSelectAll(false)">全不选</Button> -->
          </div>
        </fieldset>
        <button id="bookNameisShow" :class="checkedList.length<=0?'gray':''" :disabled="checkedList.length<=0" type="button" @click="submitBtn()">还书</button>
      </header>
    </div>
  </article>
</template>
<script>
import api from "../borrowBooks/js/api";
import Header from "../component/Header";

export default {
  components: {
    Header
  },
  filters: {
    dateFormat(val) {
      return val && utils.date.timeToStr(val, "YYYY-MM-dd hh:mm:ss");
    }
  },
  data() {
    return {
      search: {
        userName: "",
        bookName: ""
      },
      data: {},
      checkedList: [], //选中的checkBox 数组
      columns4: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "ID",
          align: "center",
          width: 150,
          key: "id"
          /* render(h, param) {
						    return h('span', {
						        // 正常的 HTML 特性
						        'attrs': {
						            class: param.row.isShow ? 'active' : '',
						        },
						        // DOM 属性
						        domProps: {
						            innerHTML: param.row.id
						        },

						    })
						} */
        },
        {
          title: "图像",
          align: "center",
          width: 100,
          key: "headImage",
          render: (h, params) =>
            h("img", {
              attrs: {
                src: params.row.headImage.split(",")[0]
              },
              style: {
                width: "100px",
                height: "100px"
              }
            })
        },
        {
          title: "名称",
          align: "center",
          key: "name"
        },
        {
          title: "出版社",
          key: "publisher",
          align: "center"
        },
        {
          title: "作者",
          key: "editor",
          align: "center"
        }
      ],
      data1: [],
      dataList: []
    };
  },
  methods: {
    rowClassName(row, index) {
      if (row.isShow) {
        return "active";
      }
      return "";
    },

    handleRowChangeAll(selection) {
      selection.map(data => {
        this.checkedList.push(data.detailOrder.detailid);
      });
    },
    handleRowChange(selection, row) {
      this.checkedList.push(row.detailOrder.detailid);
    },
    handleRowChangeCal(selection, row) {
      /*  row.isShow = false;
				 console.log(event.target.parentNode.parentNode.parentNode.parentNode.parentNode.classList.remove("active")) */
      const checkedList = this.checkedList;
      for (let i = 0; i < checkedList.length; i++) {
        if (checkedList[i] == row.detailOrder.detailid) {
          checkedList.splice(i, 1);
          break;
        }
      }
      const id = row.id;
      const list = this.dataList;
      const that = this;
      let flag = true;
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].details.length; j++) {
          if (id == list[i].details[j].id && flag) {
            that.$set(list[i].details[j], "_checked", false);
            that.$set(list[i].details[j], "isShow", false);
            flag = false;
            break;
          }
        }
      }
      this.dataList = [...list];
    },
    submitBtn() {
      const that = this;
      if (!this.data.uid) {
        return utils.toast("请查找用户信息！");
      }
      /*
				//暂时未发现使用的
				if(this.checkedList.length <= 0) {
					this.data1.map(req => {
						this.checkedList.push(req.detailOrder.detailid)
					})
				} */

      api.submitreturnByUserid(
        {
          id: this.data.uid,
          list: this.checkedList
        },
        req => {
          if (req.code != 200) {
            return utils.toast(req.message);
          }
          req = req.data;

          //2018-08-18
          const list = [...this.dataList];
          req.map((data, iii) => {
            for (let i = 0; i < list.length; i++) {
              for (let k = 0; k < list[i].details.length; k++) {
                debugger;
                if (list[i].details[k].detailOrder.detailid == data) {
                  list[i].details.splice(k, 1);
                  req.splice(iii, 1);
                  break;
                }
              }
              if (list[i].details.length <= 0) {
                list.splice(i, 1);
                break;
              }
            }
          });
          that.checkedList = [...req];
          that.dataList = [...list];
        }
      );
    },
    searchBookNameEvent() {
      const e = event || window.event || arguments.callee.caller.arguments[0];
      if (e && e.keyCode == 13) {
        this.searchBookName();
      }
    },
    searchUserNameEvent() {
      const e = event || window.event || arguments.callee.caller.arguments[0];
      if (e && e.keyCode == 13) {
        this.searchUserName();
      }
    },
    handleSelectAll(status) {
      //用来设置全选，全不选设置
      this.$refs.selection.selectAll(status);
    },
    searchUserNameEvent() {
      const e = event || window.event || arguments.callee.caller.arguments[0];
      if (e && e.keyCode == 13) {
        this.searchUserName();
      }
    },
    searchBookName() {
      const { search } = this;
      search.bookName &&
        api.getDetailByIsbn(search.bookName.trim(), req => {
          this.search.bookName = ""; //置空
          if (req.code != 200) {
            return utils.toast(req.message);
          }
          req = req.data;

          const id = req.id;
          const list = this.dataList;
          const that = this;
          let falg = true;
          for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < list[i].details.length; j++) {
              if (id == list[i].details[j].id && falg) {
                that.$set(list[i].details[j], "_checked", true);
                that.$set(list[i].details[j], "isShow", true);
                that.checkedList.push(id);
                falg = false;
                break;
              }
            }
          }
          this.dataList = [...list];
        });
    },
    searchUserName() {
      const { search } = this;
      const userName = search.userName;

      const that = this;

      if (userName) {
        api.getMemberInfo(userName.trim(), req => {
          this.search.userName = ""; //置空
          if (req.code != 200) {
            return utils.toast(req.message);
          }
          req = req.data;

          const data = req.member;
          api.getReturnBorrowOrderByUserid(
            {
              id: data.uid
            },
            response => {
              if (response.code != 200) {
                return utils.toast(response.message);
              }
              response = response.data;

              that.dataList = [...response];
            }
          );

          let babyGender = data.babyGender;

          let status = "";

          if (babyGender) {
            babyGender = babyGender == 1 ? "男" : "女";
          } else {
            babyGender = "__";
          }
          switch (req.status) {
            case 1:
              status = "付费会员";
              break;
            case 2:
              status = "已过期";
              break;
            case 3:
              status = "已注销";
              break;
            case 4:
              status = "非付费会员";
              break;
            default:
              break;
          }
          this.data = {
            babyName: data.babyName,
            uid: data.uid,

            cellphone: data.cellphone,
            babyBirth: data.babyBirth,
            babyGender,
            borrowBooksCount: data.borrowBooksCount,
            borrowCount: data.borrowCount,
            borrowDeadline: utils.date.timeToStr(
              data.borrowDeadline,
              "yyyy-MM-dd hh:mm:ss"
            ),
            depositMoney: data.depositMoney,
            maxBorrowCount: data.maxBorrowCount,
            depositMoney: data.depositMoney,
            status,
            ticketDeadline: utils.date.timeToStr(
              data.ticketDeadline,
              "yyyy-MM-dd hh:mm:ss"
            ),
            ticketNum: data.ticketNum
          };
        });
      }
    }
  }
};
</script>

<style lang="less">
@import "../borrowBooks/less/index";
.ivu-table table {
  table-layout: unset;
}

.returnBooksPar {
  .borrowBooks {
    padding-bottom: 100px;
  }
  .returnBookOrder {
    margin-top: 30px;
    padding-bottom: 10px !important;
    legend {
      font-size: 14px !important;
      color: red !important;
    }
  }
  .inputName {
    padding-bottom: 0;
  }
  .hr {
    div {
      width: 20%;
      font-size: 14px;
      width: 100%;
      font-size: 14px;
      color: #333333;
      padding: 10px 0;
      text-align: center;
      &:nth-child(1) {
        text-align: left;
        text-indent: 12px;
        width: 54%;
      }
      &:nth-child(2) {
        text-align: left;
        width: 54%;
      }
      &:last-child {
        text-align: right;
        margin-right: 16px;
      }
    }
  }
  .startBook {
    img {
      width: 100px !important;
      height: 90px !important;
      margin: 10px auto !important;
    }
    button {
      bottom: -80px !important;
    }
  }
  .gray {
    background: #dddddd !important;
  }
  table thead th {
    &:first-child {
      .ivu-table-cell {
        visibility: hidden;
      }
    }
  }
  .active {
    td {
      background: #d4d4d4;
    }
  }
}
</style>
