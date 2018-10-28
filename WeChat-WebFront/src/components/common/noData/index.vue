<template>
	<article class="noData">
		<img src="./img/background.png" />
		<label>暂无数据</label>
	</article>
</template>

<script>
</script>
<style lang="less">
body,
html {
  background-color: #ffffff !important;
}
.noData {
  background: #ffffff;
  position: relative;
  padding-top: 80px;
  height: 100%;
  img {
    margin: 0 auto;
    display: block;
    width: 40%;
  }
  label {
    display: block;
    text-align: center;
    color: #999999;
    font-size: 13px;
    margin-top: 20px;
  }
}
</style>