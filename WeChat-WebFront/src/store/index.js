import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex); //全局使用Vuex

import frame from "./frame";
import getWeChat from "views/weChat/store";

export default new Vuex.Store({
	modules: {
		vux: frame,
		...getWeChat,
		//后续所有的模块中的数据可以放到仓库中来
	}
})