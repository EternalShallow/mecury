const webpack = require('webpack'),
	path = require('path'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	//ExtractTextPlugin = require('extract-text-webpack-plugin'),// 4.0弃用
	ip = require('ip'),
	CleanPlugin = require('clean-webpack-plugin'),
	pkg = require('./packConfig'),
	BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
	Visualizer = require('webpack-visualizer-plugin'),
	HappyPack = require('happypack'),
	CopyWebpackPlugin = require('copy-webpack-plugin'),
	CompressionPlugin = require('compression-webpack-plugin');

const env = (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production');

const resolve = dir => {
	return path.join(__dirname, pkg.entry.module, dir)
}

var webpackConfig = {
	entry: {
		app: [resolve("/components/main/app.js")],
	},
	output: {
		path: resolve(pkg.output.path),
		publicPath: env ? '/weChat/' : '',
		filename: "assets/js/[name].[hash].js",
		chunkFilename: "chunk/[name].[hash].js",
		library: "RK",
		libraryTarget: 'umd',
		umdNamedDefine: true,
		sourcePrefix: "\t" //更改输出包中每行的前缀
	},
	devServer: {
		inline: true, //开启页面自动刷新
		lazy: false, //不启动懒加载
		quiet: false, //控制台中不输出打包的信息
		progress: true, //显示打包的进度
		open: true,
		port: pkg.server.port,
		compress: true,
		disableHostCheck: true, //设置为true时，此选项绕过主机检查。不建议这样做，因为不检查主机的应用程序容易受到DNS重新绑定攻击。
		host: ip.address(),
		historyApiFallback: true,
		watchOptions: {
			aggregateTimeout: 300,
		},
		contentBase: './',
		https: false, //先不启动
		before(app) {
			require("../mock/mock-Router.js").before(app);
		},
		proxy: pkg.prox
	},
	//4.0配置
	optimization: {
		/*splitChunks: {
		    chunks: 'all',//"initial" | "async" | "all"
		    cacheGroups: {
		        default: false,
		        vendors: false,
		    },
		},*/
		/*splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }*/
		runtimeChunk: {
			name: "manifest"
		},
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: "../assets/js/vendor",
					chunks: "all",
					//enforce: true //不知道干啥的，webpack官方示例提到
				}
			}
		},
		occurrenceOrder: true // 在不同的模式之间保持文件名一致（例如只构建）
	},
	resolve: {
		alias: {
			'vue': 'vue/dist/vue.min',
			'vue-router': 'vue-router/dist/vue-router.min',
			'vuex': 'vuex/dist/vuex.min',

			"mockjs": "mockjs/dist/mock.js",
			'@': resolve('assets'),
			'components': resolve('components'),
			'views': resolve('views'),
			'directives': resolve('directives'),
			"router": resolve('router'),
			"store": resolve('store'),

		},
		extensions: ['.js', '.less', '.css', '.vue', '.jsx', '.txt', '.json'], //2.0的配置
	},
	resolveLoader: {
		moduleExtensions: ['-loader']
	},
	externals: { //文件不进行打包
		"vue": "Vue",
		"vue-router": 'VueRouter',
		"vuex": 'Vuex',
	},
	module: {
		//4.0之前是 loaders,现在修改为 rules
		rules: [{
			test: /\.js$/,
			include: resolve("/"),
			loader: 'babel',
		}, {
			test: /\.vue$/,
			loader: 'vue',
		}, {
			test: /\.(css|less)$/,
			loader: "style!css!less"
		}, {
			test: /\.(html|tpl)$/,
			include: resolve("/"),
			loader: 'html'
		}, {
			test: /\.json$/,
			include: resolve("/"),
			loader: "json"
		}, {
			test: /\.xml$/,
			include: resolve("/"),
			loader: "xml"
		}, {
			test: /\.(png|jpg|jpeg|gif|icon|ico|webp)$/,
			loader: 'url?limit=4192&name=assets/img/[name].[hash:5].[ext]'
		}, {
			test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
			loader: "file?&name=assets/fonts/[name].[ext]"
		}, {
			test: /\.(swf|mp4)?$/,
			include: resolve("/"),
			loader: 'file?name=assets/video/[name].[hash:5].[ext]',
		}, {
			test: /\.txt$/,
			include: resolve("/"),
			loader: "text"
		}
			/*, {
				test: /\.jsx$/,
				include: resolve("/"),
				loaders: ['jsx', 'babel']
			}*/
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: resolve('/components/main/index.ejs')
		}),

		new CompressionPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp('\\.(js|css)$'),
			threshold: 50240,
			minRatio: 0.8
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		//new Visualizer(), //webpack 可视化视图
		...(() => {
			if (!env) return [];
			const plugins = [];
			plugins.push(new BundleAnalyzerPlugin({
				analyzerMode: 'server',
				analyzerHost: ip,
				analyzerPort: 8888,
				reportFilename: 'report.html',
				openAnalyzer: true,
				analyzerHost: ip.address(),
			}));
			//打包前删除输出目录文件
			plugins.push(new CleanPlugin(["*"], {
				"root": resolve(pkg.output.path),
				verbose: true,
				dry: false
			}))
			return plugins;
		})()
	]
};

