(window.webpackJsonpso=window.webpackJsonpso||[]).push([[5],{141:function(t,n,e){(t.exports=e(11)(!1)).push([t.i,"\n@keyframes error404animation {\n0% {\n    transform: rotateZ(0deg);\n}\n20% {\n    transform: rotateZ(-60deg);\n}\n40% {\n    transform: rotateZ(-10deg);\n}\n60% {\n    transform: rotateZ(50deg);\n}\n80% {\n    transform: rotateZ(-20deg);\n}\n100% {\n    transform: rotateZ(0deg);\n}\n}\n.error404-body-con {\n  width: 700px;\n  height: 500px;\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n}\n.error404-body-con-title {\n  text-align: center;\n  font-size: 240px;\n  font-weight: 700;\n  color: #2d8cf0;\n  height: 260px;\n  line-height: 260px;\n  margin-top: 40px;\n}\n.error404-body-con-title span {\n  display: inline-block;\n  color: #19be6b;\n  font-size: 230px;\n  animation: error404animation 3s ease 0s infinite alternate;\n}\n.error404-body-con-message {\n  display: block;\n  text-align: center;\n  font-size: 30px;\n  font-weight: 500;\n  letter-spacing: 12px;\n  color: #dddde2;\n}\n.error404-btn-con {\n  text-align: center;\n  padding: 20px 0;\n  margin-bottom: 40px;\n}\n",""])},158:function(t,n,e){var o=e(141);"string"==typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var r=(0,e(14).default)("158265cc",o,!1,{});o.locals||t.hot.accept(141,function(n){var o;"string"==typeof(o=e(141))&&(o=[[t.i,o,""]]),r(o)}),t.hot.dispose(function(){r()})},165:function(t,n,e){"use strict";e.r(n);var o=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"error404"},[e("div",{staticClass:"error404-body-con"},[e("Card",[e("div",{staticClass:"error404-body-con-title"},[t._v("4"),e("span",[e("Icon",{attrs:{type:"ios-navigate-outline"}})],1),t._v("4")]),t._v(" "),e("p",{staticClass:"error404-body-con-message"},[t._v("YOU  LOOK  LOST")]),t._v(" "),e("div",{staticClass:"error404-btn-con"},[e("Button",{staticStyle:{width:"200px"},attrs:{size:"large",type:"text"},on:{click:t.goHome}},[t._v("返回首页")]),t._v(" "),e("Button",{staticStyle:{width:"200px","margin-left":"40px"},attrs:{size:"large",type:"primary"},on:{click:t.backPage}},[t._v("返回上一页")])],1)])],1)])},r=[];o._withStripped=!0,t.hot.accept(),t.hot.data&&e(1).rerender("data-v-2fe04729",{render:o,staticRenderFns:r});var a=e(2),i=!1;var s,c=function(t){i||e(158)},l=Object(a.a)({name:"Error404",methods:{backPage:function(){this.$router.go(-1)},goHome:function(){this.$router.push({name:"home_index"})}}},o,r,!1,c,null,null);l.options.__file="src/views/error_page/404.vue",(s=e(1)).install(e(0),!1),s.compatible&&(t.hot.accept(),t.hot.data?s.reload("data-v-2fe04729",l.options):s.createRecord("data-v-2fe04729",l.options),t.hot.dispose(function(t){i=!0}));n.default=l.exports}}]);