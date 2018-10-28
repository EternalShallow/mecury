/**
 * 获取当前页面的URL的地址中是否包含对应KEY的VALUE(正则表达式)
 * 调用方法：libUtils.GetURLParamValue("userId");
 *
 * @param key 要查询的URL的key
 * @returns string 返回key对应的value。如果没有查询的key，返回null。
 */

export default {
	GetURLParamValue: (key) => {
		var resultValue = "";
		var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
		var value = window.location.search.substr(1).match(reg);
		if(value != null)
			resultValue = value[2];
		return resultValue;
	},
	/**
	 * 获取当前页面的URL的地址中参数值
	 * 调用方法： libUtils.GetURLParamObj();
	 *
	 * @returns Object 返回url地址?号后的参数的对象
	 */
	GetURLParamObj: () => {
		var url = location.search || location.href;
		var _ParamObj = new Object();
		//判断获取url中"?"符后的字串，并截取存储
		if(url.indexOf("?") != -1) {
			var paramStr = url.substr(url.indexOf("?") + 1);
			var paramArray = paramStr.split("&");
			for(var i = 0; i < paramArray.length; i++) {
				_ParamObj[paramArray[i].split("=")[0]] = (paramArray[i].split("=")[1]);
			}
		}
		return _ParamObj;
	}
}