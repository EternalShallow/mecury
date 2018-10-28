<!-- 下单成功页面 -->
<template>
    <div class="checkoutSuccess iconfont">
        <header>
            <i class="icon-iconfontzhizuobiaozhunbduan22 icon"></i>
            <div>订单成功</div>
        </header>
        <article>
            <x-button type="primary" @click.native='onwholeTab'>查看订单</x-button>
            <x-button type="default" @click.native='goHome'>返回首页</x-button>
        </article>
    </div>
</template>
<script>
import { XButton } from 'vux'
export default {
    components: {
        XButton,
    },
    methods: {
        onwholeTab() {
            this.$router.push({
                path: '/weChat/member/wholeTab',
                query: {
                    _title: "全部"
                }
            });
        },
        goHome() {
            this.$router.push({
                path: '/weChat/home/index',
                query: {
                    _title: "首页"
                }
            });
        }
    }
}
</script>

<style lang="less" scoped>
.checkoutSuccess {
    header {
        margin-top: 20px;
        .icon {
            font-size: 80px;
            color: #029900;
            text-align: center;
            display: block;
        }
        div {
            text-align: center;
            margin-top: -15px;
            color: #666666;
            font-size: 14px;
        }
    }
    article {
        margin-top: 50px;
        button {
            display: block;
            width: 80%;
            border-radius: 5px;
            margin-top: 27px;
        }
    }
}
</style>

