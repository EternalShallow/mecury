import api from "components/main/api";
export default {
    wpQrcode(id, cb) {
        api.com({
            url: `/minos-weixin/api/wp-qrcode/${id}`
        }, cb);
    }
}