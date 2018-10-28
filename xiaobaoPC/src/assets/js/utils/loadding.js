'use strict';
/**
 * loadding
 */

/*loadding 显示*/
export default {
	showLoading: function() {
		var d = document,
			q = "querySelector";

		if(!d[q](".uiLoading")) {
			var div =  d["createElement"]('div'),
				uiLoading = "<style>.uiLoading{" +
				"width: 100%;" +
				"height: 100%;" +
				"font-size: 16px;" +
				"z-index: 1000;" +
				"position: fixed;" +
				"border-radius: 8px;" +
				"background: transparent;" +
				"color: #333;" +
				"top: 0%;" +
				"text-align: center;" +
				"display: block;}" +
				".uiLoading p{width: 35%;margin: auto;top: 30%;left: 32.5%;border-radius: 8px; position: fixed; display: block;background: #3c3c3f;}" +
				".uiLoading p img{margin-top: 20px;}" +
				".uiLoading p span{margin-top: 10px;margin-bottom:20px;font-size: 12px;color: #ffffff;display: block;}</style>"

			div.innerHTML = uiLoading + '<p><img src="https://toumiservice.yixin.com/images/loading.gif" /><span>加载中，请稍后！</span></p>';
			div.className = "uiLoading";
			d[q]("body").appendChild(div);

			d[q](".uiLoading").addEventListener("touchmove", function() {   
				event.preventDefault();
			});
		}
	},
	dismissLoading: function() {
		var d = document,
			q = "querySelector";
		d[q](".uiLoading").remove(); //清除掉加载的问题
	}
}