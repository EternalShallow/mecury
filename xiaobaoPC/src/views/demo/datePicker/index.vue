<template>
	<div class="data">
		<Row class="data-title">日期限制选择器</Row>
		<Row>
			<Col span="12">
				<DatePicker type="date" confirm placeholder="Select date" style="width: 200px"></DatePicker>
			</Col>
			<Col span="12">
				<DatePicker type="daterange" confirm placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
			</Col>
		</Row>
	</div>
</template>
<style scoped lang="less">
	
	.data {
		width: 428px;
		&-title{
			font-size: 16px;
			margin-bottom: 12px;
		}
	}
</style>