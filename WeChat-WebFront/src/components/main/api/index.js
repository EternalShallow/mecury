import '@/js/utils/ajax';
export default {
  com(param, cb) {
    _$.ajax({
      type: param.type ? param.type : "get",
      url: param.url || "",
      data: param.data || "",
      async: param.async == false ? false : true,
      contentType: "application/json",
      success: response => {
        cb && cb(response);
      },
      error: error => {
        if(param.error){
          param.error(error);
        }
        utils.toast(error);
      }
    });
  },
  userBaseAuth(param, cb) {
    this.com({
      type:"post",
      async: false,
      data: JSON.stringify(param),
      url: "/minos-weixin/user/detail-auth"
    }, cb);
  }
}