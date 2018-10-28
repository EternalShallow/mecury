<!-- 活动列表 -->
<template>
    <div class="activeList">
        <h4 align="center">活动页面，欢迎来到小宝图书馆</h4>
        <div class="qrcode">
            <qrcode :value="barCode" size="180" class="qrcode"></qrcode>
        </div>
    </div>
</template>
<script>
import { Qrcode } from 'vux';
import api from './api';
export default {
    data() {
        return {
            barCode: ""
        }
    },
    components: {
        Qrcode,
    },
    created() {
        let fid = utils.url.getParamObj().fid;
        if (fid) {
            api.wpQrcode(fid, req => {
                if (req.code == 200) {
                    this.barCode = req.data;
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.activeList {
    h4 {
        margin: 20px 0;
    }
    .qrcode {
        text-align: center;
        margin: 0 auto;
    }
}
</style>

