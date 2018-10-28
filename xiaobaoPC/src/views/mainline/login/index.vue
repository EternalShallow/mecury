<template>
	<div class="login" ref="video" @keydown.enter="handleSubmit">
		<img class="login-sogo-logo" src="http://polymax.top/img/xiaobao.jpeg" />
		<div class="login-con">
			<Card :bordered="false" class = "card-con">
				<p slot="title">
					<Icon type="log-in"></Icon>
					欢迎登录
				</p>
				<div class="form-con">
					<Form ref="loginForm" :model="form" :rules="rules">
						<FormItem prop="userName">
							<Input v-model="form.userName" placeholder="请输入用户名">
								<span slot="prepend">
										<Icon :size="16" type="person"></Icon>
								</span>
							</Input>
						</FormItem>
						<FormItem prop="password">
							<Input type="password" v-model="form.password" placeholder="请输入密码">
								<span slot="prepend">
										<Icon :size="14" type="locked"></Icon>
								</span>
							</Input>
						</FormItem>
						<FormItem>
							<Button @click="handleSubmit" type="primary" long>登录</Button>
						</FormItem>
					</Form>
					<p class="login-tip">输入任意用户名和密码即可</p>
				</div>
			</Card>
		</div>
	</div>
</template>
<style lang="less" >
@import "./less/index";
</style>

<script>
import Cookies from 'js-cookie';
export default {
	data() {
		return {
			form: {
				userName: 'sysadmin',
				password: ''
			},
			rules: {
				userName: [{
					required: true,
					message: '账号不能为空',
					trigger: 'blur'
				}],
				password: [{
					required: true,
					message: '密码不能为空',
					trigger: 'blur'
				}]
			}
		};
	},
	mounted() { },
	methods: {
		handleSubmit() {
			this.$refs.loginForm.validate((valid) => {
				if (valid) {
					Cookies.set('user', this.form.userName);
					Cookies.set('password', this.form.password);
					this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
					if (this.form.userName === 'sysadmin') { //最高权限登录
						Cookies.set('access', 0);
					} else {
						Cookies.set('access', 1);
					}
					this.$router.push({
						name: 'home_index'
					});
				}
			});
		},
	}
};
</script>