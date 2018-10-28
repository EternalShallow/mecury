import Vue from 'vue';
/*
 *  流程： 绑定指令-> 设置配置(vaConfig) -> 校验(check) -> 报错(showErr) 或 自定义报错
 */
let va = {
	/**
	 * 正则
	 */
	regList: {
		SmsCode: /^\d{6}$/,
		/*短信正则*/
		Password: /(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}/,
		/*密码正则*/
		Mobile: /^[1][34578][0-9]{9}$/,
		/*手机号正则*/
		RealName: /^[\u4e00-\u9fa5 ]{2,10}$/,
		/*真实姓名正则*/

		BankNum: /^\d{10,19}$/,
		/*银行卡号正则*/
		Money: /^([1-9]\d*|0)$/,
		/*钱正则*/
		Mail: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/ /*邮件正则*/
	},
	unique(arr) {
		var hashTable = {},
			newArr = [];
		for(var i = 0; i < arr.length; i++) {
			if(!hashTable[arr[i]]) {
				hashTable[arr[i]] = true;
				newArr.push(arr[i]);
			}
		}
		return newArr;
	},
	addClass(dom, _class) {
		var hasClass = !!dom.className.match(new RegExp('(\\s|^)' + _class + '(\\s|$)'))
		if(!hasClass) {
			dom.className += ' ' + _class
		}
	},
	//校验函数
	check(v, conditions) {
		var res = 0; //0代表OK, 若为数组代表是某个字段的错误
		//验证函数
		var cfg = {
			//非空
			nonvoid: (v, bool) => {
				if(bool) {
					return v.trim() ? 0 : ['nonvoid'];
				} else {
					return 0;
				}
			},
			reg: (v, reg) => reg.test(v) ? 0 : ['reg'], //正则
			limit: (v, interval) => (+v >= interval[0] && +v <= interval[1]) ? 0 : ['limit', interval],
			equal: (v, target) => { //和什么相等
				var _list = document.getElementsByName(target),
					_target
				for(var i = 0; i < _list.length; i++) {
					if(_list[i].className.indexOf('va') > -1) {
						_target = _list[i];
					}
				}
				return(_target.value === v) ? 0 : ['equal', _target.getAttribute('tag')]
			},
			unique: (v) => {
				var _list = document.getElementsByClassName('unique'),
					valList = [].map.call(_list, item => item.value)
				return(va.unique(valList).length === valList.length) ? 0 : ['unique']
			}
		}

		for(var i = 0; i < conditions.length; i++) {
			var condi = conditions[i],
				type = condi.type,
				typeVal = condi.typeVal
			res = cfg[type](v, typeVal)
			//如果有自定义报错信息， 返回自定义的报错信息
			if(res) {
				res = condi.errMsg || res;
				break;
			}
		}
		return res;
	},
	/**
	 * [VaConfig va配置的构造函数]
	 * @param {[string]} type    [校验类型，如reg, limit等等]
	 * @param {[*]} typeVal             [根据校验类型配置的值]
	 * @param {[string]} errMsg  [报错信息]
	 * @param {[string]} name    [用以ajax的字段名]
	 * @param {[string]} tag     [中文名，用以报错]
	 */
	VaConfig(type, typeVal, errMsg, name, tag) {
		this.type = type, this.typeVal = typeVal, this.errMsg = errMsg, this.name = name, this.tag = tag
	},
	//yubai8封装的吐司 2017-03-12
	toast(name, ERR_MSG, type) {
		if(name == "密码" && type == "reg") {
			return libUtils.toast(name + '请输入6-18位数字与字母组合');
		}
		return libUtils.toast(ERR_MSG[type]);
	},
	showErr(name, checkResult) {
		var type = checkResult[0],
			ext = checkResult[1] || [];

		var ERR_MSG = {
			nonvoid: `${name}不能为空`,
			reg: `${name}格式错误`,
			limit: `${name}必须在${ext[0]}与${ext[1]}之间`,
			equal: `两次${ext}不相同`,
			unique: `${name}重复`
		}
		//使用layer来报错，如果需要自定义报错方式，要把全文的layer集中起来包一层。
		this.toast(name, ERR_MSG, type);
	}
}

//用来剔除重复的规则，以及规则的覆盖。默认后面的取代前面
Array.prototype.uConcat = function(arr) {
	var comb = this.concat(arr),
		unique = {},
		result = []

	for(var i = 0; i < comb.length; i++) {
		// console.log(i, comb[i])
		var type = comb[i].type
		if(unique[type]) {
			var index = unique[type].index
			unique[type] = comb[i]
			unique[type].index = index;
		} else {
			unique[type] = comb[i]
			unique[type].index = i;
		}
	}

	for(var i = 0; i < 100; i++) {
		for(var item in unique) {
			if(unique[item].index === i) {
				delete unique[item].index
				result.push(unique[item])
			}
		}
	}
	return result
}

