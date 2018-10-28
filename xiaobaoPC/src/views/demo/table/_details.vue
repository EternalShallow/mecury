<template>
	<Modal v-model="modal2" title="详细信息">
		<table>
			<tr>
				<td width="100">版本名称：</td>
				<td>{{info.version_name}}</td>
			</tr>
			<tr>
				<td>版本key：</td>
				<td>{{info.version_key}}</td>
			</tr>
			<tr>
				<td>类型：</td>
				<td>{{info.type_id}}</td>
			</tr>
			<tr>
				<td>显示状态：</td>
				<td>{{info.edit_status}}</td>
			</tr>
			<tr>
				<td>编辑期间：</td>
				<td>{{info.edit_period}}</td>
			</tr>
			<tr>
				<td>编辑标签：</td>
				<td>{{info.edit_type}}</td>
			</tr>
		</table>
		<div slot="footer">
			<Button type="primary" key="power" size="large" @click="ok"><Icon type="power"></Icon>关闭</Button>
		</div>
	</Modal>
</template>

<script>
	export default {
		props: ["info", "methnd"],
		data() {
			return {
				modal2: false
			}
		},
		methods: {
			ok() {
				this.modal2 = false;
			},
		},
		mounted() {}
	}
</script>
<style scoped lang="less">
	table {
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
					padding: 5px;
				}
			}
		}
	}
</style>