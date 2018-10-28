import api from "components/main/api";
export default {
  URL: "/minos-bookstore/book/",

  getHotBooks(param, cb) { //热门图书
    api.com({
      url: `${this.URL}hot-books/${param.currIndex}/${param.pageSize}`,
    }, req => {
      if (req.code == "200") {
        cb && cb(req.data);
      } else {
        utils.toast(req.message);
      }
    });
  },
  getSearchByLabel(param, cb) { //名家书单点击事件
    api.com({
      url: `${this.URL}search-by-label/${param.name}/${param.refreshInfo.currIndex}/${param.refreshInfo.pageSize}`
    }, req => {
      cb && cb(req);
    });
  },
  getSearchByAge(param, cb) { //年龄分段点击事件
    let age = param.age && param.age.split("-");
    api.com({
      url: `${this.URL}search-by-age/${age[0]}/${age[1]}/${param.refreshInfo.currIndex}/${param.refreshInfo.pageSize}`
    }, req => {
      cb && cb(req);
    });
  },

  getListByCategeory(data, cb) { //分类标签页面搜索
    api.com({
      data: JSON.stringify(data),
      type: "post",
      url: `${this.URL}list-by-categeory`
    }, req => {
      cb && cb(req);
    });
  },
};