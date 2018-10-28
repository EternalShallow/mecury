import api from "components/main/api";
export default {
	URL: "/minos-bookstore/watch-book",
	getListInfo(cb) {
		api.com({
			url: `${this.URL}/info`
		}, cb);
	},
	/**收藏 */
	showWatch(param, cb) {
		api.com({
			type: "post",
			data: JSON.stringify(param.data),
			url: `${this.URL}/watch`
		}, cb);
	},
	/**取消收藏 */
	cancelWatch(param, cb) {
		api.com({
			type: "post",
			data: JSON.stringify(param.data),
			url: `${this.URL}/cancel`
		}, cb);
	}

};