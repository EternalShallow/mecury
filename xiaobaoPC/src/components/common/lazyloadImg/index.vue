/** * 图片懒加载 * 2017-05-31 * yubai8 */
<template>
	<p class="imgLazy">
		<img v-lazy.container="imgUrl" />
	</p>
</template>
<style lang="less">
	@import url("./less/index");
</style>
<script>
	import Vue from 'vue';
	import VueLazyload from 'vue-lazyload';
	import loadding from "./img/loadding.gif";
	import errors from "./img/error.png";
	Vue.use(VueLazyload, {
		preLoad: 1, //预装高度的比例 
		attempt: 1, //尝试计数 
		loading: loadding,
		error: errors,
		adapter: {
			loaded(listender, Init) {
				if(listender) {
					listender.el.style.width = "100%";
					listender.el.style.height = "100%";
				}
			},
			loading(listender, Init) {
				if(listender) {
					listender.el.style.width = "50px";
					listender.el.style.height = "50px";
				}
			},
			error(listender, Init) {
				if(listender) {
					listender.el.parentNode.style.backgroundColor = "#999999";
					listender.el.style.width = "200px";
					listender.el.style.height = "150px";
				}
			}
		}
	});
	export default {
		props: ['imgUrl']
	}
</script>