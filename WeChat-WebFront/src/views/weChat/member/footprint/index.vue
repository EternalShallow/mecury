<!--我的足迹-->
<template>
	<div class="footprint iconfont ">
		<section v-for="v in 10">
			<img src="https://puboa.sogou-inc.com/moa/sylla/mapi/img?id=214507&s=1&w=250&h=250" />
			<div>
				<code>杰斯·M. 布莱利尔</code>
				<span class="ellipsis">谁是谁·启发精选世界名人传记系列：谁是爱</span>
			</div>
			<div>
				<span class="icon-gouwuche" @click="goShop"></span>
				<span class="icon-dustbin_icon" @click="del"></span>
			</div>
		</section>
	</div>
</template>

<script>
import '@/js/utils';
export default {
    data() {
        return {

        }
    },
    methods: {
        goShop() { //购物车功能
            utils.toast("购物车加入成功");
        },
        del() { //删除功能
            utils.toast("删除成功");
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

.footprint {
    section {
        .flex;
        border-bottom: 1px solid #dddddd;
        padding: 12px 20px;
        position: relative;
    }
    img {
        width: 30px;
        height: 50px;
    }
    div {
        margin-top: 2px;
        margin-left: 12px;
        code,
        span {
            display: block;
        }
        span {
            font-size: 16px;
        }
        &:nth-child(2) {
            width: 71%;
            margin-top: 6px;
            code {
                font-size: 13px;
            }
            span {
                margin-top: 3px;
                font-size: 14px;
            }
        }
        &:nth-child(3) {
            .flex;
            position: absolute;
            right: 4px;
            top: 17px;
            span {
                padding: 6px;
                font-size: 20px;
            }
        }
    }
}
</style>