import api from 'components/main/api';

export default {
  URL: '/minos-bookstore/',
  getMemberInfo(userName, cb) { //获取用户信息
    return api.comAjax({
      url: `${this.URL}api/member/info/${userName}`,
      success(data) {
        return cb && cb(data);
      },
      error(err) {
        return utils.toast(err.message);
      },
    });
  },
  getDetailByIsbn(bookName, cb) { //根据书名进行查找
    return api.comAjax({
      method: 'get',
      url: `${this.URL}book/detail-by-sid/${bookName}`,
      success(data) {
        return cb && cb(data);
      },
      error(err) {
        return utils.toast(err.message);
      },
    });
  },
  submitBorrowByUserid(param, cb) { //借书接口
    return api.comAjax({
      url: `${this.URL}api/borrow-by-userid/${param.id}`,
      contentType: 'application/json',
      data: JSON.stringify({
        bookids: param.list,
      }),
      success(data) {
        return cb && cb(data);
      },
      error(err) {
        return utils.toast(err.message);
      },
    });
  },
  ticketConsumeByUserid(param, cb) { //优惠券
    return api.comAjax({
      url: `${this.URL}api/ticket-consume-by-userid/${param.id}`,
      contentType: 'application/json',
      success(data) {
        return cb && cb(data);
      },
      error(err) {
        return utils.toast(err.message);
      },
    });
  },

  //还书查询，根据用户信息进行查询数据借书的数据-------------------
  getReturnBorrowOrderByUserid(param, cb) {
    return api.comAjax({
      url: `${this.URL}api/books/borrow-order-by-userid/${param.id}`,
      contentType: 'application/json',
      success(data) {
        return cb && cb(data);
      },
      error(err) {
        return utils.toast(err.message);
      },
    });
  },
  submitreturnByUserid(param, cb) { //还书接口
    return api.comAjax({
      url: `${this.URL}api/return-back-by-userid/${param.id}`,
      contentType: 'application/json',
      data: JSON.stringify(param.list),
      success(data) {
        return cb && cb(data);
      },
      error(err) {
        return utils.toast(err.message);
      },
    });
  },

};
