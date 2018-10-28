<template>
	<div class="addClickTap">
		<Button type="primary" @click="modal1 = true">新增</Button><br />
		<Modal class="AddTableBtn" loading="true" v-model="modal1" title="新增表格" @on-ok="ok" @on-cancel="cancel" width="600">
			<table>
				<tr>
					<td width="100">版本类型：</td>
					<td>
						<Select v-model="selectedOption" filterable>
							<Option v-for="item in optionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
						</Select>
					</td>
				</tr>
				<tr>
					<td>版本Key：</td>
					<td>
						<Input size="small" v-model="value" placeholder="版本Key..."></Input>
					</td>
				</tr>
				<tr>
					<td>版本名称：</td>
					<td>
						<Input v-model="value" placeholder="版本名称..."></Input>
					</td>
				</tr>
				<tr>
					<td width="100">拷贝源版本：</td>
					<td>
						<Row>
							<Select v-model="copyVersion" filterable remote :remote-method="remoteMethod1" :loading="loading1">
								<Option v-for="(option, index) in options1" :value="option.value" :key="index">{{option.label}}</Option>
							</Select>
						</Row>
					</td>
				</tr>
			</table>
		</Modal>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				selectedOption: "",
				modal1: false, //用户添加按钮进行是否要加入事件
				optionList: [{
					value: 'settlement',
					label: '核算'
				}, {
					value: 'businessplan',
					label: '商业计划'
				}, {
					value: 'target',
					label: '目标'
				}, {
					value: 'forecast',
					label: '预测'
				}],
				copyVersion:"",//拷贝版本
				options1: [],
				loading1: true,
				list: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New hampshire', 'New jersey', 'New mexico', 'New york', 'North carolina', 'North dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode island', 'South carolina', 'South dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West virginia', 'Wisconsin', 'Wyoming']
			}
		},
		methods: {
			ok() {
				setTimeout(() => {
					this.$Message.info('异步关闭对话框');
					this.modal1 = false;
				}, 2000);
			},
			cancel() {
				this.$Message.info('单击“取消”成功');
			},
			remoteMethod1(query) {
				if(query !== '') {
					this.loading1 = true;
					setTimeout(() => {
						this.loading1 = false;
						const list = this.list.map(item => {
							return {
								value: item,
								label: item
							};
						});
						this.options1 = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
					}, 200);
				} else {
					this.options1 = [];
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.addClickTap {
		padding: 10px 0;
	}
	
	.AddTableBtn {
		ul {
			li {
				min-height: 30px;
				line-height: 20px;
				display: flex;
				align-items: Center;
				span {
					text-align: center;
				}
			}
		}
	}
	
	table {
		width: 88%;
		margin: 0 auto;
		border-radius: 5px;
		tr {
			height: 40px;
			td {
				border: 1px solid rgba(221, 221, 221, 0.26);
				&:first-child {
					text-align: right;
					border-right: none;
					font-size: 13px;
					color: #000000;
				}
				&:last-child {
					padding: 0 5px;
				}
			}
		}
	}
</style>