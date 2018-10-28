//Hi-Hr服务号主路由
import Main from "components/main";
import { demoRouters } from "./demoRouter";
//列表路由
/* 
export const appRouters = [{
	path: '/', //我的薪资登录查询
	redirect: 'weChat/home/index',
}, {
	path: '/weChat',
	name: 'weChat',
	component: Main,
	meta: {
		keepAlive: true,//true 需要被缓存, false 不需要被缓存
	},
	children: [{ //子路由
		path: 'home',
		name: 'home',
		component: Main,
		children: [{
			path: 'index',
			name: 'homeIndex',
			meta: {
				title: '首页',
				keepAlive: true,//true 需要被缓存, false 不需要被缓存
			},
			component: r => require.ensure([], () => r(require("views/weChat/home")), 'weChat.home'),
		}, {
			path: 'search',
			name: 'homeSearch',
			meta: {
				title: '搜索结果页面',
				keepAlive: false,//true 需要被缓存, false 不需要被缓存
			},
			component: r => require.ensure([], () => r(require("views/weChat/home/searchList")), 'weChat.home.searchList'),
		}, {
			path: 'details',
			name: 'homeDetails',
			meta: {
				title: '详情',
				keepAlive: false
			},
			component: r => require.ensure([], () => r(require("views/weChat/home/searchDetails")), 'weChat.home.searchDetails'),
		}, {
			path: 'classList',
			meta: {
				title: '杂志列表',
				keepAlive: false
			},
			component: r => require.ensure([], () => r(require("views/weChat/home/classList")), 'weChat.home.classList'),
		}]
	}, {
		path: 'bookBox',
		meta: {
			title: '书筐',
			keepAlive: false
		},
		component: r => require.ensure([], () => r(require("views/weChat/bookBox")), 'weChat.bookBox'),
	}, {
		path: 'collection',
		meta: {
			title: '收藏',
			keepAlive: false
		},
		component: r => require.ensure([], () => r(require("views/weChat/collection")), 'weChat.collection'),
	}, {
		path: 'member',
		component: Main,
		children: [{
			path: 'index',
			meta: {
				title: '读者信息',
				keepAlive: false
			},
			component: r => require.ensure([], () => r(require("views/weChat/member")), 'weChat.mr'),
		}, {
			path: 'address',
			meta: {
				title: '地址管理',
				keepAlive: false
			},
			component: r => require.ensure([], () => r(require("views/weChat/member/address")), 'weChat.mr.address'),
		}, {
			path: 'addAddress',
			meta: {
				title: '新建收货人',
				keepAlive: false
			},
			component: r => require.ensure([], () => r(require("views/weChat/member/addAddress")), 'weChat.mr.addAddress'),
		}, {
			path: 'myPoints',
			meta: {
				title: '我的积分',
				keepAlive: false
			},
			component: r => require.ensure([], () => r(require("views/weChat/member/myPoints")), 'weChat.mr.myPoints'),
		}, {
			path: 'membershipCard',
			meta: {
				title: '购买会员卡',
				keepAlive: false
			},
			component: r => require.ensure([], () => r(require("views/weChat/member/membershipCard")), 'weChat.mr.shipCard'),
		}, {
			path: 'membershipCardDetail',
			meta: {
				title: '购买会员卡详情',
				keepAlive: false
			},
			component: r => require.ensure([], () => r(require("views/weChat/member/membershipCardDetail")), 'weChat.mr.shipCardDetail'),
		}, {
			path: 'footprint',
			meta: {
				title: '我的足迹',
				keepAlive: false
			},
			component: r => require.ensure([], () => r(require("views/weChat/member/footprint")), 'weChat.mr.footprint'),
		}, {
			path: 'register',
			meta: {
				title: '完善信息',
				keepAlive: false
			},
			component: r => require.ensure([], () => r(require("views/weChat/member/register")), 'weChat.mr.register'),
		}, {
			path: 'registerAred',
			meta: {
				title: '立即领取',
				keepAlive: false
			},
			component: r => require.ensure([], () => r(require("views/weChat/member/registerAred")), 'weChat.mr.registerAred'),
		}, {
			path: 'wholeTab',
			meta: {
				title: '当前书单',
				keepAlive: false
			},
			component: r => require.ensure([], () => r(require("views/weChat/member/wholeTab")), 'weChat.member.wholeTab'),
		}, {
			path: 'historyBook',
			meta: {
				title: '借阅书单',
				keepAlive: false
			},
			component: r => require.ensure([], () => r(require("views/weChat/member/historyBook")), 'weChat.member.historyBook'),
		}, {
			path: 'contactUs',
			meta: {
				title: '会员帮助',
				keepAlive: false
			},
			component: r => require.ensure([], () => r(require("views/weChat/member/contactUs")), 'weChat.member.contactUs'),
		}, {
			path: 'returnBook',
			meta: {
				title: '我要还书',
				keepAlive: false
			},
			component: r => require.ensure([], () => r(require("views/weChat/member/returnBook")), 'weChat.member.returnBook'),
		}, {
			path: 'checkoutSuccess',
			meta: {
				title: '订单成功',
				keepAlive: false
			},
			component: r => require.ensure([], () => r(require("views/weChat/member/checkoutSuccess")), 'weChat.member.checkoutSuccess'),
		}]
	}, {
		path: 'special',
		meta: {
			title: '专题',
			keepAlive: false
		},
		component: r => require.ensure([], () => r(require("views/weChat/special")), 'weChat.special'),
	}, {
		path: 'classification',
		meta: {
			title: '分类',
			keepAlive: false
		},
		component: r => require.ensure([], () => r(require("views/weChat/classification")), 'weChat.classification'),
	}, {
		path: 'logistics',
		meta: {
			title: '物流信息',
			keepAlive: false
		},
		component: r => require.ensure([], () => r(require("views/weChat/logistics")), 'weChat.logistics'),
	}]
}, {
	path: '/active',
	component: Main,
	children: [{
		path: 'list',
		meta: {
			title: '小宝图书馆',
			keepAlive: false
		},
		component: r => require.ensure([], () => r(require("views/active/list")), 'active.list'),
	}, {
		path: 'sowingMap',//活动页面
		meta: {
			title: '小宝图书馆',
			keepAlive: false
		},
		component: r => require.ensure([], () => r(require("views/active/sowingMap")), 'active.sowingMap'),
	}]
}, demoRouters] 
 */
