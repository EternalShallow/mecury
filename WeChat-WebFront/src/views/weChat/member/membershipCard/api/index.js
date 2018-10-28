import api from "components/main/api";
export default {
    URL: "/minos-bookstore/member/goods",
    getGoodsList(cb) {//购买会员
        api.com({
            url: `${this.URL}/list`
        }, cb);
    },
    payTab(id, cb) {
        api.com({
            url: `${this.URL}/buy/${id}`
        }, cb);
    },
    goodBuy(id, cb) {
        api.com({
            url: `/minos-weixin/pay/good/buy/${id}`
        }, cb);
    }
};
