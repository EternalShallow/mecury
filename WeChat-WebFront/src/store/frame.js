export default {
	state: {
		demoScrollTop: 0,
		isLoading: false,
		direction: 'forward',
		badge: 0,
		cachePage: [],//缓存的页面
	},
	mutations: {
		updateDemoPosition(state, payload) {
			state.demoScrollTop = payload.top
		},
		updateLoadingStatus(state, payload) {
			state.isLoading = payload.isLoading
		},
		updateDirection(state, payload) {
			state.direction = payload.direction
		},
		updateBadge(state, payload) {
			state.badge = payload.badge
		},
		closePage(state, name) {
			state.cachePage.forEach((item, index) => {
				if (item === name) {
					state.cachePage.splice(index, 1);
				}
			});
		},
		initCachepage(state) {
			if (localStorage.cachePage) {
				state.cachePage = JSON.parse(localStorage.cachePage);
			}
		},
	},
	actions: {
		updateDemoPosition({
			commit
		}, top) {
			commit({
				type: 'updateDemoPosition',
				top: top
			})
		}
	}
}