//Gulp
//npm install babel-core babel-loader babel-plugin-transform-runtime babel-polyfill babel-preset-es2015 babel-preset-stage-0 babel-runtime clean-webpack-plugin compression-webpack-plugin copy-webpack-plugin css-loader file-loader gulp gulp-imagemin gulp-copy gulp-load-plugins happypack html-loader html-webpack-plugin ip less less-loader path style-loader text-loader url-loader vue vue-hot-reload-api vue-html-loader vue-loader vue-router vue-style-loader vue-template-compiler vuex webpack webpack-bundle-analyzer webpack-dev-server webpack-cli webpack-visualizer-plugin mockjs --save-dev

//无 gulp
//npm install babel-core babel-loader babel-plugin-transform-runtime babel-polyfill babel-preset-es2015 babel-preset-stage-0 babel-runtime clean-webpack-plugin compression-webpack-plugin copy-webpack-plugin css-loader file-loader happypack html-loader html-webpack-plugin ip less less-loader path style-loader text-loader url-loader vue vue-hot-reload-api vue-html-loader vue-loader vue-router vue-style-loader vue-template-compiler vuex webpack webpack-bundle-analyzer webpack-dev-server webpack-cli webpack-visualizer-plugin mockjs gulp gulp-copy --save-dev

//vux-loader 配置
//npm install babel-core babel-loader babel-plugin-transform-runtime babel-polyfill babel-preset-es2015 babel-preset-stage-0 babel-runtime clean-webpack-plugin compression-webpack-plugin copy-webpack-plugin css-loader file-loader happypack html-loader html-webpack-plugin ip less less-loader path style-loader url-loader vue vue-hot-reload-api vue-html-loader vue-loader vue-router vue-style-loader vue-template-compiler vuex webpack webpack-bundle-analyzer webpack-dev-server webpack-cli webpack-visualizer-plugin mockjs gulp gulp-copy vux vux-loader  vuex-router-sync --save-dev

//----------------------------------------------------------------------
/**
 * vux-loader 配置
 */
const vuxLoader = require('vux-loader');
module.exports = vuxLoader.merge(webpackConfig, {
	plugins: [
		'vux-ui', //配置babel-loader以正确编译Vux的js源码（通过配置vux-loader实现）
		'duplicate-style', //添加webpack plugin, 在构建后去除重复css代码（通过配置vux-loader实现）
		{
			name: 'less-theme',
			path: 'src/assets/css/variable.less'
		},
		///------------

		//=======
	]
});


function toDash(str) {
	return str.replace(/([A-Z])/g, function (m, w) {
		return '-' + w.toLowerCase();
	}).replace('-', '')
}
