import api from 'components/main/api';

export default {
  URL: '/minos-bookstore/',
  getListInfo(params) {
    return api.comAjax({
      method: "get",
      url: `${this.URL}api/printer/isbn-id/${params.searchName}`,
      success(data) {
        return params.success && params.success(data);
      },
      error(err) {
        return utils.toast(err.message);
      },
    });
  },


};
