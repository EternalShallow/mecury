'use strict';
/**
 * 发送短信
 */

/*重新获取验证码*/
export default(dom) => {

	let num = 60;
	if(!dom.classList.contains('gray')) {
		dom.classList.add('gray');
		dom.innerHTML = num + " '";
		dom.disabled = true;
		dom.style.cursor = "auto";
		dom.style.backgroundColor = "rgb(212, 212, 212)";
	}
	let numSet = setInterval(function() {
		num -= 1;
		dom.innerHTML = num + " '";
		if(num == 0) {
			numSet = clearInterval(numSet);
			dom.classList.remove('gray');
			dom.innerHTML = '重新获取';
			dom.disabled = false; //表示可点击
		}
	}.bind(this), 1000);
	return false;
}