Vue.directive('va', {
	bind: function(el, binding, vnode) {
		var vm = vnode.context,
			name = binding.arg === 'EXTEND' ? el.getAttribute('name') : binding.arg,
			tag = el.getAttribute('tag'),
			baseCfg = [], //默认的校验规则                         --不用写，默认存在的规则（如非空）
			optionalConfig = [], //用户选择的配置成套         --与name相关
			customConfig = [], //用户自定义的规则（组件中） --bingding.value
			option = binding.modifiers,
			regMsg = el.getAttribute('regMsg') || ''

		var eazyNew = (type, typeVal) => { return new va.VaConfig(type, typeVal, '', name, tag) }
		var regNew = (typeVal) => { return new va.VaConfig('reg', typeVal, regMsg, name, tag) } //正则的新建

		el.className += ' va' + vm._uid; //表示加入原先的样式+ 现在生成的样式
		el.name = name;

		vm.vaConfig || (vm.vaConfig = {})
		var NON_VOID = eazyNew('nonvoid', true)

		//默认非空,如果加了canNull的修饰符就允许为空
		if(!option.canNull) {
			baseCfg.push(NON_VOID)
		}

		//需要立即校验的框
		if(option.vanow) {
			el.addEventListener('blur', function() {
				vm.vaResult || (vm.vaResult = {})
				vm.vaVal || (vm.vaVal = {})
				var value = el.value,
					conditions = vm.vaConfig[name],
					para = el.getAttribute('va-para')

				if(value === '' && option.canNull) {
					vm.vaVal[name] = value
					return
				}

				vm.vaResult[name] = va.check(value, conditions);
				var _result = vm.vaResult[name]
				if(_result) {
					typeof _result === 'string' ? libUtils.toast(_result) : va.showErr(conditions[0].tag, _result)
					return;
				}
				vm.vaVal[name] = value
				vm.$vanow(para)
			})
		}

		if(option.unique) {
			optionalConfig.push(eazyNew('unique', name))
		}

		var regOptions = Object.keys(option);
		for(var i = 0; i < regOptions.length; i++) {
			var regOption = regOptions[i]
			if(va.regList[regOptions[i]]) {
				optionalConfig.push(regNew(va.regList[regOption]))
			}
		}

		if(va.regList[name]) {
			optionalConfig.push(regNew(va.regList[name]))
		}

		//用户自定义的规则
		if(binding.value) {
			customConfig = binding.value.map(item => {
				let type = Object.keys(item)[0];
				if(type === 'reg') {
					return regNew(item[type])
				} else {
					if(type === 'unique') {
						va.addClass(el, 'unique')
					}
					return eazyNew(type, item[type])
				}
			})
		}

		vm.vaConfig[name] || (vm.vaConfig[name] = [])
		vm.vaConfig[name] = baseCfg.uConcat(optionalConfig).uConcat(customConfig).uConcat(vm.vaConfig[name])
	}
});

/**
 * 提交命令指令
 */
Vue.directive('va-check', {
	bind: function(el, binding, vnode) {
		var vm = vnode.context;
		el.addEventListener('click', function() {
			var domList = document.getElementsByClassName('va' + vm._uid);
			vm.vaResult || (vm.vaResult = {})
			vm.vaVal || (vm.vaVal = {});

			for(var i = 0; i < domList.length; i++) {
				var dom = domList[i],
					name = dom.name,
					value = dom.value,
					conditions = vm.vaConfig[name];

				var _result = va.check(value, conditions);
				if(_result) {
					typeof _result === 'string' ? libUtils.toast(_result) : va.showErr(conditions[0].tag, _result)
					return
				}
				vm.vaVal[name] = value;
			}
			vm.$vaSubmit();
		})
	}
});

/**
 * 发送短信指令
 */
Vue.directive('va-sendSMS', {
	bind: function(el, binding, vnode) {
		var vm = vnode.context
		el.addEventListener('click', function() {
			vm.vaResult || (vm.vaResult = {})
			vm.vaVal || (vm.vaVal = {})

			var dom = document.getElementsByName(binding.arg)[0],
				name = dom.name,
				value = dom.value,
				conditions = vm.vaConfig[name]

			var _result = va.check(value, conditions)
			if(_result) {
				typeof _result === 'string' ? libUtils.toast(_result) : va.showErr(conditions[0].tag, _result)
				return
			}

			var callback = Object.keys(binding.modifiers)[0];
			vm[callback](el);
		})
	}
});