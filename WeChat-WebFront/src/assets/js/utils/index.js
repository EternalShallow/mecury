const sendVerifyCode = require("./sendVerifyCode.js").default;
const showLoading = require("./loadding.js").default;

! function (wd) {
	var utils = {
		os: {},
		url: {
			curr: (window.location.origin + "/") || "http://52read.vip/"
		},
		date: {} //日期类型格式化
	};
	/**
	 * 判断个浏览器内核版本
	 */
	utils.os.versions = function () {
		var platform = window.navigator.userAgent;
		var result = {
			trident: platform.indexOf('Trident') > -1, //IE内核
			presto: platform.indexOf('Presto') > -1, //opera内核
			webKit: platform.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: platform.indexOf('Gecko') > -1 && platform.indexOf('KHTML') == -1, //火狐内核
			mobile: !!platform.match(/AppleWebKit.*Mobile.*/) || !!platform.match(/AppleWebKit/), //是否为移动终端
			ios: !!platform.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: platform.indexOf('Android') > -1 || platform.indexOf('Linux') > -1, //android终端或者uc浏览器
			iPhone: platform.indexOf('iPhone') > -1 || platform.indexOf('Mac') > -1, //是否为iPhone或者安卓QQ浏览器
			iPad: platform.indexOf('iPad') > -1, //是否为iPad
			webApp: platform.indexOf('Safari') == -1, //是否为web应用程序，没有头部与底部
			weixin: platform.indexOf('MicroMessenger') == -1 //是否为微信浏览器
		};
		return result;
	}
	/**
	 * 吐司
	 * @param {Object} msg
	 * @param {Object} time
	 */
	utils.toast = function (msg, time) {
		let d = document,
			q = "querySelector";
		var col = '#ffffff';
		var alertDiv = d[q]('#alertDiv');
		if (!alertDiv) {
			var val = "<div id='alertDiv' style='top:40%;height:auto;background:rgba(0,0,0,0.7);border-radius:13px;position:fixed;z-index:1000; box-shadow:2px 2px 10 #000;  line-height:25px;text-align:center;font-size:16px;color:" + col + ";max-width:70%; padding:20px 25px; '>" + msg + "</div>";
			let div = d.createElement("div");
			div.innerHTML = val;

			d.body.appendChild(div);
			alertDiv = d.getElementById('alertDiv');

			var toastWidth = alertDiv.offsetWidth;
			toastWidth = parseInt(toastWidth);
			var windowWidth = d.body.clientWidth;
			var marginLeft = (windowWidth - toastWidth) / 2;
			alertDiv.style.marginLeft = marginLeft + "px";
			alertDiv.style.display = "block";
			setTimeout(function () {
				div.remove();
			}, time || 2000);
		}
	}
	/**
	 * 获取浏览器地址
	 * @param {Object} key
	 */
	utils.url.getParamValue = function (key) {
		var resultValue = "";
		var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
		var value = (window.location.search).substr(1).match(reg);
		if (value != null)
			resultValue = value[2];
		return resultValue;
	}
	utils.url.getParamObj = function () {
		var url = location.search || location.href;
		var _ParamObj = new Object();
		//判断获取url中"?"符后的字串，并截取存储
		if (url.indexOf("?") != -1) {
			var paramStr = url.substr(url.indexOf("?") + 1);
			var paramArray = paramStr.split("&");
			for (var i = 0; i < paramArray.length; i++) {
				_ParamObj[paramArray[i].split("=")[0]] = (paramArray[i].split("=")[1]);
			}
		}
		return _ParamObj;
	}
	utils.url.changeURLArg = function (url, params) {
		/* 
		 * url 目标url 
		 * arg 需要替换的参数名称 
		 * arg_val 替换后的参数的值 
		 * return url 参数替换后的url 
		 */
		var URLArg = function (url, arg, arg_val, params) {
			var pattern = arg + '=([^&]*)';
			params.isFlag ? (arg_val = encodeURIComponent(arg_val)) : arg_val;
			var replaceText = arg + '=' + arg_val;
			if (url.match(pattern)) {
				var tmp = '/(' + arg + '=)([^&]*)/gi';
				tmp = url.replace(eval(tmp), replaceText);
				return tmp;
			} else {
				if (url.match('[\?]')) {
					return url + '&' + replaceText;
				} else {
					return url + '?' + replaceText;
				}
			}
			return url + '\n' + arg + '\n' + arg_val;
		}

		var data = params.data;
		for (var name in data) {
			return URLArg(url, name, data[name], params);
		}

	}

	/**
	 * 浏览器复制
	 * @param {Object} copybtn
	 * @param {Object} callback
	 */
	utils.copyText = function (copybtn, callback) {
		copybtn = event || document.querySelector(copybtn);
		copybtn.addEventListener('click', () => {
			let copyTextarea = document.querySelector(copybtn.getAttribute("data-copy")); //要拷贝的文本
			(copyTextarea.nodeName === 'INPUT' || copyTextarea.nodeName === 'TEXTAREA') ? copyTextarea.select() : this.copySelectText(copyTextarea);
			copyTextarea.focus();
			try {
				let successful = document.execCommand('copy');
				callback(successful);
			} catch (err) {
				console.log('哎呀，无法复制');
				callback(false);
			}
		});
		var copySelectText = function (copyTextarea) {
			if (copyTextarea.hasAttribute('contenteditable')) {
				copyTextarea.focus();
			}
			if (document.selection) {
				let range = document.body.createTextRange();
				range.moveToElementText(copyTextarea);
				range.select();
			} else if (window.getSelection) {
				let selection = window.getSelection();
				let range = document.createRange();

				range.selectNodeContents(copyTextarea);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		}
	}
	/**
	 * 日期类型格式化
	 * @param {Object} time
	 * @param {Object} format
	 */
	utils.date.timeToStr = function (time, format) {
		if (format == undefined) {
			format = "yyyy-MM-dd hh:mm:ss";
		}
		var dateIN = new Date(time);
		var date = {
			"M+": dateIN.getMonth() + 1,
			"d+": dateIN.getDate(),
			"h+": dateIN.getHours(),
			"m+": dateIN.getMinutes(),
			"s+": dateIN.getSeconds(),
			"q+": Math.floor((dateIN.getMonth() + 3) / 3),
			"S+": dateIN.getMilliseconds()
		};
		if (/(y+)/i.test(format)) {
			format = format.replace(RegExp.$1, (dateIN.getFullYear() + '').substr(4 - RegExp.$1.length));
		}
		for (var k in date) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
					date[k] : ("00" + date[k]).substr(("" + date[k]).length));
			}
		}
		return format;
	}
	/**
	  //获取最近7天日期
		getDay(0);//当天日期
		getDay(-7);//7天前日期
		 
		//获取最近3天日期
		getDay(0);//当天日期
		getDay(-3);//3天前日期
	*/
	utils.date.getDay = function (day) {
		var today = new Date(),
			doHandleMonth = function (month) {
				var m = month;
				if (month.toString().length == 1) {
					m = "0" + month;
				}
				return m;
			}

		var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;

		today.setTime(targetday_milliseconds); //注意，这行是关键代码

		var tYear = today.getFullYear();
		var tMonth = today.getMonth();
		var tDate = today.getDate();
		tMonth = doHandleMonth(tMonth + 1);
		tDate = doHandleMonth(tDate);
		return tYear + "-" + tMonth + "-" + tDate;
	}

	utils.Cookie = {
		/**
		 * 设置Cookie
		 */
		setCookie: function (name, value) {
			var expire = new Date((new Date()).getTime() + 30 * 24 * 3600000);
			expire = "; expires=" + expire.toGMTString();
			document.cookie = name + "=" + escape(value) + expire + "; path=/";
		},
		/**
		 * 清空全部cookie的值
		 */
		clearCookie: function () {
			var cookies = document.cookie.split(";");
			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i];
				var eqPos = cookie.indexOf("=");
				var key = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
				libUtils.delCookie(key);
			}
		},
		/**
		 * 删除cookie某一个key
		 */
		delCookie: function (key) {
			document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
		},
		/**
		 * 读取Cookie
		 */
		getCookie: function (name) {
			var cookieValue = "";
			var search = name + "=";
			if (document.cookie.length > 0) {
				var offset = document.cookie.indexOf(search);
				if (offset != -1) {
					offset += search.length;
					var end = document.cookie.indexOf(";", offset);
					if (end == -1)
						end = document.cookie.length;
					cookieValue = unescape(document.cookie.substring(offset, end))
				}
			}
			return cookieValue;
		}

	}


	/**
	 * 发送短信验证码
	 */
	utils.sendCode = sendVerifyCode;
	utils.view = showLoading;
	wd.utils = utils;
}(window)