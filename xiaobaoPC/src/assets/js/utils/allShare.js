/**
 * 微信分享
 */
let wx = require('@/js/version/jweixin-1.2.0.min.js');

export default {
	share(dataInfo) {

		let ua = navigator.userAgent,
			isWX = ua.match(/MicroMessenger\/([\d\.]+)/)
		if(!isWX) return false;

		let noncestr = ((len) => {
			len = len || 32;
			let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
				maxPos = $chars.length,
				pwd = '';
			for(let i = 0; i < len; i++) {
				pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
			}
			return pwd;
		})();
		let timestamp = String(Date.parse(new Date())).substr(0, 10),
			url = window.location.href.split("#")[0],
			encodeUrl = encodeURIComponent(url),
			signature;

		$.ajax({
			type: 'get',
			url: '/weixin/getWeiXinShareData.shtml?shareUrl=' + encodeUrl + '&nonceStr=' + noncestr + '&timestamp=' + timestamp,
			async: false,
			success: function(data) {
				data = typeof(data) == "string" ? JSON.parse(data) : data;
				if(data && data.status == 1) {
					signature = data.signature;
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
					appId: 'wxb153e875fab81954',
					timestamp: timestamp,
					nonceStr: noncestr,
					signature: signature
				},
				callback: dataInfo.callback
			});
		} catch(e) {
			console.error(e);
		}
	},
	_initWX(data) {

		if(!data.WXconfig) return;
		if(!wx.config) wx = window.wx;
		var conf = data.WXconfig;
		wx.config({
			debug: false,
			appId: conf.appId,
			timestamp: conf.timestamp,
			nonceStr: conf.nonceStr,
			signature: conf.signature,
			jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone"]
		});
		wx.error(function(res) {});
		wx.ready(function() {
			var config = {
				title: data.title,
				desc: data.summary,
				link: data.url,
				imgUrl: data.pic,
				type: "",
				dataUrl: "",
				success: function() {
					data.callback && data.callback();
				},
				cancel: function() {
					data.cancelback && data.cancelback();
				}
			};
			wx.onMenuShareAppMessage(config);
			wx.onMenuShareQQ(config);
			wx.onMenuShareQZone(config);
			if(conf.swapTitleInWX) {
				wx.onMenuShareTimeline({
					title: data.summary,
					desc: data.title,
					link: data.url,
					imgUrl: data.pic,
					type: "",
					dataUrl: "",
					success: function() {
						data.callback && data.callback();
					},
					cancel: function() {
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

		if(typeof WeixinJSBridge == "undefined") {
			if(document.addEventListener) {
				document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
			} else if(document.attachEvent) {
				document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
				document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
			}
		} else {
			onBridgeReady();
		}
	},
}