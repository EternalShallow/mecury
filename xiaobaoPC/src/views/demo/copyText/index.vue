<template>
	<div v-title="'复制操作'" class="copyText">
		<p align="center">复制操作</p>
		<p>
			<div class="js-copyText">你好，我是文本125</div>
		</p>
		<p>
			<button class="js-textareacopybtn" data-copy=".js-copyText">文本复制</button>
			<!--

                data-copy表示你要拷贝的class或者是ID
                                 例如：
                data-copy=".js-copyText" 或者 
                data-copy="#js-copyText"

            -->
		</p>
		<p>
			<textarea rows="5"></textarea>
		</p>
	</div>
</template>

<style lang="less">
	@import "./less/index";
</style>

<script>
	import '../../../directives/title';
	import copy from '../../../assets/js/utils/copyText';
	export default {
		data() {
			return {

			}
		},
		mounted() {
			/**
			 * 复制粘贴功能
			 * 2017-05-25
			 * 参数一：表示复制功能按钮btn 可为id,可为class
			 * 参数二：表示回调
			 * yb
			 */
			copy.copyText(".js-textareacopybtn", function(flag) {

				/**
				 * flag 为true的时候，表示赋值成功，false表示赋值失败，自行处理
				 */
				return flag ? alert("文字已复制到剪贴板中") : alert("请长按选中复制")
			});
		}
	}
</script>