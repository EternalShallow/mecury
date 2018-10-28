import api from "components/main/api";
export default {
    getList(cb,error) {
        api.com({
            url: `/minos-bookstore/categeory/list`,
            error(err){
                error && error(err);
            },
        }, req => {
            if (req.code == 200) {
                cb && cb(req.data)
            } else {
                utils.toast(req.message);
            }
        });
    },

};