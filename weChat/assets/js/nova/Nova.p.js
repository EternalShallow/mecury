/**
 * NOVA WORKFLOW ENGINE FOR PUBLIC
 * VER: 1.0.0
 * CORE-VER: 2.6.0
 * CREATE:2014/10/29
 * UPDATE:2014/10/31
 * AUTH:LIYAN liyan@sogou-inc.com
 */
;(function(win) {
	var isDebug = true,
		counter = 0,
		ENGINE_PATH = '/pub/sylla/nova-p/adapter/json/?nova=adapter',
		DOC_IFRAME_SHOW_PATH = '/nova/nova_doc_iframe_show.jspf',
		ACT_TYPE_ENTITY = 1, //活动类型-实体交互
		ACT_TYPE_CONVERGENCE = 4, //活动类型-同步汇聚
		HANDLE_TYPE_SINGLE = 10, //单人处理
		STATUS_FEEDBACK_NEXT_ACT_PENDING = 1100, //后续环节无法确定
		STATUS_FEEDBACK_NEXT_HANDLER_PENDING = 1110, //环节处理人无法确定

		ACT_ADD_ENTITY = 'addEntity',
		ACT_UPDATE_ENTITY = 'updateEntity',
		ACT_CANCEL_ENTITY = 'cancelEntity',
		ACT_SUBMIT_ENTITY = 'submitEntity',
		ACT_GET_ENTITY = 'getEntity',
		ACT_GET_OVER_ACT_INFO = 'getOverActInfos',
		ACT_GET_HANDLE_LOG = 'getHandleLogs',
		ACT_GET_NEXT_ACTS = 'getNextActs',
		ACT_SUBMIT_ENTITY = 'submit',
		ACT_GET_OPINIONS = 'getOpinionList',
		ACT_ADD_OPINION = 'addOpinion',
		ACT_LOAD_CONTENT = 'loadContent',
		HOLDER_CUR_NEXT_ACT = 'cur_next_act',
		//HOLDER_SUBMIT_SUCCESS_FUN='submit_success_fun',
		HOLDER_SUBMIT_CONFIG = 'submit_config';

	var Nova = win.Nova = (function(proAlias) {
		this.MOBILE_LEVEL_NO = 0; //不支持移动端
		this.MOBILE_LEVEL_READ = 10; //移动端只读查看
		this.MOBILE_LEVEL_DECIDE = 20; //移动端可只读审批
		this.MOBILE_LEVEL_WRITE = 30; //移动端可编辑保存
		this.MOBILE_LEVEL_HANDLE = 40; //移动端可提供完整的处理操作。

		var clazz = function(proAlias) {
			if(!proAlias) {
				throw '未指定流程别名！'
			};
			this._proAlias = proAlias
			this._setState(this._getNewState());
			this._no = ++counter;
		};

		clazz.prototype = {
			save: function(content, successFun, config) {
				this._state.save(content, successFun, config);
			},
			submit: function(content, successFun, config) {
				this._state.submit(content, successFun, config);
			},
			cancel: function(successFun, config) {
				this._state.cancel(successFun, config);
			},
			loadNextActs: function(fun) {
				this._state.loadNextActs(fun)
			},
			loadLogs: function(fun) {
				this._state.loadLogs(fun)
			},
			loadOpinions: function(fun) {
				this._state.loadOpinions(fun)
			},
			loadPasses: function(fun) {
				this._state.loadPasses(fun)
			},
			loadContent: function(fun, para) {
				this._state.loadContent(fun, para)
			},
			isEdit: function() {
				return this._state.isEdit();
			},
			isTodo: function() {
				return this._state.isTodo();
			},
			isCancelable: function() {
				return this._state.isCancelable();
			},
			getMobileLevel: function() {
				return this._state.getMobileLevel();
			},
			getEntity: function() {
				return this._state.getEntity();
			},
			getContent: function() {
				return this._state.getContent();
			},
			getTask: function() {
				return this._state.getTask();
			},
			getTodoTasks: function() {
				return this._state.getTodoTasks();
			},
			getDecisions: function() {
				return this._state.getDecisions();
			},
			addOpinion: function(content, successFun) {
				return this._state.addOpinion(content, successFun);
			},
			chooseAct: function(acts, doContinue) {
				_error(
					'未覆写nova.chooseAct([acts],doContinue("act")){return "act"}方法，无法确定提交环节！');
			},
			chooseUid: function(data, doContinue) {
				_error(
					'未覆写nova.chooseUid({[handlers],act,node},doContinue(["uid"]|"uid")){return ["uid"]|"uid"}方法，无法确定下一环节处理人！');
			},
			_setState: function(state) {
				this._state = state;
				_debug('Nova._setState', 'state', state);
			},
			_getState: function() {
				return this._state
			},
			_getNewState: function() {
				return new NewState(this);
			},
			_getHandleState: function() {
				return new HandleState(this);
			},
			_getViewState: function() {
				return new ViewState(this);
			},
			_getCancelState: function() {
				return new CancelState(this);
			}
		};

		var clazz2 = function(doc) {
			this._doc = doc;
			this._proAlias = doc.entity.process.pro_alias;
			this._setState(doc.task ? this._getHandleState() : this._getViewState());
			this._no = ++counter;
		};

		clazz2.prototype = clazz.prototype;
		//静态工厂方法-同步
		clazz.entityOf = function(idSnCode) {
			var nova = null;
			_post(ACT_GET_ENTITY, {
				'snCode': idSnCode
			}, function(d) {
				_debug('Nova.entityOf', 'doc', d);
				null, nova = new clazz2(d);
			});
			return nova;
		};
		//静态工厂方法-异步
		clazz.loadEntity = function(idSnCode, fun, config) {
			config = getConfig(fun, config);
			if(!$.isFunction(fun)) _error('Nova.loadEntity(idSnCode,[fun is not a function!])');
			_apost(ACT_GET_ENTITY, {
				'snCode': idSnCode
			}, function(d) {
				_debug('Nova.loadEntity', 'doc', d);
				var nova = new clazz2(d);
				fun(nova);
			}, config.fail);
		};
		//静态打开工单方法，用于兼容1.x版本工单。
		clazz.showDoc = function(idSnCode, onChangeFun) {
			var $doc = $('<iframe/>').css({
					'padding': '0px',
					'margin': '0px',
					'border-width': '0px',
					'width': '100%',
					'position': 'fixed',
					'top': '0px',
					'left': '0px',
					'z-index': '99999'
				})
				.height($(window).height()).attr('name', 'nova_doc_iframe_show')
				.attr('src', DOC_IFRAME_SHOW_PATH + '?idsncode=' + idSnCode).attr('allowTransparency', true)
				.prop('nova_event', {
					'onChangeFun': onChangeFun
				});

			var novaWin = new function() {
				var $win = $doc;
				this.close = function() {
					$win.remove();
				};
			};

			$('body').append($doc);
			return novaWin;
		};
		return clazz;
	})();

	var NovaState = (function() {
		var state = function() {
			this.name = 'state';
		};
		state.prototype = {
			save: _throw,
			submit: _throw,
			cancel: _throw,
			isEdit: _throw,
			isTodo: _throw,
			loadNextActs: _throw,
			getTask: _throw,
			getTodoTasks: _throw,
			getNic: _throw,
			getDecisions: _throw,
			addOpinion: _throw,
			getEntity: function() {
				return new Entity(this.nova._doc.entity, this.nova);
			},
			getContent: function() {
				return this.nova._doc.content;
			},
			isCancelable: function() {
				return false
			},
			getMobileLevel: function() {
				return this.nova._doc.entity.process.mobile_level
			},
			loadLogs: function(fun) {
				_apost(ACT_GET_HANDLE_LOG, new Nicole().setId(this.nova._doc.entity.id).param(), function(d) {
					{
						_debug('NovaState.loadHandleLogs', 'logs', d);
						fun && ($.isFunction(fun)) && fun(d);
					}
				}, null, this);
			},
			loadPasses: function(fun) {
				_apost(ACT_GET_OVER_ACT_INFO, new Nicole().setId(this.nova._doc.entity.id).param(), function(d) {
					{
						_debug('NovaState.loadPasses', 'passes', d);
						fun && ($.isFunction(fun)) && fun(d);
					}
				}, null, this);
			},
			loadOpinions: function(fun) {
				_apost(ACT_GET_OPINIONS, {
					'snCode': this.nova._doc.entity.id
				}, function(d) {
					_debug('NovaState.loadOpinions', 'opinions', d);
					fun && ($.isFunction(fun)) && fun(Opinion.asArray(d, this.nova));
				}, null, this);
			},
			loadContent: function(fun, para) {
				_apost(ACT_LOAD_CONTENT, {
					'code': this.nova._doc.entity.code,
					'para': JSON.stringify(para)
				}, function(d) {
					_debug('NovaState.loadContent', 'content', d);
					fun && ($.isFunction(fun)) && fun(d);
				}, null, this);
			},
			_doActContinue: function(actName) {
				if(!actName) return;
				this.getNic().setAct(actName.getName());
				this._submit(this.getNic().get(HOLDER_SUBMIT_CONFIG));
			},
			_doUidContinue: function(uid) {
				if(!uid) return;
				this.getNic().addUid(uid);
				this._submit(this.getNic().get(HOLDER_SUBMIT_CONFIG));
			},
			_submit: function(config) {
				_apost.call(this.nova, ACT_SUBMIT_ENTITY, this.getNic().setId(this.nova.getEntity().getId()).param(), function(d) {
					this.nova._setState(this.nova._getViewState());
					this.nova._doc = d;
					doFun(config.success);
				}, config.fail, this);
			},
			_addOpinion: function(content, successFun) {
				var cententStr = getContentPostStr({
					'OPINION_CONTENT': content
				});
				_apost(ACT_ADD_OPINION, new Nicole().setId(this.nova.getEntity().getId()).param() + '&' + cententStr, function(d) {
					successFun && ($.isFunction(successFun)) && successFun(new Opinion(d, this.nova));
				});
			},
		};

		function _throw() {
			var msg = 'Nova实例当前状态不支持此操作！';
			_warn(msg);
		};
		return state;
	})();

	//new state
	var NewState = (function() {
		var newState = function(nova) {
				this.name = 'new';
				this.nova = nova;
			},
			_override = {
				save: function(content, successFun, config) {
					config = getConfig(successFun, config);
					var cententStr = getContentPostStr(content, this.nova.traditional);
					_apost(ACT_ADD_ENTITY, new Nicole().setPro(this.nova._proAlias).param() + '&' + cententStr, function(d) {
						_debug('NewState.save', 'doc', d);
						this.nova._doc = d;
						this.nova._setState(this.nova._getHandleState());
						successFun && ($.isFunction(successFun)) && successFun();
					}, config.fail, this);

				},
				submit: function(content, successFun, config) {
					config = getConfig(successFun, config);
					this.getNic(true).put(HOLDER_SUBMIT_CONFIG, config);
					var cententStr = getContentPostStr(content, this.nova.traditional);
					_apost(ACT_ADD_ENTITY, new Nicole().setPro(this.nova._proAlias).param() + '&' + cententStr, function(d) {
						_debug('NewState.save', 'doc', d);
						this.nova._doc = d;
						this.nova._setState(this.nova._getHandleState());
						this._submit(config);
					}, config.fail, this);
				},
				cancel: function() {
					_warn('未保存的实体无需撤销！');
				},
				loadNextActs: function() {
					_warn('未保存的实体无法获得后续活动环节！')
				},
				loadLogs: function(fun) {
					return []
				},
				loadPasses: function(fun) {
					return []
				},
				loadOpinions: function(fun) {
					return []
				},
				loadContent: function() {
					_warn('未保存的实体无需加载异步内容');
					return null
				},
				getEntity: function() {
					_warn('未保存的实体无法获得实体对象');
					return null
				},
				getContent: function() {
					_warn('未保存的实体无法获得内容');
					return null
				},
				getTask: function() {
					_warn('未保存的实体无法获得环节任务');
					return null
				},
				getTodoTasks: function() {
					_warn('未保存的实体无法获得当前待办任务集合');
					return null
				},
				isEdit: function() {
					return true;
				},
				isTodo: function() {
					return true;
				},
				isCancelable: function() {
					return true;
				},
				getNic: function(isNew) {
					return((!isNew) && this._nic) || (this._nic = new Nicole());
				} //必须覆盖，原型链中NovaState只会被new一次。
			};
		newState.prototype = $.extend(new NovaState(), _override);
		return newState;
	})();

	//handle state
	var HandleState = (function() {
		var handle = function(nova) {
				this.name = 'handle';
				this.nova = nova;
			},
			_override = {
				save: function(content, successFun, config) {
					config = getConfig(successFun, config);
					var centent = getContentPostStr(content, this.nova.traditional);
					_apost(ACT_UPDATE_ENTITY, this.getNic().setId(this.nova._doc.entity.id).param() + '&' + centent, function(d) {
						$.extend(this.nova._doc, d);
						_debug('HandleState.save', 'd', d);
						successFun && ($.isFunction(successFun)) && successFun();
					}, config.fail, this);
				},
				submit: function(content, successFun, config) {
					config = getConfig(successFun, config);
					this.getNic(true).put(HOLDER_SUBMIT_CONFIG, config);
					if(content && this.isEdit()) {
						var centent = getContentPostStr(content, this.nova.traditional);
						_apost(ACT_UPDATE_ENTITY, this.getNic().setId(this.nova._doc.entity.id).param() + '&' + centent, function(d) {
							$.extend(this.nova._doc, d);
							this._submit(config);
						}, config.fail, this);
					} else {
						this._submit(config);
					}
				},
				cancel: function(successFun, config) {
					config = getConfig(successFun, config);
					_apost.call(this.nova, ACT_CANCEL_ENTITY, this.getNic().setId(this.nova.getEntity().getId()).param(), function(d) {
						this.nova._setState(this.nova._getCancelState());
						successFun && ($.isFunction(successFun)) && successFun();
					}, config.fail, this);
				},
				loadNextActs: function(fun) {
					_apost(ACT_GET_NEXT_ACTS, this.getNic().setId(this.nova._doc.entity.id).param(), function(d) {
						_debug('HandleState.loadNextActs', 'nextActs', d);
						fun && ($.isFunction(fun)) && fun(Activity.asArray(d, this.nova));
					}, null, this);
				},
				getMobileLevel: function() {
					var level = this.nova._doc.task.activity.mobile_level;
					if(level < this.nova.MOBILE_LEVEL_NO) {
						level = this.nova._doc.entity.process.mobile_level;
					}
					return level;
				},
				getTask: function() {
					return this._task || (this._task = new Task(this.nova._doc.task, this.nova));
				},
				getTodoTasks: function() {
					return Task.asArray(this.nova._doc.todoTasks, this.nova)
				},
				isEdit: function() {
					return this.getTask().getActivity().isEdit();
				},
				isTodo: function() {
					return true;
				},
				isCancelable: function() {
					return this.nova.getEntity().getUid() == this.nova._doc.handler.uid;
				},
				getDecisions: function() {
					return this.getTask().getActivity().getDecisions();
				},
				addOpinion: function(content, successFun) {
					this._addOpinion(content, successFun);
				},
				getNic: function(isNew) {
					return((!isNew) && this._nic) || (this._nic = new Nicole());
				} //必须覆盖，原型链中NovaState只会被new一次。
			};
		handle.prototype = $.extend(new NovaState(), _override);
		return handle;
	})();

	//view state
	var ViewState = (function() {
		var view = function(nova) {
				this.name = 'view';
				this.nova = nova;
			},
			_override = {
				getTask: function() {
					_warn('非待办处理人无法获得环节任务。');
					return null
				},
				getTodoTasks: function() {
					return(this.nova.getEntity().getState() == 1) ? Task.asArray(this.nova._doc.todoTasks, this.nova) : null;
				},
				isEdit: function() {
					return false;
				},
				isTodo: function() {
					return false;
				},
				addOpinion: function(content, successFun) {
					this._addOpinion(content, successFun);
				}
			};
		view.prototype = $.extend(new NovaState(), _override);

		return view;
	})();

	//cancel state
	var CancelState = (function() {
		var cancel = function(nova) {
				this.name = 'cancel';
				this.nova = nova;
			},
			_override = {
				isEdit: function() {
					return false;
				},
				isTodo: function() {
					return false;
				}
			};
		cancel.prototype = $.extend(new NovaState(), _override);
		return cancel;
	})();

	var Base = (function() {
		var base = function() {};
		base.prototype.toString = function() {
			return JSON.stringify(this._, null, 2);
		};
		base.prototype.getNova = function() {
			return this._nova;
		};
		return base;
	})();

	var Entity = (function() {
		var entity = function(p, nova) {
				this._ = p;
				this._nova = nova;
			},
			ex = {
				getId: function() {
					return this._.id;
				},
				getCode: function() {
					return this._.code;
				},
				getSn: function() {
					return this._.serial_num;
				},
				getTitle: function() {
					return this._.title;
				},
				getUid: function() {
					return this._.draft_uid;
				},
				getName: function() {
					return this._.draft_name;
				},
				getDeptId: function() {
					return this._.draft_dept_id;
				},
				getDeptName: function() {
					return this._.draft_dept_name;
				},
				getSendTime: function() {
					return this._.send_time;
				},
				getOverTime: function() {
					return this._.over_time;
				},
				getState: function() {
					return this._.state;
				},
				isDeleted: function() {
					return this._.del_flag == 1 ? true : false;
				},
				getProcess: function() {
					return this.pro || (this.pro = new Process(this._.process));
				}
			};
		entity.prototype = $.extend(new Base(), ex);
		return entity;
	})();

	var Process = (function() {
		var process = function(p, nova) {
				this._ = p;
				this._nova = nova;
			},
			ex = {
				getId: function() {
					return this._.id;
				},
				getName: function() {
					return this._.pro_name;
				},
				getAlias: function() {
					return this._.pro_alias;
				},
				getVer: function() {
					return this._.ver;
				},
				getButtonShield: function() {
					return this._.button_shield;
				}
			};
		process.prototype = $.extend(new Base(), ex);
		return process;
	})();

	var Activity = (function() {
		var activity = function(p, nova) {
				this._ = p;
				this._nova = nova
			},
			ex = {
				getId: function() {
					return this._.id;
				},
				getTitle: function() {
					return this._.act_title;
				},
				getName: function() {
					return this._.act_name;
				},
				getDesc: function() {
					return this._.act_desc;
				},
				getType: function() {
					return this._.act_type;
				},
				isEdit: function() {
					return this._.edit_flag == 'EDIT' ? true : false;
				},
				isSingleHandler: function() {
					if(this._.handlerRule) {
						return this._.handlerRule.handle_type == HANDLE_TYPE_SINGLE ? true : false;
					} else {
						return false;
					}
				},
				getProcess: function() {
					return this._nova.getEntity().getProcess()
				},
				getDecisions: function() {
					return this._decisions || (this._decisions = Decision.asArray(this._.decisions));
				}
			};
		activity.prototype = $.extend(new Base(), ex);
		activity.asArray = function(acts, nova) {
			var buf = new Array();
			$.each(acts, function(i, v) {
				buf.push(new Activity(v, nova));
			});
			return buf;
		};
		return activity;
	})();

	var Task = (function() {
		var task = function(p, nova) {
				this._ = p;
				this._nova = nova
			},
			ex = {
				getId: function() {
					return this._.id;
				},
				getState: function() {
					return this._.task_state;
				},
				getStartTime: function() {
					return this._.start_time;
				},
				getEndTime: function() {
					return this._.end_time;
				},
				getActivity: function() {
					return this._act || (this._act = new Activity(this._.activity, this._nova));
				}
			};
		task.prototype = $.extend(new Base(), ex);
		task.asArray = function(tasks, nova) {
			var buf = new Array();
			$.each(tasks, function(i, v) {
				buf.push(new Task(v, nova));
			});
			return buf;
		};

		return task;
	})();
	var Decision = (function() {
		var decision = function(p, nova) {
				this._ = p;
				this._nova = nova;
			},
			ex = {
				getDecision: function() {
					return this._.decision;
				},
				getActNames: function() {
					return this._.actNames.split(',');
				},
				isForceOpinion: function() {
					return this._.isForceOpinion;
				}
			};
		decision.prototype = $.extend(new Base(), ex);
		decision.asArray = function(decisions, nova) {
			var buf = new Array();
			$.each(decisions, function(i, v) {
				buf.push(new Decision(v, nova));
			});
			return buf;
		};
		return decision;
	})();

	var Handler = (function() {
		var handler = function(p, nova) {
				this._ = p;
				this._nova = nova
			},
			ex = {
				getUid: function() {
					return this._.uid;
				},
				getName: function() {
					return this._.name;
				},
				getOrgCode: function() {
					return this._.orgCode;
				},
				getOrgName: function() {
					return this._.orgName;
				},
				getOrgFullName: function() {
					return this._.orgFullName;
				}
			};
		handler.prototype = $.extend(new Base(), ex);
		handler.asArray = function(datas, nova) {
			var buf = new Array();
			$.each(datas, function(i, v) {
				buf.push(new Handler(v, nova));
			});
			return buf;
		};
		return handler;
	})();

	var HandlerNode = (function() {
		var handlerNode = function(p, nova) {
				this._ = p;
				this._nova = nova;
			},
			ex = {
				getId: function() {
					return this._.nodeId;
				},
				getName: function() {
					return this._.nodeName;
				},
				getHandlers: function() {
					return this._handlers || (this._handlers = Handler.asArray(this._.handlerList, this._nova));
				},
				getSubNodes: function() {
					return this._subNodes || (this._subNodes = HandlerNode.asArray(this._.handlerNodeList, this._nova));
				}
			};
		handlerNode.prototype = $.extend(new Base(), ex);
		handlerNode.asArray = function(datas, nova) {
			var buf = new Array();
			$.each(datas, function(i, v) {
				buf.push(new HandlerNode(v, nova));
			});
			return buf;
		};
		return handlerNode;
	})();

	var Opinion = (function() {
		var opinion = function(p, nova) {
				this._ = p;
				this._nova = nova
			},
			ex = {
				getId: function() {
					return this._.id;
				},
				getAuthorUid: function() {
					return this._.handler_uid;
				},
				getAuthorName: function() {
					return this._.handler_name;
				},
				getWriteTime: function() {
					return this._.write_time;
				},
				getTaskId: function() {
					return this._.task_id;
				},
				getTaskTitle: function() {
					return this._.act_title;
				},
				isTaskOpinion: function() {
					return this._.is_task_opinion;
				}
			};
		opinion.prototype = $.extend(new Base(), ex);
		opinion.asArray = function(opinions, nova) {
			var buf = new Array();
			$.each(opinions, function(i, v) {
				buf.push(new Opinion(v, nova));
			});
			return buf;
		};
		return opinion;
	})();

	var Nicole = (function() {
		var nicole = function() {
			this.nic = {};
			this._holder = {};
		};
		nicole.prototype = {
			setPro: function(alias) {
				this.nic.proAlias = alias;
				return this;
			},
			setCode: function(code) {
				this.nic.code = code;
				return this;
			},
			setId: function(id) {
				this.nic.entityId = id;
				return this;
			},
			setAct: function(name) {
				if(name instanceof Activity) {
					this.nic.nextActName = name.getName();
				} else {
					this.nic.nextActName = name;
				}
			},
			addUid: function(actName, uid) {
				if(arguments.length == 1) {
					uid = actName;
					actName = this.get(HOLDER_CUR_NEXT_ACT);
				}
				if(actName instanceof Activity) {
					actName = actName.getName();
				}
				var uids = (this.nic.actUidsMap || (this.nic.actUidsMap = {}))[actName];
				if(!uids) {
					uids = this.nic.actUidsMap[actName] = new Array();
				}
				if($.isArray(uid)) {
					uids.concat(uid);
				} else {
					uids.push(uid);
				}
			},
			param: function() {
				return $.param({
					'~nicole': JSON.stringify(this.nic)
				});
			},
			put: function(k, v) {
				this._holder[k] = v;
			},
			get: function(k) {
				return this._holder[k];
			}
		};
		return nicole;
	})();

	/****private function *******/
	function getContentPostStr(content, traditional) {
		var str = null;
		if(!content) return str;
		if($.type(content) === "string") {
			str = $.param({
				'NOVA_ENTITY_TITLE': content
			});
		} else if($.isPlainObject(content)) {
			str = $.param(content, traditional);
		} else if($.isArray(content)) {
			_error('暂不支持数组提交');
		} else if($(content).is("form") || $(content).has(':input')) {
			str = $(content).serialize();
		}
		return str;
	}

	function getConfig(successFun, config) {
		(config || (config = {})).success = (successFun || config.success);
		return config;
	}

	function doFun(fun) {
		fun && ($.isFunction(fun)) && fun();
	}
	/****common function *******/
	function _debug(l, k, v) {
		if(isDebug && console) {
			console.info(l + '=>' + k + ':');
			console.info(v);
		}
	}

	function _warn(msg) {
		if(console) {
			console.warn('Nova.js warn:' + msg);
		}
	}

	function _error(msg) {
		_alert(msg, 'Nova Error');
		throw 'Nova.js :' + msg;
	}

	function _alert(msg, title) {
		var alertFunc = window.$p ? $p.alert : window.alert;
		alertFunc(msg, (title || 'Nova 提示'));
	}
	//异步Post提交
	function _apost(act, data, callback, fail, caller) {
		_post.call(this, act, data, callback, fail, caller, true);
	};
	//Post提交
	function _post(act, data, callback, fail, caller, async) {
		var _this = this;
		$.ajax({
			'type': 'post',
			'contentType': 'application/x-www-form-urlencoded;charset=UTF-8',
			'async': async || false,
			'dataType': 'json',
			'url': ENGINE_PATH + '&act=' + act,
			'data': data,
			'success': function(json) {
				if(json.s == 1) {
					if(!callback) return;
					if(caller) {
						callback.call(caller, json.d);
					} else {
						callback.call(this, json.d);
					};
				} else if(json.s <= 0) {
					if($.isFunction(fail)) {
						fail({
							'msg': json.m
						});
					} else {
						_error(json.m);
					}

				} else {
					switch(json.s) {
						case STATUS_FEEDBACK_NEXT_ACT_PENDING:
							caller._doActContinue(_this.chooseAct(Activity.asArray(json.d), caller._doActContinue.bind(caller)));
							break;
						case STATUS_FEEDBACK_NEXT_HANDLER_PENDING:
							var data = {
								'act': new Activity(json.d.act, _this),
								'handlers': Handler.asArray(json.d.handlers, _this),
								'handlerNode': new HandlerNode(json.d.handlerNode, _this)
							};
							_debug('_doUidContinue', 'data.handlerNode.getSubNodes().getHandlers()', data.handlerNode.getSubNodes());
							caller.getNic().put(HOLDER_CUR_NEXT_ACT, data.act);
							caller._doUidContinue(_this.chooseUid(data, caller._doUidContinue.bind(caller)));
							break;
						default:
							_error('status:' + json.s + ' - ' + json.m);
					}
				}
			},
			'error': function(XMLHttpRequest, textStatus, errorThrown) {
				if(console) console.error('textStatus:' + textStatus + '\n' + 'errorThrown' + errorThrown);
				if($.isFunction(fail)) {
					fail({
						'msg': textStatus
					});
				} else {
					if(XMLHttpRequest.readyState == 4) {
						var sb = new Array();
						sb.push('<div style="width:550px;font-size:16px;">');
						sb.push('<b>抱歉，操作失败了！请联系pandora@sogou-inc.com帮您处理。</b>');
						sb.push('<img src="/htdocs/images/horror_face.png" title="猛击显示错误。"');
						sb.push('style="cursor:pointer"');
						sb.push('onclick="$(\'._class_p_error_trace_container\').toggle()"/></div>');
						sb.push('<div class="_class_p_error_trace_container"');
						sb.push('style="display:none;height:400px;overflow-y:scroll;overflow-x:hidden;');
						sb.push('margin:0px -18px 0px -18px;background-color:black;color:white;text-shadow:none">');
						sb.push(XMLHttpRequest.responseText + '</div>');
						var msg = sb.join('').toString();
						msg = msg.replace(/(Caused by:.*)/g, '<br><font color="red">$1</font><br>');
						msg = msg.replace(/(java.*?Exception:.*)/g, '<br><font color="yellow">$1</font><br>');
						_alert(msg, 'Nova-异常提示');
					}
				}

			}
		});
	};

	/****ECMA5 patch *******/
	if(!Function.prototype.bind) {
		Function.prototype.bind = function(obj) {
			var _self = this;
			return function() {
				_self.apply(obj, arguments);
			};
		};
	}

})(window);