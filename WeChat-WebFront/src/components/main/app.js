"use strict";
import Vue from 'vue';

//import '@/js/utils/fontSize';
import store from 'store' //仓库
import { router } from 'router';

import App from './App.vue';
import Main from "./index";

import { sync } from 'vuex-router-sync'
sync(store, router);

/**
 *引用公共样式 
 */
import '@/css/common';

//--------------微信授权开始----------------------
const env = process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production';

let fid = "";
try {
	fid = utils.url.getParamObj().fid || "";
} catch (error) {
	fid = "";
}


if (!env) {
	const api = require("./api").default;
	if (!fid) {
		api.userBaseAuth({
			url: window.location.href,
			async: false,
		}, req => {
			if (req.code == 200) {
				return window.location.href = req.data;
			} else if (req.code == 555) {
				fid = req.data;
			} else {
				flag = true;
				fid = "";
			}
		})
	}
}

//--------------微信授权结束----------------------

const vm = new Vue({
	store,
	router,
	render: h => {
		if ((router.history.pending && router.history.pending.path.indexOf("/active") >= 0) || (router.current && router.current.path.indexOf("/active") >= 0)) return h(Main);
		return h(App);
	},
	data: {},
	mounted() { },
	created() {
	},
	beforeCreate() {
		//微信分享
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			let share = require('@/js/utils/allShare.js').default;

			let URL = "";
			if (fid) {
				URL += URL.indexOf('?') == -1 ? '?fid=' + fid : '&fid=' + fid;
			}
			share.shareAll({
				URL: window.location.origin + window.location.pathname + URL,
			})
		}
	}
}).$mount("#apps");


/* Vue.mixin({
	beforeRouteLeave: function (to, from, next) {
		console.log("销毁	")
		this.$destroy();
		next();
	}
}); */