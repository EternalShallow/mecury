import api from "components/main/api";
export default {
    URL: "/minos-bookstore/member/address",
    getAddressList(cb) {
        api.com({
            url: `${this.URL}/list`
        }, cb);
    },
    addAddress(param, cb) {
        api.com({
            data: JSON.stringify(param),
            type: "post",
            url: `${this.URL}/add`
        }, cb);
    },
    updateAddress(param, cb) {
        api.com({
            data: JSON.stringify(param),
            type: "post",
            url: `${this.URL}/update`
        }, cb);
    },
    delAddress(id, cb) {
        api.com({
            url: `${this.URL}/delete/${id}`
        }, cb);
    },
    defaultAddress(id, cb) {
        api.com({
            url: `${this.URL}/default/${id}`
        }, cb);
    }
};