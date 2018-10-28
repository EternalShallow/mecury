import api from 'components/main/api';

export default {
  URL: '/minos-bookstore/',
  getListStatus(param) {
    return api.comAjax({
      ...param,
      method: 'get',
      url: `${this.URL}api/order/list-status`,
      contentType: 'application/json',
    });
  },
  getList(param) {
    const { data } = param;

    data.tsBegin = data.time[0] ? new Date(data.time[0]).format('yyyy-MM-dd hh:mm:ss') : '';
    data.tsEnd = data.time[1] ? new Date(data.time[1]).format('yyyy-MM-dd hh:mm:ss') : '';

    return api.comAjax({
      ...param,
      data: JSON.stringify(data),
      url: `${this.URL}api/order/search-order`,
      contentType: 'application/json',
    });
  },
  //----------物流----------------
  getModalList(param) {
    const { data } = param;
    return api.comAjax({
      ...param,
      method: 'get',
      url: `${this.URL}sf-express/route-sf-mailno/${data.orderId}`,
      contentType: 'application/json',
    });
  },

};
