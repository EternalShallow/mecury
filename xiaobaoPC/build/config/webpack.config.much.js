var webpack = require('webpack'),
	path = require('path'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	//ExtractTextPlugin = require('extract-text-webpack-plugin'), 4.0弃用
	ip = require('ip'),
	CleanPlugin = require('clean-webpack-plugin'),
	c = require('./packConfig'),
	HashedModuleIdsPlugin = require('./HashedModuleIdsPlugin'),
	BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
	Visualizer = require('webpack-visualizer-plugin'),
	HappyPack = require('happypack'),
	CopyWebpackPlugin = require('copy-webpack-plugin'),
	CompressionPlugin = require('compression-webpack-plugin');

const env = process.env.NODE_ENV == "prod";
const resolve = dir => {
	return path.join(__dirname, c.cf.entry.module, dir)
}

//配置信息
const entries = [
	// "hr/salary/calculate",
	"hr/public-account/leaveApply"
];

module.exports = {
	/*entry: {
		app: resolve("/components/app.js"),
	},*/
	//---------begin start---------
	entry: (() => {
		const entrie = {
			app: resolve("/components/app.js")
		};
		entries.forEach((entry) => {
			if(entry) {
				entrie[entry] = [
					resolve(`../src/views/${entry}/index.vue`)
				];
			}
		});
		return entrie;
	})(),
	//---------begin end---------

	output: {
		path: resolve(c.cf.output.path),
		publicPath: '',
		filename: "assets/js/[name].js",
		chunkFilename: "chunk/[name].js",
		library: 'library',
		libraryTarget: 'umd',
		umdNamedDefine: true,
		sourcePrefix: "\t" //更改输出包中每行的前缀
	},
	devServer: {
		inline: true,
		open: true,
		port: c.cf.server.port,
		compress: true,
		host: ip.address(),
		progress: true,
		historyApiFallback: true,
		contentBase: "./",
		https: false, //先不启动
		before(app) {
			require("../mock/mock-Router.js").before(app);
		},
		proxy: c.prox
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
					chunks: "all"
				}
			}
		}
	},
	resolve: {
		alias: {
			'vue': 'vue/dist/vue.min',
			'vue-router': 'vue-router/dist/vue-router.min',
			'vuex': 'vuex/dist/vuex.min',
			"babel-polyfill": 'babel-polyfill/dist/polyfill.min',

			"mockjs": "mockjs/dist/mock.js",
			'@': resolve('assets'),
			'components': resolve('components'),
			'views': resolve('views'),
			'directives': resolve('directives'),
			"router": resolve('router'),

		},
		extensions: ['.js', '.less', '.css', '.vue', '.jsx', '.txt', '.json'], //2.0的配置
	},
	resolveLoader: {
		moduleExtensions: ['-loader']
	},
	externals: {

	},
	module: {
		//4.0之前是 loaders,现在修改为 rules
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel',
		}, {
			test: /\.vue$/,
			exclude: /node_modules/,
			loader: 'vue',
		}, {
			test: /\.(css|less)$/,
			exclude: /node_modules/,
			loader: "style!css!less"
		}, {
			test: /\.(html|tpl)$/,
			exclude: /node_modules/,
			loader: 'html'
		}, {
			test: /\.json$/,
			exclude: /node_modules/,
			loader: "json"
		}, {
			test: /\.xml$/,
			exclude: /node_modules/,
			loader: "xml"
		}, {
			test: /\.(png|jpg|jpeg|gif|icon|ico|webp)$/,
			exclude: /node_modules/,
			loader: 'url?limit=4192&name=assets/img/[name].[hash:5].[ext]'
		}, {
			test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
			exclude: /node_modules/,
			loader: "file?&name=assets/fonts/[name].[ext]"
		}, {
			test: /\.(swf|mp4)?$/,
			loader: 'file?name=assets/video/[name].[hash:5].[ext]',
		}, {
			test: /\.txt$/,
			exclude: /node_modules/,
			loader: "text"
		}, {
			test: /\.jsx$/,
			exclude: /node_modules/,
			loaders: ['jsx', 'babel']
		}],
		noParse: /jquery|lodash/,

		unknownContextRegExp: /$^/,
		unknownContextCritical: false,

		exprContextRegExp: /$^/,
		exprContextCritical: false,

		wrappedContextRegExp: /$^/,
		wrappedContextCritical: false,

	},
	plugins: [
		//----begin- duo
		...(() => {
			const plugins = [];
			entries.forEach((entry) => {
				if(entry) {
					plugins.push(new HtmlWebpackPlugin({
						chunks: ["app", entry],
						inject: true,
						filename: `${entry}/index.html`,
						template: resolve('/components/index.html')
					}));
				}
			});
			return plugins;
		})(),
		//------begin end---------------

		new HashedModuleIdsPlugin(),
		/* //4.0 删除 CommonsChunkPlugin模块，改为splitChunks
		 * new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor'
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			chunks: ['vendor'],
		}),
		/* //4.0报错   Use Chunks.groupsIterable and filter by instanceof Entrypoint instead
		 new ExtractTextPlugin({
			filename: 'assets/css/[name].css',
			allChunks: true 
		}),*/
		new CompressionPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp('\\.(js|css)$'),
			threshold: 50240,
			minRatio: 0.8
		}),
		//new webpack.NoErrorsPlugin(), 4.0去除
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin()
	]
};

if(env) {
	module.exports.plugins.push(new BundleAnalyzerPlugin({
		analyzerMode: 'server',
		analyzerHost: ip,
		analyzerPort: 8888,
		reportFilename: 'report.html',
		openAnalyzer: false,
		analyzerHost: ip.address(),
	}));
	//new Visualizer(), //webpack 可视化视图
	module.exports.plugins.push(new CleanPlugin(["*"], {
		"root": resolve(c.cf.output.path),
		verbose: true,
		dry: false
	}))
}


//Gulp
//npm install babel-core babel-loader babel-plugin-transform-runtime babel-polyfill babel-preset-es2015 babel-preset-stage-0 babel-runtime clean-webpack-plugin compression-webpack-plugin copy-webpack-plugin css-loader file-loader gulp gulp-imagemin gulp-load-plugins happypack html-loader html-webpack-plugin ip less less-loader path style-loader text-loader url-loader vue vue-hot-reload-api vue-html-loader vue-loader vue-router vue-style-loader vue-template-compiler vuex webpack webpack-bundle-analyzer webpack-dev-server webpack-cli webpack-visualizer-plugin mockjs --save-dev

//无 gulp
//npm install babel-core babel-loader babel-plugin-transform-runtime babel-polyfill babel-preset-es2015 babel-preset-stage-0 babel-runtime clean-webpack-plugin compression-webpack-plugin copy-webpack-plugin css-loader file-loader happypack html-loader html-webpack-plugin ip less less-loader path style-loader text-loader url-loader vue vue-hot-reload-api vue-html-loader vue-loader vue-router vue-style-loader vue-template-compiler vuex webpack webpack-bundle-analyzer webpack-dev-server webpack-cli webpack-visualizer-plugin mockjs --save-dev
