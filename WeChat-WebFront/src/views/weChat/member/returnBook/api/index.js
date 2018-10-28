import api from "components/main/api";
export default {
  manageBorrow(param, cb) {
    api.com({
      type: "POST",
      data: JSON.stringify(param.data),
      url: "/minos-bookstore/book/manage/borrow"
    }, cb);
  },
  callExpressBack(param,cb){
    api.com({
      url: `/minos-bookstore/book/manage/call-express-back/${param.orderId}/${param.id}/${param.time}`
    }, cb);
  },
  
}