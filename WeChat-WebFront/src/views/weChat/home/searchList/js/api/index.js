import api from "components/main/api";
export default {
  getSearchList(params, cb) {
    params.url = `/minos-bookstore/book/search/${params.name}/${params.refreshInfo.currIndex}/${params.refreshInfo.pageSize}`;
    api.com(params, cb);
  },
  getDetails(params, cb) {
    params.url = `/minos-bookstore/book/detail/${params.detailsId}`;
    api.com(params, cb);
  }
};