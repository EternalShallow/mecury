import api from "components/main/api";
export default {
    URL: "/minos-bookstore/member/books",
    borrowHistory(cb) {//注册会员
        api.com({
            type: "get",
            url: `${this.URL}/borrow-history`
        }, cb);
    },
    getBorrowOrder(cb) {
        api.com({
            type: "get",
            url: `${this.URL}/borrow-order`
        }, cb);
    }
};