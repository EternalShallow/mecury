<template>
	<div class="error404">
		<div class="error404-body-con">
			<Card>
				<div class="error404-body-con-title">4<span>0</span>4</div>
				<p class="error404-body-con-message">YOU LOOK LOST</p>
				<div class="error404-btn-con">
					<Button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</Button>
				</div>
			</Card>
		</div>
	</div>
</template>

<script>
	import './less/404';
	export default {
		name: 'Error404',
		methods: {
			backPage() {
				this.$router.go(-1);
			}
		}
	};
</script>