/* 
 //列表路由
export const appRouters = [
	{
		path: '/weChat/home/index',
		meta: {
			title: '首页',
			keepAlive: true,//true 需要被缓存, false 不需要被缓存
		},
		component: r => require.ensure([], () => r(require("views/weChat/home")), 'weChat.home'),
	}, {
		path: '/weChat/home/search',
		meta: {
			title: '搜索结果页面',
			keepAlive: false,//true 需要被缓存, false 不需要被缓存
		},
		component: r => require.ensure([], () => r(require("views/weChat/home/searchList")), 'weChat.home.searchList'),
	}, {
		path: '/weChat/home/details',
		meta: {
			title: '详情',
			keepAlive: false
		},
		component: r => require.ensure([], () => r(require("views/weChat/home/searchDetails")), 'weChat.home.searchDetails'),
	}, {
		path: '/weChat/classification',
		meta: {
			title: '分类',
			keepAlive: false
		},
		component: r => require.ensure([], () => r(require("views/weChat/classification")), 'weChat.classification'),
	}
] 

 */



export const appRouters = [{
	path: '/weChat/', //我的薪资登录查询
	redirect: 'weChat/home/index',
}, {
	path: '/weChat/home/index',
	name: 'homeIndex',
	meta: {
		title: '首页',
		keepAlive: true,//true 需要被缓存, false 不需要被缓存
	},
	component: r => require.ensure([], () => r(require("views/weChat/home")), 'weChat.home'),
}, {
	path: '/weChat/home/search',
	name: 'homeSearch',
	meta: {
		title: '搜索结果页面',
		keepAlive: false,//true 需要被缓存, false 不需要被缓存
	},
	component: r => require.ensure([], () => r(require("views/weChat/home/searchList")), 'weChat.home.searchList'),
}, {
	path: '/weChat/home/details',
	name: 'homeDetails',
	meta: {
		title: '详情',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/home/searchDetails")), 'weChat.home.searchDetails'),
}, {
	path: '/weChat/home/classList',
	meta: {
		title: '杂志列表',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/home/classList")), 'weChat.home.classList'),
}, {
	path: '/weChat/bookBox',
	meta: {
		title: '书筐',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/bookBox")), 'weChat.bookBox'),
}, {
	path: '/weChat/collection',
	meta: {
		title: '收藏',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/collection")), 'weChat.collection'),
}, {
	path: '/weChat/member/index',
	meta: {
		title: '读者信息',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/member")), 'weChat.mr'),
}, {
	path: '/weChat/member/address',
	meta: {
		title: '地址管理',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/member/address")), 'weChat.mr.address'),
}, {
	path: '/weChat/member/addAddress',
	meta: {
		title: '新建收货人',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/member/addAddress")), 'weChat.mr.addAddress'),
}, {
	path: '/weChat/member/myPoints',
	meta: {
		title: '我的积分',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/member/myPoints")), 'weChat.mr.myPoints'),
}, {
	path: '/weChat/member/membershipCard',
	meta: {
		title: '购买会员卡',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/member/membershipCard")), 'weChat.mr.shipCard'),
}, {
	path: '/weChat/member/membershipCardDetail',
	meta: {
		title: '购买会员卡详情',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/member/membershipCardDetail")), 'weChat.mr.shipCardDetail'),
}, {
	path: '/weChat/member/footprint',
	meta: {
		title: '我的足迹',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/member/footprint")), 'weChat.mr.footprint'),
}, {
	path: '/weChat/member/register',
	meta: {
		title: '完善信息',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/member/register")), 'weChat.mr.register'),
}, {
	path: '/weChat/member/registerAred',
	meta: {
		title: '立即领取',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/member/registerAred")), 'weChat.mr.registerAred'),
}, {
	path: '/weChat/member/wholeTab',
	meta: {
		title: '当前书单',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/member/wholeTab")), 'weChat.member.wholeTab'),
}, {
	path: '/weChat/member/historyBook',
	meta: {
		title: '借阅书单',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/member/historyBook")), 'weChat.member.historyBook'),
}, {
	path: '/weChat/member/contactUs',
	meta: {
		title: '会员帮助',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/member/contactUs")), 'weChat.member.contactUs'),
}, {
	path: '/weChat/member/returnBook',
	meta: {
		title: '我要还书',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/member/returnBook")), 'weChat.member.returnBook'),
}, {
	path: '/weChat/member/checkoutSuccess',
	meta: {
		title: '订单成功',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/member/checkoutSuccess")), 'weChat.member.checkoutSuccess'),
}, {
	path: '/weChat/special',
	meta: {
		title: '专题',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/special")), 'weChat.special'),
}, {
	path: '/weChat/classification',
	meta: {
		title: '分类',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/classification")), 'weChat.classification'),
}, {
	path: '/weChat/logistics',
	meta: {
		title: '物流信息',
		keepAlive: false
	},
	component: r => require.ensure([], () => r(require("views/weChat/logistics")), 'weChat.logistics'),
}, {
	path: '/active',
	component: Main,
	children: [{
		path: 'list',
		meta: {
			title: '小宝图书馆',
			keepAlive: false
		},
		component: r => require.ensure([], () => r(require("views/active/list")), 'active.list'),
	}, {
		path: 'sowingMap',//活动页面
		meta: {
			title: '小宝图书馆',
			keepAlive: false
		},
		component: r => require.ensure([], () => r(require("views/active/sowingMap")), 'active.sowingMap'),
	}]
}, demoRouters] 
