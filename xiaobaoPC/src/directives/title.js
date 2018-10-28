import Vue from 'vue';

/**
 * 动态更新title指令
 */
Vue.directive('title', {
	inserted: (el, binding) => {
		document.title = binding.value;
	}
})