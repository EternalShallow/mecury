(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		(global.$ = factory());
}(this, (function() {
	'use strict';
	var $ = new function() {
		//ajax模块
		var class2type = {},
			Ajax = {
				//ajax模块
				init: function(obj) {
					//初始化数据
					var objAdapter = {
						url: obj.url || "",
						method: obj.method || 'get',
						dataType: obj.dataType || "json",
						data: obj.data || {},
						success: function() {},
						complete: function() {},
						error: function(s) {
							alert('status:' + s + 'error!');
						},
						accepts: {
							script: 'text/javascript, application/javascript, application/x-javascript',
							json: 'application/json',
							xml: 'application/xml, text/xml',
							html: 'text/html',
							text: 'text/plain'
						},
						async: true
					}

					//通过使用JS随机字符串解决IE浏览器第二次默认获取缓存的问题
					objAdapter.async = 'async' in obj ? obj.async : true; //true 异步，false同步
					objAdapter.complete = obj.complete || objAdapter.complete;
					objAdapter.success = obj.success || objAdapter.success;
					objAdapter.error = obj.error || objAdapter.error;

					Ajax.paramsData(objAdapter);

					return objAdapter;
				},
				//创建XMLHttpRequest对象
				createXHR: function() {
					if(window.XMLHttpRequest) { //IE7+、Firefox、Opera、Chrome 和Safari
						return new XMLHttpRequest();
					} else if(window.ActiveXObject) { //IE6 及以下
						var versions = ['MSXML2.XMLHttp', 'Microsoft.XMLHTTP'];
						for(var i = 0, len = versions.length; i < len; i++) {
							try {
								return new ActiveXObject(version[i]);
								break;
							} catch(e) {
								//跳过
								console.error(e);
							}
						}
					} else {
						throw new Error('浏览器不支持XHR对象！');
					}
				},
				paramsData: function(options) {
					function appendQuery(url, query) {
						if(query == '') return url
						return(url + '&' + query).replace(/[&?]{1,2}/, '?')
					}

					if(options.data && $.type(options.data) != "string")
						options.data = Ajax.params(options.data)
					if(options.data && (!options.type || options.type.toUpperCase() == 'GET' || 'jsonp' == options.dataType)) {
						options.url = appendQuery(options.url, options.data), options.data = undefined
					}
					return options;
				},
				params: function(data) {
					var arr = [];
					for(var i in data) {
						//特殊字符传参产生的问题可以使用encodeURIComponent()进行编码处理
						arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
					}
					return arr.join('&');
				},
				callback: function(obj, xhr) {
					var result, dataType, error = false;
					if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) { // || (xhr.status === 0 && protocol === 'file:')) {
						if(xhr.responseType === 'arraybuffer' || xhr.responseType === 'blob') {
							result = xhr.response;
						} else {
							result = xhr.responseText;
							dataType = obj.dataType ? obj.dataType : xhr.getResponseHeader('content-type').split(';', 1)[0];
							for(var i in obj.accepts) {
								if(obj.accepts.hasOwnProperty(i) && obj.accepts[i].indexOf(dataType) > -1) dataType = i;
							}
							try {
								if(dataType === 'script') {
									eval(result);
								} else if(dataType === 'xml') {
									result = xhr.responseXML
								} else if(dataType === 'json' || dataType == "application/json") {
									result = result.trim() === '' ? null : JSON.parse(result)
								}
							} catch(e) {
								obj.error && obj.error(e, xhr);
								xhr.abort();
							}
						}
						obj.success && obj.success(result, xhr);
					} else {
						obj.error && obj.error(xhr.statusText, xhr);
					}
				},
				ajax: function(obj) {
					if(obj.method === 'post') {
						Ajax.post(obj);
					} else {
						Ajax.get(obj);
					}
				},
				//post方法
				post: function(obj) {
					var xhr = Ajax.createXHR(); //创建XHR对象
					var opt = Ajax.init(obj);
					opt.method = 'post';
					if(opt.async === true) { //true表示异步，false表示同步
						//使用异步调用的时候，需要触发readystatechange 事件
						xhr.onreadystatechange = function() {
							if(xhr.readyState == 4) { //判断对象的状态是否交互完成
								Ajax.callback(opt, xhr); //回调
							}
						};
					}
					//在使用XHR对象时，必须先调用open()方法，
					//它接受三个参数：请求类型(get、post)、请求的URL和表示是否异步。
					xhr.open(opt.method, opt.url, opt.async);
					//post方式需要自己设置http的请求头，来模仿表单提交。
					//放在open方法之后，send方法之前。
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					xhr.send(opt.data); //post方式将数据放在send()方法里
					if(opt.async === false) { //同步
						Ajax.callback(opt, xhr); //回调
					}
				},
				//get方法
				get: function(obj) {
					var xhr = Ajax.createXHR(); //创建XHR对象
					var opt = Ajax.init(obj);
					if(opt.async === true) { //true表示异步，false表示同步
						//使用异步调用的时候，需要触发readystatechange 事件

						xhr.onreadystatechange = function() {
							if(xhr.readyState == 4) { //判断对象的状态是否交互完成
								Ajax.callback(obj, xhr); //回调
							}
						};
					}
					//若是GET请求，则将数据加到url后面
					//opt.url += opt.url.indexOf('?') == -1 ? '?' + ('_=' + (new Date().getTime())) : '&' + ('_=' + new Date().getTime());

					//在使用XHR对象时，必须先调用open()方法，
					//它接受三个参数：请求类型(get、post)、请求的URL和表示是否异步。
					xhr.open(opt.method, opt.url, opt.async);
					xhr.send(null); //get方式则填null
					if(opt.async === false) { //同步
						Ajax.callback(opt, xhr); //回调
					}
				},
				extend: function() {
					/*
						target: 被扩展的对象 （第一个参数）
						length: 参数的数量
						deep: 是否深度克隆（默认：false）
						i：指向的是第一个扩展对象，默认是第二个参数
					*/
					var options, name, src, copy, copyIsArray, clone,
						target = arguments[0] || {},
						i = 1,
						length = arguments.length,
						deep = false;

					/*
						target作为第一个参数，如果第一个参数是Boolean类型的值，则把target复制给deep
						deep表示是否深度克隆，当为true时，进行深度克隆，否则只进行第一层扩展
						然后把第二个参数复制给target
					*/
					if(typeof target === "boolean") {
						deep = target;

						// 将target设置为第二个参数值
						target = arguments[i] || {};
						i++;
					}

					// target既不是对象也不是函数，则把target设置设置成空对象
					if(typeof target !== "object" && !jQuery.isFunction(target)) {
						target = {};
					}

					// 如果i和参数数量相同，则把jQuery对象赋值给target，即扩展jQuery对象
					if(i === length) {
						target = this;

						// i减1，指向扩展对象（有deep时，i = 1; 无deep时，i = 0），target为jQuery对象
						i--;
					}

					// 开始遍历需要被扩展到target上的参数，i是从第一个扩展的对象（非target）开始
					for(; i < length; i++) {
						// 对象不为null或undefined，去除deep和target外的对象
						if((options = arguments[i]) != null) {
							// 遍历扩展基本对象
							for(name in options) {
								// 根据扩展对象的键获得目标对象相应值，并赋给src
								src = target[name];
								// 得到扩展对象的值
								copy = options[name];

								// Prevent never-ending loop
								if(target === copy) {
									continue;
								}

								// 深度克隆，递归合并，copy值纯对象或数组
								if(deep && copy && (jQuery.isPlainObject(copy) ||
										(copyIsArray = jQuery.isArray(copy)))) {

									if(copyIsArray) {
										copyIsArray = false;
										clone = src && jQuery.isArray(src) ? src : [];

									} else {
										clone = src && jQuery.isPlainObject(src) ? src : {};
									}

									// 递归调用$.extend()方法，继续进行深度遍历
									target[name] = jQuery.extend(deep, clone, copy);

									// 如果不需要深度克隆，则直接赋值copy到目标对象
								} else if(copy !== undefined) {
									target[name] = copy;
								}
							}
						}
					}
					// 原对象被改变
					return target;
				},
				type: function(obj) {
					if(obj == null) {
						return obj + "";
					}
					//'如果是object或者function，先查询集合class2type,如果没有查询到就返回object。  
					return typeof obj === "object" || typeof obj === "function" ?
						class2type[toString.call(obj)] || "object" :
						typeof obj;
				},
				isPlainObject: function(obj) {
					//!obj ---一定要是对象  
					// toString.call(obj) !== "[object Object]"----因为IE，检测constructor  
					//obj.nodeType ----避免不是DOM nodes  
					//obj.setInterval ---排除window  
					if(!obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval) {
						return false;
					}
					//是否是new fun()自定义对象  
					//constructor是否是继承原型链  
					//原型链是否有isPrototypeOf  
					if(obj.constructor && !hasOwnProperty.call(obj, "constructor") &&
						!hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
						return false;
					}
					//判断是否有继承关系  
					//自己的属性会被首先遍历  
					var key;
					for(key in obj) {}
					//直接看最后一项是未了加速遍历的过程  
					return key === undefined || hasOwnProperty.call(obj, key);
				}
			};
		return Ajax;
	}

	function serialize(params, obj, traditional, scope) {
		var type, array = $.isArray(obj),
			hash = $.isPlainObject(obj)
		$.each(obj, function(key, value) {
			type = $.type(value)
			if(scope) key = traditional ? scope :
				scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
			// handle data in serializeArray() format
			if(!scope && array) params.add(value.name, value.value)
			// recurse into nested objects
			else if(type == "array" || (!traditional && type == "object"))
				serialize(params, value, traditional, key)
			else params.add(key, value)
		})
	}
	$.param = function(obj, traditional) {
		var params = []
		params.add = function(key, value) {
			if($.isFunction(value)) value = value()
			if(value == null) value = ""
			this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
		}
		serialize(params, obj, traditional)
		return params.join('&').replace(/%20/g, '+')
	}
	$.isArray = Array.isArray ||
		function(object) {
			return object instanceof Array
		};

	function likeArray(obj) {
		var length = !!obj && 'length' in obj && obj.length,
			type = $.type(obj)

		return 'function' != type && !isWindow(obj) && (
			'array' == type || length === 0 ||
			(typeof length == 'number' && length > 0 && (length - 1) in obj)
		)
	}

	function isWindow(obj) {
		return obj != null && obj == obj.window
	}

	$.isFunction = function(value) {
		return typeof(value) == "function"
	}
	$.each = function(elements, callback) {
		var i, key
		if(likeArray(elements)) {
			for(i = 0; i < elements.length; i++)
				if(callback.call(elements[i], i, elements[i]) === false) return elements
		} else {
			for(key in elements)
				if(callback.call(elements[key], key, elements[key]) === false) return elements
		}

		return elements
	}
	$.formatDeptPath = function(value, delim, ignoreSogou, level) {
		delim = delim || '>>';
		var tokens = value.split(',');
		tokens = tokens.slice(tokens[0] == '' ? 1 : 0, tokens[tokens.length - 1] == '' ? -1 : undefined);
		if(tokens[0] == '搜狗' && ignoreSogou) {
			tokens.shift();
		}
		if(level > 0) {
			tokens = tokens.slice(0, level);
		}
		return tokens.join(delim);
	}
	return $;
})));