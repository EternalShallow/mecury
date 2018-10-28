<template>
	<div class="menu-button iconfont icon-webicon311" ref="mybox" @dblclick="pageButtonTap"></div>
</template>
<style>
	.menu-button {
		padding: 9px;
		font-size: 33px;
		top: 4px;
		left: auto;
		right: 5px !important;
		z-index: 1000;
		position: absolute;		
		background-color: #8a92b3;
		box-shadow: 3px 3px 10px 2px #1717178a;
		border-radius: 3px;
		color: #ffffff;
		background-image: none !important;
		box-shadow: 3px 3px 10px 2px #1717178a;
		/*text-indent: 20px;
		color: transparent;
		
		&:before {
			content: "";
			position: absolute;
			top: 5px;
			right: 5px;
			bottom: 5px;
			left: 5px;
			background: linear-gradient(#373a47 20%, transparent 20%, transparent 40%, #373a47 40%, #373a47 60%, transparent 60%, transparent 80%, #373a47 80%);
		}*/
	}
	
	.icon-webicon311:before {
		position: relative;
		top: 1px;
		left: -9px;
	}
</style>
<script>
	import Drag from '../../../assets/js/utils/Drag.js';
	export default {
		data() {
			return {
				isCent: true,
			}
		},
		components: {},
		created() {},
		methods: {
			//点击按钮放大屏幕操作
			pageButtonTap() {
				let tar = event.target,
					name = tar.parentNode || tar;

				if(name.className !== 'items_tabs') {
					return;
				}

				this.isCent = !this.isCent;
				if(this.isCent) {
					name.style.width = "80%";
					name.style.height = "auto";
					name.style.position = "relative";
					name.style.webkitTransform = "translate3d(0, 0, 0)";
				} else {
					name.style.position = "absolute";
					name.style.webkitTransform = "translate3d(-36px, -71px, 0px)";
					name.style.width = document.body.scrollWidth  + "px";
					name.style.height = $("items_tabs").height() + "px";
				}
			},
		},
		mounted() {
			let oBox = this.$refs.mybox;
			Drag.drag(oBox, {
				handle: oBox,
				limit: true //锁定范围
			});
			let oBoxParent = oBox.parentNode;

			window.onresize = () => {
				oBoxParent.style.width = document.body.scrollWidth + "px";
				oBoxParent.style.height =  $("items_tabs").height() + "px";
			}
		}
	}
</script>