<!-- 购买会员卡信息详情 - 暂时不用 2018-5-26 -->
<template>
    <div class="shipCardDetail">
        <header>
            
        </header>
        <div class="btns">
            <x-button type="primary" @click="pay(info.id)">立即支付</x-button>
        </div>
    </div>
</template>
<script>
import { XButton } from 'vux';
import api from "../membershipCard/api/";
export default {
    data() {
        return {
            info: ""
        }
    },
    components: {
        XButton
    },
    created() {
        let pay = utils.Cookie.getCookie("payDetails") || "";
        pay = decodeURIComponent(decodeURI(pay));
        if (pay) pay = JSON.parse(pay);
        this.info = pay;
    },
    methods: {
        pay(val) {
            api.payTab(val, req => {
                if (req.code == 200) {
                    api.goodBuy(req.data, req1 => {
                        if (req1.code == 200) {
                            allShare.onBridgeReadyPay(req1.data);
                        }
                    })
                }
            })
        }
    }

}
</script>
<style lang="less" scoped>
.shipCardDetail {
    .btns {
        height: 50px;
        left: 0;
        right: 0;
        margin: 0 auto;
        color: #333;
        font-size: 14px;
        position: fixed;
        z-index: 99;
        bottom: 0;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        bottom: 0;

        &-checkBoxBook {
            width: 100%;
            height: 50px;
            .weui-check_label {
                padding: 15px;
            }
        }
        button {
            border-radius: 0;
            right: 0;
            height: 100%;
            position: absolute;
            font-size: 16px;
            &:after {
                border-radius: 0;
            }
        }
    }
}
</style>