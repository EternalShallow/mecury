/**
 * 页面入口文件配置
 */
const server = require('./server.config.js');

const conf = {
  entry: {
    module: '../../src/', //入口文件路劲地址
  },
  output: {
    path: '../dist/', //文件的输出目录
  },
  server,
  resolve: dir => path.join(__dirname, c.cf.entry.module, dir),
};
module.exports = conf;

/**
 * --------------------------------------------------------
 * 跨域请求，模拟服务器接口
 */
const ip = require('ip');

const http = `http://${ip.address()}:${conf.server.port}`;


const entryArr = conf.entry.module.split('.');


const entry = entryArr[entryArr.length - 1];

const userToken = () => {
  let token = {};
  try {
    token = require('../../dev/user.token');
  } catch (e) {} finally {}
  return token;
};

//这是跨域访问
module.exports.prox = {
  '*': {
    headers: {
      Cookie: `SESSION=${userToken().SESSION}`,
    },
    //host: 'test.eoi.sogou',
    changeOrigin: true,
    target: conf.server.target,
  },
  '/pub/**': { //匹配所有接口
    target: conf.server.target, //跨域Ip地址
    secure: false,
  },
  //访问指定目录下的所有json文件，测试成功
  '/mock/**': {
    target: http,
    pathRewrite(upath, option) {
      console.log(`本地数据：${http}${upath.replace('/mock', `${entry}/assets/mock/json/`)}.json`);
      return `${upath.replace('/mock', `${entry}/assets/mock/json/`)}.json`;
    },
  },
  //指向到某一个json文件，测试成功
  '/version/index': {
    target: `${http}/${entry}/views/demo/table/json/dataList.json`,
    pathRewrite: {
      '^/version/index': '',
    },
  },
};
