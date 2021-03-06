import api from 'components/main/api';

export default {
  URL: '/minos-bookstore/',
  getMemberInfo(params) {
    return api.comAjax({
      url: `${this.URL}api/order/come-to-store/list-prepare-order/${params.searchName}`,
      success(data) {
        return params.success && params.success(data);
      },
      error(err) {
        return utils.toast(err.message);
      },
    });
  },
  /**
   *
   * @param {删除} params
   */
  delCancelBook(params) {
    //获取用户信息
    return api.comAjax({
      url: `${this.URL}/api/order/cancel-book/${params.detailid}`,
      success(data) {
        return params.success && params.success(data);
      },
      error(err) {
        return utils.toast(err.message);
      },
    });
  },
  editExchangeBook(params) {
    //获取用户信息
    return api.comAjax({
      url: `${this.URL}api/order/exchange-book/${params.detailid}/${params.bookid}`,
      success(data) {
        return params.success && params.success(data);
      },
      error(err) {
        return utils.toast(err.message);
      },
    });
  },
  /**
   * 获取订单数据
   * @param {*} params 
   */
  getOrderDetails(params) {
    return api.comAjax({
      method: "get",
      url: `${this.URL}api/order/detail/${params.detailid}`,
      success(data) {
        return params.success && params.success(data);
      },
      error(err) {
        return utils.toast(err.message);
      },
    });
  }

};
