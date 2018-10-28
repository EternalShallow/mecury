import api from "components/main/api";
export default {
    URL: "/minos-bookstore/member",
    /* registeredMember(param, cb) {//注册会员
        api.com({
            data: JSON.stringify(param),
            type: "post",
            url: `${this.URL}/register`
        }, cb);
    }, */
    registeredMember(param, cb) {//更新会员接口，新增修改同一个方法
        api.com({
            data: JSON.stringify(param),
            type: "post",
            url: `${this.URL}/update`
        }, cb);
    },
};