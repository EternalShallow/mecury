import api from "components/main/api";
export default {
    URL: "/minos-bookstore/member",
    getUserInfo(cb) {
        api.com({
            async: false,
            url: `${this.URL}/info`
        }, req => {
            if (req.code == 200) {
                cb && cb(req)
            } else {
                utils.toast(req.message);
            }
        });
    },
    getMemberBorrowBrief(cb) {//会员简介
        api.com({
            url: '/minos-bookstore/book/manage/member-borrow-brief'
        }, req => {
            if (req.code == 200) {
                cb && cb(req.data)
            } else {
                utils.toast(req.message);
            }
        });
    },

};