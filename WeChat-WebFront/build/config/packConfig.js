/**
 * 页面入口文件配置
 */
const server = require("./server.config.js");

const conf = {
	entry: {
		module: '../../src/' //入口文件路劲地址
	},
	output: {
		path: "../dist/" //文件的输出目录
	},
	server,
	resolve: dir => {
		return path.join(__dirname, c.cf.entry.module, dir)
	}
}
module.exports = conf;

/**
 * --------------------------------------------------------
 * 跨域请求，模拟服务器接口
 */
let ip = require("ip");


//这是跨域访问
module.exports.prox = {
	'*': { //匹配所有接口
		target: conf.server.target, //跨域Ip地址
		secure: false,
	},
}