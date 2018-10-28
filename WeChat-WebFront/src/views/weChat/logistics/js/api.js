import api from "components/main/api";
export default {
  URL: "/minos-bookstore/sf-express/",

  getRouteId(id, cb) {//会员简介
    api.com({
      url: `${this.URL}route/${id}`
    }, req => {
      if (req.code == 200) {
        cb && cb(req.data)
      } else {
        utils.toast(req.message);
      }
    });
  },

};