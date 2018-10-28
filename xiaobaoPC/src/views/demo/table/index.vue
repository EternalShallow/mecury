<template>
	<div class="version_table">
		<Add />
		<Details :info="detailsInfo" ref="profile" />
		<Table :data="tableData1" :columns="tableColumns1" stripe ref="table" :loading="loading"></Table>
		<br />
		<div class="export">
			<div>
				<Button type="primary" size="large" @click="exportData(1)"><Icon type="ios-download-outline"></Icon> 导出原始数据</Button>
				<Button type="primary" size="large" @click="exportData(2)"><Icon type="ios-download-outline"></Icon> 导出排序和过滤后的数据</Button>
				<Button type="primary" size="large" @click="exportData(3)"><Icon type="ios-download-outline"></Icon> 导出自定义数据</Button>
			</div>
			<div class="export_page">
				<Page :total="total" :current="1" @on-change="changePage" show-elevator show-total></Page>
			</div>
		</div>
	</div>
</template>
<script>
	import Add from "./_add";
	import Details from "./_details";
	export default {
		components: {
			Add,
			Details,
		},
		data() {
			return {
				loading: true,
				total: 0, //页面数据总数
				detailsInfo: {}, //详情信息
				tableData1: [],
				tableColumns1: [{
					title: '版本名称',
					key: 'version_name'
				}, {
					title: '版本Key',
					align: "left",
					key: 'version_key'
				}, {
					title: '版本类型',
					key: 'type_id',
				}, {
					title: '创建者',
					key: 'user_id',
				}, {
					title: '最后修改时间',
					key: 'update_time',
					render: (h, params) => {
						return this.formatDate(new Date(params.row.update_time.time))
					}
				}, {
					title: '操作',
					key: 'action',
					width: 150,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('i', {
								props: {
									size: 16,
								},
								"class": "iconfont icon-chakan",
								style: {
									color: "#2b85e4"
									//这里是放置行内样式的
								},
								on: {
									click: () => {
										this.show(params.index)
									}
								}
							}),
							h('i', {
								props: {
									size: 14,
								},
								style: {
									color: "#12a25a"
									//这里是放置行内样式的
								},
								"class": "iconfont icon-xiugai1-copy",
								on: {
									click: () => {
										this.show(params.index)
									}
								}
							}),
							h('i', {
								props: {
									size: 14,
								},
								style: {
									color: "#ed3f14"
									//这里是放置行内样式的
								},
								"class": "iconfont icon-shanchu-copy",
								on: {
									click: () => {
										this.remove(params.index)
									}
								}
							})
						]);
					}
				}]
			}
		},
		created() {
			this.mockTableData1();
		},
		methods: {
			show(index) {
				this.detailsInfo = this.tableData1[index];
				this.$refs.profile.modal2 = true;
			},
			remove(index) {
				this.tableData1.splice(index, 1);
			},
			mockTableData1(num = 1) {
				/*
				//测试成功
				$.ajax({
					type: "get",
					url: "/mock/userInfo",
					dataType: "json",
					success: function(data) {
						console.log(data)
					}
				});
				*/

				/*$.ajax({
					type: "get",
					url: "/version/index",
					dataType: "json",
					success: function(data) {
						console.log(data)
					}
				});*/

				//读取JSON数据
				fetch("/version/index").then(response => response.json()).then(dataList => {
					dataList = dataList.pageUtil.records;
					this.total = dataList.length; //数据总数

					dataList = dataList.slice((num - 1) * 10, 10 * num);
					if(this.current > (this.total / 10)) {

					}
					setTimeout(() => {
						//关闭 lodding
						this.loading = false;
					}, 100)
					//当前页面加1
					this.tableData1 = dataList;
				}).catch(e => console.log("错误信息：", e))
			},
			formatDate(date) {
				const y = date.getFullYear();
				let m = date.getMonth() + 1;
				m = m < 10 ? '0' + m : m;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;

				let hh = date.getHours(); //获取系统时，
				let mm = date.getMinutes(); //分
				let ss = date.getSeconds(); //秒

				return y + '-' + m + '-' + d + " " + hh + ":" + mm + ":" + ss;
			},
			exportData(type) {
				if(type === 1) {
					this.$refs.table.exportCsv({
						filename: '原始数据',
						separator: ';',
						quoted: true,
						callback(data) {
							console.log(data);
						}
					});
				} else if(type === 2) {
					this.$refs.table.exportCsv({
						filename: '排序和过滤后的数据',
						original: false
					});
				} else if(type === 3) {
					this.$refs.table.exportCsv({
						filename: '自定义数据',
						columns: this.tableColumns1.filter((col, index) => index < 4),
						data: this.tableData1.filter((data, index) => index < 4)
					});
				}
			},
			changePage(num) {
				// 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
				this.tableData1 = this.mockTableData1(num);
			}
		},
		mounted() {

		}

	}
</script>
<style lang="less">
	@import url("../../../assets/css/fonts.less");
	.version_table{
		background: #ffffff;
		border: 1px solid #f3f3f3;
		padding: 0 12px 50px;
		margin: 20px 0;
		border-radius: 8px;
	}
	.export {
		display: flex;
		display: -webkit-flex;
		display: -webkit-box;
		position: rrelative;
		&:first-child div {
			border: 1px solid red;
			margin: 10px;
			overflow: hidden;
		}
		&:last-child .export_page {
			position: absolute;
			right:3%;
		}
	}
	
	table img {
		width: 36px;
		height: 34px;
		border-radius: 50px;
	}
	
	i {
		cursor: pointer;
		margin-right: 5px;
	}
</style>