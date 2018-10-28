<template>

    <div class="sowingMap" ref="sowingMap">
        <article class="imgBor">
            <img :class="imgIndex == 1?'img1':''" :src="URL+'img/active/active00'+imgIndex+'.jpg'" />
            <section v-if="imgIndex == 1">
                <router-link tag="div" :to="{ path: '/weChat/member/membershipCard'}"></router-link>
                <router-link tag="div" :to="{ path: '/weChat/member/membershipCard'}"></router-link>
                <qrcode :value="barCode" size="125" class="qrcode"></qrcode>
            </section>
        </article>
    </div>
</template>

<script>
import { Qrcode } from 'vux';
import api from './api';
export default {
    data() {
        return {
            barCode: "",
            URL: utils.url.curr,
            imgIndex: "1"
        }
    },
    components: {
        Qrcode,
    },
    created() {

        let imgIndex = utils.url.getParamObj().imgIndex || "";
        this.imgIndex = imgIndex || "1";

        let fid = utils.url.getParamObj().fid || utils.Cookie.getCookie("fid") || "";
        if (fid) {
            api.wpQrcode(fid, req => {
                if (req.code == 200) {
                    this.barCode = req.data;
                }
            })
        }


        //微信分享
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            let share = require('@/js/utils/allShare.js').default,
                URL = "";
            if (fid) {
                URL += URL.indexOf('?') == -1 ? '?fid=' + fid : '&fid=' + fid;
            }
            share.shareAll({
                desc: "【小宝图书馆】iRead Library Online",
                URL: window.location.origin + window.location.pathname + URL + "&imgIndex=" + imgIndex + "#/active/sowingMap",
            })
        }
    },
    mounted() {

        if (this.imgIndex == 1) {
            this.$refs.sowingMap.style.height = (window.screen.availHeight - 100) + "px";
            this.$refs.sowingMap.style.minHeight = (window.screen.availHeight - 100) + "px";
        }

        let color = "";
        switch (this.imgIndex) {
            case "1":
                color = "#65cade"
                break;
            case "2":
                color = "#febd17"
                break;
            case "3":
                color = "#d5edfa"
                break;
            default:
                break;
        }
        document.body.style.background = color;
    },

}
</script>

<style lang="less" scoped>
.sowingMap {
    width: 100%;
    .imgBor {
        width: 100%;
        -webkit-overflow-scrolling: touch;
        position: absolute;
        overflow-x: hidden;
        height: 99.8%;
        img {
            width: 100%;
            height: auto;
            position: absolute;
            top: 0;
            z-index: 0;
            left: 0;
            right: 0;
            margin: 0 auto;
        }
        .img1 {
            height: 1565px;
            min-height: 1565px;
        }
        section {
            width: 100%;
            div {
                width: 80%;
                margin: 0 auto;
                height: 60px;
                min-height: 60px;
                position: absolute;
                left: 0;
                right: 0;
                &:nth-child(1) {
                    top: 337px;
                }
                &:nth-child(2) {
                    top: 673px;
                }
            }
            .qrcode {
                top: 1383px;
                left: 0;
                right: 0;
                text-align: center;
                img {
                    padding: 5px;
                    background: #ffffff;
                }
            }
        }
    }
}
.qutsideSowingMap {
    margin-top: 0;
}
</style>

