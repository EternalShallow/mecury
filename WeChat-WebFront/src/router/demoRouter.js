/**
 * demo 路由
 */
import Main from "components/main";

export const demoRouters = {
	path: '/demo/',
	component: Main,
	children: [{ //button
		path: 'button',
		meta: {
			title: 'Hello World'
		},
		component: r => require.ensure([], () => r(require('views/demo/button')), "demo.button")
	}, { //button
		path: 'parabola',
		meta: {
			title: '抛物线'
		},
		component: r => require.ensure([], () => r(require('views/demo/parabola')), "demo.parabola")
	}]
}