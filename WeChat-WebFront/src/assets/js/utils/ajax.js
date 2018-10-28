! function (wd) {
	wd._$ = new function () {
		//ajax模块
		let Ajax = {
			//ajax模块
			init: function (obj) {
				//初始化数据
				var objAdapter = {
					url: obj.url || '',
					type: obj.type || 'get',
					dataType: obj.dataType || "json",
					data: (obj.type && obj.type.toLowerCase() == "get" ? (Ajax.params(obj.data)) : obj.data) || "get",
					contentType: obj.contentType || 'application/json',
					success: obj.success || function () { },
					complete: obj.complete || function () { },
					error: obj.error || function (s) {
						alert('status:' + s + 'error!');
					},
					accepts: {
						script: 'text/javascript, application/javascript, application/x-javascript',
						json: 'application/json',
						xml: 'application/xml, text/xml',
						html: 'text/html',
						text: 'text/plain'
					},
					async: obj.async ? true : false
				}
				//通过使用JS随机字符串解决IE浏览器第二次默认获取缓存的问题
				return objAdapter;
			},
			//创建XMLHttpRequest对象
			createXHR: function () {
				if (window.XMLHttpRequest) { //IE7+、Firefox、Opera、Chrome 和Safari
					return new XMLHttpRequest();
				} else if (window.ActiveXObject) { //IE6 及以下
					var versions = ['MSXML2.XMLHttp', 'Microsoft.XMLHTTP'];
					for (var i = 0, len = versions.length; i < len; i++) {
						try {
							return new ActiveXObject(version[i]);
							break;
						} catch (e) {
							//跳过
							console.error(e);
						}
					}
				} else {
					throw new Error('浏览器不支持XHR对象！');
				}
			},
			paramsData: function (options) {
				function appendQuery(url, query) {
					if (query == '') return url
					return (url + '&' + query).replace(/[&?]{1,2}/, '?')
				}

				if (options.data)
					options.data = Ajax.params(options.data)
				if (options.data && (!options.type || options.type.toUpperCase() == 'GET' || 'jsonp' == options.dataType)) {
					options.url = appendQuery(options.url, options.data), options.data = undefined
				}
				return options;
			},
			params: function (data) {
				var arr = [];
				for (var i in data) {
					//特殊字符传参产生的问题可以使用encodeURIComponent()进行编码处理
					arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
				}
				return arr.join('&');
			},
			callback: function (obj, xhr) {
				var result, dataType, error = false;
				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) { // || (xhr.status === 0 && protocol === 'file:')) {
					if (xhr.responseType === 'arraybuffer' || xhr.responseType === 'blob') {
						result = xhr.response;
					} else {
						result = xhr.responseText;
						dataType = obj.dataType ? obj.dataType : xhr.getResponseHeader('content-type').split(';', 1)[0];
						for (var i in obj.accepts) {
							if (obj.accepts.hasOwnProperty(i) && obj.accepts[i].indexOf(dataType) > -1) dataType = i;
						}
						try {
							if (dataType === 'script') {
								eval(result);
							} else if (dataType === 'xml') {
								result = xhr.responseXML
							} else if (dataType === 'json' || dataType == "application/json") {
								result = result.trim() === '' ? null : JSON.parse(result)
							}
						} catch (e) {
							obj.error && obj.error(e, xhr);
							xhr.abort();
						}
					}
					obj.success && obj.success(result, xhr);
				} else {
					obj.error && obj.error(xhr.statusText, xhr);
				}
			},
			ajax: function (obj) {
				if (obj.type && obj.type.toLowerCase() === 'post') {
					Ajax.post(obj);
				} else {
					Ajax.get(obj);
				}
			},
			//post方法
			post: function (obj) {
				var xhr = Ajax.createXHR(); //创建XHR对象
				var opt = Ajax.init(obj);
				opt.type = 'post';
				if (opt.async === true) { //true表示异步，false表示同步
					//使用异步调用的时候，需要触发readystatechange 事件
					xhr.onreadystatechange = function () {
						if (xhr.readyState == 4) { //判断对象的状态是否交互完成
							Ajax.callback(opt, xhr); //回调
						}
					};
				}
				//在使用XHR对象时，必须先调用open()方法，
				//它接受三个参数：请求类型(get、post)、请求的URL和表示是否异步。
				xhr.open(opt.type, opt.url, opt.async);
				//post方式需要自己设置http的请求头，来模仿表单提交。
				//放在open方法之后，send方法之前。
				xhr.setRequestHeader('Content-Type', opt.contentType ? opt.contentType : 'application/x-www-form-urlencoded');
				xhr.send(opt.data); //post方式将数据放在send()方法里
				if (opt.async === false) { //同步
					Ajax.callback(opt, xhr); //回调
				}
			},
			//get方法
			get: function (obj) {
				var xhr = Ajax.createXHR(); //创建XHR对象
				var opt = Ajax.init(obj);
				if (opt.async === true) { //true表示异步，false表示同步
					//使用异步调用的时候，需要触发readystatechange 事件
					xhr.onreadystatechange = function () {
						if (xhr.readyState == 4) { //判断对象的状态是否交互完成
							Ajax.callback(obj, xhr); //回调
						}
					};
				}
				//若是GET请求，则将数据加到url后面
				/* opt.url += opt.url.indexOf('?') == -1 ? '?' + opt.data : '&' + opt.data;
				opt.url += opt.url.indexOf('?') == -1 ? '?' + ('_=' + (new Date().getTime())) : '&' + ('_=' + new Date().getTime()); */

				//在使用XHR对象时，必须先调用open()方法，
				//它接受三个参数：请求类型(get、post)、请求的URL和表示是否异步。
				xhr.open(opt.type, opt.url, opt.async);
				xhr.send(null); //get方式则填null
				if (opt.async === false) { //同步
					Ajax.callback(opt, xhr); //回调
				}
			}
		};
		return Ajax;
	}

	/**
	 *  fetch get请求
	 * @param {Object} param
	 */
	wd.getFetch = function (param) {
		if (param.data) {
			let paramsArray = [];
			//拼接参数  
			Object.keys(param.data).forEach(key => paramsArray.push(key + '=' + param.data[key]))
			if (param.path.search(/\?/) === -1) {
				param.path += '?' + paramsArray.join('&')
			} else {
				param.path += '&' + paramsArray.join('&')
			}
		}
		window.fetch(param.path, {
			mode: "no-cors",
			type: 'GET',
			credentials: "include", //same-origin
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		}).then((rep) => rep.json()).then(data => {
			param.success && param.success(data);
		}).catch(function (error) {
			param.error && param.error(error);
		});

	}
	/**
	 * fetch post请求
	 * @param {Object} param
	 */
	wd.postFetch = function (param) {
		var fromData = new FormData();
		if (param.data) {
			for (var key in param.data) {
				fromData.append(key, data[key]);
			}
		}
		window.fetch(param.path, {
			mode: "cors", //"no-cors",
			type: 'POST',
			cache: 'default',
			credentials: "include", //same-origin
			headers: {
				'Accept': 'application/x-www-form-urlencoded',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			body: fromData || {}
		}).then((rep) => rep.json()).then(data => {
			param.success && param.success(data);
		}).catch(function (error) {
			param.error && param.error(error);
		});
	}

}(window)