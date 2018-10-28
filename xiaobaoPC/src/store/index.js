import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import app from './modules/app';
import user from './modules/user';

export default new Vuex.Store({
	state: {},
	mutations: {},
	actions: {},
	modules: {
		app,
		user,
	},
})