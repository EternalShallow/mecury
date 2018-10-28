<!--借书-->
<template>
  <article class="borrowBooksPar">
    <div class="borrowBooks">
      <h3>借书</h3>
      <Headers :search="search" :data="data" @useMembers="useMembers" @searchUserName="searchUserName" @searchUserNameEvent="searchUserNameEvent" />
      <p class="address_border" />
      <header class="startBook">
        <section class="inputName bookName">
          <span>书名：</span>
          <div><input id="bookName" v-model="search.bookName" placeholder="扫描书的条形码" @keydown="searchBookNameEvent()"></div>
          <button :disabled="!search.bookName" type="button" @click="searchBookName()">查询</button>
        </section>
        <fieldset>
          <legend>开始借书</legend>
          <div id="bookList">
            <Table ref="selection" :columns="columns4" :data="data1" highlight-row @on-selection-change="handleRowChange" />

            <!-- <Button @click="handleSelectAll(true)">全选</Button>
                        <Button @click="handleSelectAll(false)">全不选</Button> -->
            <button v-if="data1.length>0" id="bookNameisShow" type="button" @click="submitBtn()">借书</button>
          </div>
        </fieldset>
      </header>
    </div>
  </article>
</template>
<script>
import api from "./js/api";
import Headers from "../component/Header";

export default {
  components: {
    Headers
  },
  data() {
    return {
      search: {
        userName: "",
        userNameTicket: "",
        bookName: ""
      },
      data: {},
      checkedList: [], //选中的checkBox 数组
      columns4: [
        {
          type: "selection",
          width: 60,
          _checked: true,
          align: "center"
        },
        {
          title: "ID",
          key: "id"
        },
        {
          title: "图像",
          width: 100,
          key: "headImage",
          render: (h, params) => {
            debugger;
            return h("img", {
              attrs: {
                src: params.row.headImage
              },
              style: {
                width: "100px",
                height: "100px"
              }
            });
          }
        },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "出版社",
          key: "publisher"
        },
        {
          title: "作者",
          key: "editor"
        }
      ],
      data1: []
    };
  },
  methods: {
    useMembers() {
      api.ticketConsumeByUserid(
        {
          id: this.data.uid
        },
        req => {
          debugger;
          if (req.code != 200) {
            return utils.toast(req.message);
          }
          this.searchUserName();
        }
      );
    },
    handleRowChange(currentRow, oldCurrentRow) {
      this.checkedList = [];
      currentRow.map(data => {
        this.checkedList.push(data.id);
      });
    },
    submitBtn() {
      const that = this;
      if (!this.data.uid) {
        return utils.toast("请查找用户信息！");
      }
      if (this.checkedList.length <= 0) {
        this.data1.map(req => {
          this.checkedList.push(req.id);
        });
      }
      api.submitBorrowByUserid(
        {
          id: this.data.uid,
          list: this.checkedList
        },
        req => {
          if (req.code != 200) {
            return utils.toast(req.message);
          }
          req = req.data;

          const list = [...this.data1];
          req.map(data => {
            for (let i = 0; i < list.length; i++) {
              if (list[i].id == data.bookid) {
                list.splice(i, 1);
                break;
              }
            }
          });
          that.data1 = [...list];
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
        api.getDetailByIsbn(search.bookName, req => {
          this.search.bookName = ""; //置空
          if (req.code != 200) {
            return utils.toast(req.message);
          }
          req = req.data;

          this.data1.push({
            _checked: true, //默认选中
            id: req.id,
            name: req.name,
            publisher: req.publisher,
            editor: req.editor,
            headImage: window.location.origin + req.headImage
          });
        });
    },
    searchUserName() {
      const { search } = this;
      const userName = search.userName || search.userNameTicket;
      this.search.userNameTicket = userName;
      if (userName) {
        api.getMemberInfo(userName, req => {
          this.search.userName = ""; //置空
          if (req.code != 200) {
            return utils.toast(req.message);
          }
          req = req.data;

          const data = req.member;

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
            ticketNum: data.ticketNum,
            flag: data.ticketNum > 0
          };

          /*babyBirth //出生日期
          babyGender //性别
          borrowBooksCount //借了多少本

          borrowCount // 借了多少次
          borrowDeadline // 截止日期
          depositMoney//押金

          maxBorrowCount // 一次最多可借阅多少本
          status // 1表示付费会员 2、过期 3、注销 4、 非付费会员
          ticketDeadline//入场券的截止日期
          ticketNum //入场券的次数*/
        });

        /* $.ajax({
									url: "/minos-bookstore/api/member/info/" + userName,
									type: "post",
									contentType: "application/json",
									success: function (result) {
											if (result.data) {
													var data = result.data.member;
													$("#babyName").html(data.babyName);
													$("#uid").html(data.uid);
													$("#cellphone").html(data.cellphone);
													$("#babyBirth").html(data.babyBirth);
													var babyGender = data.babyGender;
													if (babyGender) {
															babyGender = babyGender == 1 ? "男" : "女";
													} else {
															babyGender = "__"
													}
													$("#babyGender").html(babyGender);
													$("#borrowBooksCount").html(data.borrowBooksCount);
													$("#borrowCount").html(data.borrowCount);
													$("#borrowDeadline").html(new Date(data.borrowDeadline).Format('yyyy-MM-dd hh:mm:ss'));
													$("#depositMoney").html(data.depositMoney);
													$("#maxBorrowCount").html(data.maxBorrowCount);
													let status = "";
													switch (result.data.status) {
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
													$("#status").html(status);
													$("#ticketDeadline").html(new Date(data.ticketDeadline).Format('yyyy-MM-dd hh:mm:ss'));
													$("#ticketNum").html(data.ticketNum);

											}

									}
							}); */
      }
    }
  }
};
</script>

<style lang="less">
@import "./less/index";
.ivu-table table {
  table-layout: unset;
}
</style>
