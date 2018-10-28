<style lang="less">
	@import './less/401';
</style>

<template>
	<div class="error401">
		<div class="error401-body-con">
			<Card>
				<div class="error401-body-con-title">4<span class="error401-0-span"></span><span class="error401-key-span">1</span></div>
				<p class="error401-body-con-message">You don't have permission</p>
				<div class="error401-btn-con">
					<Button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</Button>
				</div>
			</Card>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Error401',
		methods: {
			backPage() {
				this.$router.go(-1);
			}
		}
	};
</script>