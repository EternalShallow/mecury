'use strict';

/**
 * 复制文本功能
 * 2017-05-25
 * yubai8
 */

export default {
	copyText(copybtn, cb) {
		copybtn = event || document.querySelector(copybtn);
		copybtn.addEventListener('click', () => {
			let copyTextarea = document.querySelector(copybtn.getAttribute("data-copy")); //要拷贝的文本
			(copyTextarea.nodeName === 'INPUT' || copyTextarea.nodeName === 'TEXTAREA') ? copyTextarea.select(): this.selectText(copyTextarea);
			copyTextarea.focus();
			try {
				let successful = document.execCommand('copy');
				cb(successful);
			} catch(err) {
				console.log('哎呀，无法复制');
				cb(false);
			}
		});
	},
	selectText(copyTextarea) {
		if(copyTextarea.hasAttribute('contenteditable')) {
			copyTextarea.focus();
		}
		if(document.selection) {
			let range = document.body.createTextRange();
			range.moveToElementText(copyTextarea);
			range.select();
		} else if(window.getSelection) {
			let selection = window.getSelection();
			let range = document.createRange();

			range.selectNodeContents(copyTextarea);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}

}