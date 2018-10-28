/*by  min*/
//初始化rem
(function() {
	var d = document;
	var getStyle = (function() {
		if(window.currentStyle) {
			return function(obj, name) {
				return obj.currentStyle[name];
			}
		} else {
			return function(obj, name) {
				return getComputedStyle(obj, false)[name];
			}
		}
	})();

	var addEvent = (function() {
		if(d.attachEvent) {
			return function(obj, ev, fn) {
				obj.attachEvent('on' + ev, fn);
			};
		} else {
			return function(obj, ev, fn) {
				obj.addEventListener(ev, fn, false);
			};
		}
	})();

	var oHtml = d.querySelector('html');
	var fontSize = getStyle(oHtml, 'fontSize').split('px')[0];
	var originalWidth = 750;

	setFontSize();

	addEvent(window, 'resize', function() {
		setFontSize();
	});

	function setFontSize() {
		var size = size || 200;
		var _fontSize = (getSize()['width'] * fontSize / 640) > size ? size : (getSize()['width'] * fontSize / 640);
		oHtml.style.fontSize = _fontSize + "px";
	}

	function getSize() {
		return {
			width: d.documentElement.clientWidth || d.body.clientWidth,
			height: d.documentElement.clientHeight || d.body.clientHeight
		}
	}
})();