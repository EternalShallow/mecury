import api from "components/main/api";
export default {
    URL: "/minos-bookstore",
    getQaOnline(cb) {
        api.com({
            url: `${this.URL}/api/qa/list-online`
        }, cb);
    },
    
};