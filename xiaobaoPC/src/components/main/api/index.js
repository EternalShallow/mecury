import '@/js/utils/ajax';
//ajax公共方法
export default {
  comAjax(param) {
    _$.ajax({
      type: param.method || 'post',
      data: param.data,
      async: param.async != false,
      url: param.url || '',
      contentType: param.contentType ? 'application/json' : '',
      success(data) {
        return param.success && param.success(data);
      },
      error(err) {
        return param.error && param.error(err);
      },
    });
  },
};
