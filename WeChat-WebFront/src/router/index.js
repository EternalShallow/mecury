import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import { appRouters } from './router';
import store from 'store' //仓库

const env = process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production';
//页面导航
export const router = new VueRouter({
  //mode: "hash",
  mode: env ? 'history' : 'hash',
  routes: [
    ...appRouters,
    {
      path: '/401',
      meta: {
        title: '401-权限不足'
      },
      name: 'error_401',
      component: r => require.ensure([], () => r(require('components/error_page/401')), "401")
    }, {
      path: '/500',
      meta: {
        title: '500-服务端错误'
      },
      name: 'error_500',
      component: r => require.ensure([], () => r(require('components/error_page/500')), "500")
    }, {
      path: '*', //404
      name: 'error_404',
      meta: {
        title: '404-页面不存在'
      },
      component: r => require.ensure([], () => r(require('components/error_page/404')), '404')
    }
  ],
  /* scrollBehavior(to,from,savePosition){ // 在点击浏览器的“前进/后退”，或者切换导航的时候触发。
    if (savePosition) {
      return savePosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savePosition = document.body.scrollTop;
      }
      return { x: 0, y: 0 }
    } 
  }, */

  
  /* scrollBehavior(to, from, savedPosition) {
    // keep-alive 返回缓存页面后记录浏览位置
    if (savedPosition && to.meta.keepAlive) {
      return savedPosition;
    }
    // 异步滚动操作
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ x: 0, y: 1 });
      }, 0);
    });
  },  */
 

});

//历史记录 -- begin -----
const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)
let isPush = false
let endTime = Date.now()
let methods = ['push', 'go', 'replace', 'forward', 'back']

document.addEventListener('touchend', () => {
  endTime = Date.now()
})
methods.forEach(key => {
  let method = router[key].bind(router)

  router[key] = function (...args) {
    isPush = true

    method.apply(null, args)
  }
})
router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', { isLoading: true })

  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('updateDirection', { direction: 'forward' })
    } else {
      // 判断是否是ios左滑返回
      if (!isPush && (Date.now() - endTime) < 377) {
        store.commit('updateDirection', { direction: '' })
      } else {
        store.commit('updateDirection', { direction: 'reverse' })
      }
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.commit('updateDirection', { direction: 'forward' })
  }

  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else {
    next()
  }
})

router.afterEach(function (to) {
  isPush = false
  store.commit('updateLoadingStatus', { isLoading: false })
})