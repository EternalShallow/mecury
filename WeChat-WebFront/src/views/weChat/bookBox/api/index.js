import api from "components/main/api";
export default {
  manageBorrow(param, cb) {
    api.com({
      type: "POST",
      data: JSON.stringify(param.data),
      url: "/minos-bookstore/book/manage/borrow"
    }, cb);
  },
  /**
   * 检查购物车数据是否是有库存
   * @param {*} param 
   * @param {*} cb 
   */
  checkAvaliable(param, cb) {
    api.com({
      type: "POST",
      data: JSON.stringify(param.data),
      url: "/minos-bookstore/book/check-avaliable"
    }, cb);
  }
}