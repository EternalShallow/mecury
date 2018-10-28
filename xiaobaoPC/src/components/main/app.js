'use strict';

// import 'babel-polyfill';

import Vue from 'vue';

Vue.config.debug = true; // 开启vue 调试功能
Vue.config.devtools = true; // 开启vue调试工具功能
Vue.config.productionTip = false; // 2.2.0 新增,来关闭生产模式下给出的提示

/**
 * 引入 iview
 */
import iView from 'iview';

Vue.use(iView);

import store from 'store'; // 仓库

import App from './App.vue';
import { router, appRouter } from 'router';

/**
 *引用公共样式
 */
import '@/css/common';
import Util from '@/js/utils/libs/util.js';
import '@/js/utils/index.js';


const vm = new Vue({
	el: '#apps',
	store,
	router,
	data: {
		currentPageName: ''
	},
	render: h => h(App),
	mounted() {
		this.currentPageName = this.$route.name;
		// 显示打开的页面的列表
		this.$store.commit('setOpenedList');
		this.$store.commit('initCachepage');
		// 权限菜单过滤相关
		this.$store.commit('updateMenulist');
	},
	created() {
		const tagsList = [];
		appRouter.map((item) => {
			if (item.children.length <= 0) {
				tagsList.push(item.children[0]);
			} else {
				tagsList.push(...item.children);
			}
		});
		this.$store.commit('setTagsList', tagsList);
	},
});
