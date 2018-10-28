<!--专题-->
<template>
	<div class="special iconfont ">
		<article>
			<div class="special-title">专题列表</div>
			<section class="item-list" @click="btnTab">
				<img src="https://puboa.sogou-inc.com/moa/sylla/mapi/img?id=214507&s=1&w=250&h=250;" />
				<div>
					<section>
						<span class="ellipsis">作者：遇见美好的 悦读奇缘亲</span>
						<code>2018-03-09 - 2018-04-02</code>
					</section>
					<span class="details">当当销售四十万“遇见美好”系列，来到悦读奇缘</span>
					<i class="icon-youjiantou"></i>
				</div>
			</section>
			<section class="item-list" @click="btnTab">
				<img src="https://puboa.sogou-inc.com/moa/sylla/mapi/img?id=214507&s=1&w=250&h=250;" />
				<div>
					<section>
						<span class="ellipsis">作者：遇见美好的 悦读奇缘亲</span>
						<code>2018-03-09 - 2018-04-02</code>
					</section>
					<span class="details">当当销售四十万“遇见美好”系列，来到悦读奇缘</span>
					<i class="icon-youjiantou"></i>
				</div>
			</section>
		</article>
	</div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        btnTab() { //详情
            utils.toast("查看详情");
        }
    }
}
</script>


<style lang="less" scoped>
.flex {
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
}

.special {
    &-title {
        display: block;
        padding: 20px 20px 8px;
        font-size: 18px;
        font-weight: 500;
        border-bottom: 1px solid #dddddd;
    }
    .item-list {
        .flex;
        position: relative;
        border-bottom: 1px solid #dddddd;
        padding: 16px;
        img {
            width: 60px;
            height: 60px;
            margin-right: 8px;
            border: 1px solid #dddddd;
        }
        div {
            width: 80%;
            section {
                .flex;
                span,
                code {
                    display: block;
                }
                span {
                    font-size: 14px;
                    color: #000000;
                    width: 60%;
                    &:nth-child(1) {
                        font-size: 14px;
                    }
                }
                code {
                    width: 40%;
                    min-width: 150px;
                    text-align: right;
                    font-size: 12px;
                    color: #666666;
                    right: 8px;
                    top: 17px;
                }
            }
        }
        .details {
            font-size: 14px;
            display: block;
            line-height: 18px;
            margin-top: 2px;
        }
        i {
            position: absolute;
            right: 0;
            top: 30%;
            font-size: 26px;
        }
    }
}
</style>