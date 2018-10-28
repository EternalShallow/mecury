/**
 * 微信分享
 */
let wx = require('../version/jweixin-1.2.0.min.js');

export default {
	share(dataInfo) {

		let ua = navigator.userAgent,
			isWX = ua.match(/MicroMessenger\/([\d\.]+)/)
		if (!isWX) return false;
		let url = window.location.href.split("#")[0],
			obj = {};
		_$.ajax({
			type: 'post',
			url: '/minos-weixin/js/config',
			data: url,
			async: false,
			success: function (data) {
				data = typeof (data) == "string" ? JSON.parse(data) : data;
				if (data && data.code == 200) {
					obj = data.data;
				} else {
					console.log(data.message)
				}
			}
		});
		try {
			this._initWX({
				title: dataInfo.shareTitle,
				summary: dataInfo.shareDesc,
				pic: dataInfo.shareImgUrl,
				url: dataInfo.shareUrl,
				WXconfig: {
					swapTitleInWX: true,
					appId: obj.config.appId,
					timestamp: obj.config.timestamp,
					nonceStr: obj.config.nonceStr,
					signature: obj.config.signature,
					jsApiList: obj.config.jsApiList
				},
				callback: dataInfo.callback
			});
		} catch (e) {
			console.error(e);
		}
	},
	_initWX(data) {

		if (!data.WXconfig) return;
		if (!wx.config) wx = window.wx;
		var conf = data.WXconfig;
		wx.config({
			debug: false,
			appId: conf.appId,
			timestamp: conf.timestamp,
			nonceStr: conf.nonceStr,
			signature: conf.signature,
			jsApiList: conf.jsApiList
		});
		wx.error(function (res) { });
		wx.ready(function () {
			var config = {
				title: data.title,
				desc: data.summary,
				link: data.url,
				imgUrl: data.pic,
				type: "",
				dataUrl: "",
				success: function () {
					data.callback && data.callback();
				},
				cancel: function () {
					data.cancelback && data.cancelback();
				}
			};
			wx.onMenuShareAppMessage(config);
			wx.onMenuShareQQ(config);
			wx.onMenuShareQZone(config);
			if (conf.swapTitleInWX) {
				wx.onMenuShareTimeline({
					title: data.summary,
					desc: data.title,
					link: data.url,
					imgUrl: data.pic,
					type: "",
					dataUrl: "",
					success: function () {
						data.callback && data.callback();
					},
					cancel: function () {
						data.cancelback && data.cancelback();
					}
				});
			} else {
				wx.onMenuShareTimeline(config);
			}
		});

	},
	/*
	 * 隐藏分享按钮
	 */
	hideWXShare() {
		let onBridgeReady = () => {
			WeixinJSBridge.call('hideOptionMenu');
		}

		if (typeof WeixinJSBridge == "undefined") {
			if (document.addEventListener) {
				document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
			} else if (document.attachEvent) {
				document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
				document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
			}
		} else {
			onBridgeReady();
		}
	},
	//微信支付
	onBridgeReadyPay(param, cb) {
		function onBridgeReady() {
			WeixinJSBridge.invoke(
				'getBrandWCPayRequest', {
					"appId": param.appId,     //公众号名称，由商户传入     
					"timeStamp": param.timeStamp,         //时间戳，自1970年以来的秒数     
					"nonceStr": param.nonceStr, //随机串     
					"package": param.package,
					"signType": param.signType,         //微信签名方式：     
					"paySign": param.paySign//微信签名 
				},
				function (res) {
					if (res.err_msg == "get_brand_wcpay_request:ok") {
						cb && cb(res);
					}// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
				}
			);
		}
		if (typeof WeixinJSBridge == "undefined") {
			if (document.addEventListener) {
				document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
			} else if (document.attachEvent) {
				document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
				document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
			}
		} else {
			onBridgeReady();
		}
	},
	shareAll(param) {
		let ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			this.share({
				shareTitle: param.title || "小宝图书馆",
				shareDesc: param.desc || "【小宝图书馆】iRead Library Online",
				shareImgUrl: param.img || "http://polymax.top/img/xiaobao.jpeg",
				shareUrl: param.URL || (window.location.origin + window.location.pathname),
			})
		}
	}


}