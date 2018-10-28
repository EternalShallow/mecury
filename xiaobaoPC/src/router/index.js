import Vue from 'vue';
import VueRouter from 'vue-router';

import iView from 'iview';
import Cookies from 'js-cookie';
import Util from '@/js/utils/libs/util';

import { otherRouters, appRouters } from './router';

Vue.use(VueRouter);

export const appRouter = appRouters;
export const otherRouter = otherRouters;

//页面导航
export const router = new VueRouter({
  mode: 'hash',
  //mode: 'history',
  routes: [{
    path: '/login',
    name: 'login',
    meta: {
      title: '登录页面',
    },
    component: r => require.ensure([], () => r(require('views/mainline/login')), 'login'),
  },
  otherRouter,
  ...appRouter,
  {
    path: '/locking',
    name: 'locking',
    title: 'EOI系统管理',
    component: r => require.ensure([], () => r(require('views/mainline/main/_components/lockscreen/components/locking-page')), 'locking-page'),
  }, {
    path: '/401',
    meta: {
      title: '401-权限不足',
    },
    name: 'error_401',
    component: r => require.ensure([], () => r(require('views/error_page/401')), '401'),
  }, {
    path: '/500',
    meta: {
      title: '500-服务端错误',
    },
    name: 'error_500',
    component: r => require.ensure([], () => r(require('views/error_page/500')), '500'),
  }, {
    path: '*', //404
    name: 'error_404',
    meta: {
      title: '404-页面不存在',
    },
    component: r => require.ensure([], () => r(require('views/error_page/404')), '404'),
  },
  ],
});

/**
 * 拦截器
 */

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  Util.title(to.meta.title);
  if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
    next({
      replace: true,
      name: 'locking',
    });
  } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
    next(false);
  } else {
    /* if (!Cookies.get('user') && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
        	next({
        		name: 'login'
        	});
        } else if (Cookies.get('user') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
        	Util.title();
        	next({
        		name: 'home_index'
        	});
        } else {
        	const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
        	if (curRouterObj && curRouterObj.access !== undefined) { // 需要判断权限的路由
        		if (curRouterObj.access === parseInt(Cookies.get('access'))) {
        			Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
        		} else {
        			next({
        				replace: true,
        				name: 'error-403'
        			});
        		}
        	} else { // 没有配置权限的路由, 直接通过
        		Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next);
        	}
        } */
    const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
    if (curRouterObj && curRouterObj.access !== undefined) { // 需要判断权限的路由
      if (curRouterObj.access === parseInt(Cookies.get('access'))) {
        Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
      } else {
        next({
          replace: true,
          name: 'error-403',
        });
      }
    } else { // 没有配置权限的路由, 直接通过
      Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next);
    }
  }
});

router.afterEach((to) => {
  Util.openNewPage(router.app, to.name, to.params, to.query);
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});
