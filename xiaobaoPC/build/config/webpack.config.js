const webpack = require('webpack');


const path = require('path');


const HtmlWebpackPlugin = require('html-webpack-plugin');

//ExtractTextPlugin = require('extract-text-webpack-plugin'),// 4.0弃用

const ip = require('ip');

const CleanPlugin = require('clean-webpack-plugin');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const Visualizer = require('webpack-visualizer-plugin');

const HappyPack = require('happypack');
//CopyWebpackPlugin = require('copy-webpack-plugin'),

const CompressionPlugin = require('compression-webpack-plugin');
const pkg = require('./packConfig');

const env = process.env.npm_lifecycle_event == 'build';
const resolve = dir => path.join(__dirname, pkg.entry.module, dir);

const webpackConfig = {
  entry: {
    app: [resolve('/components/main/app.js')],
  },
  output: {
    path: resolve(pkg.output.path),
    publicPath: '',
    filename: 'assets/js/[name].js',
    chunkFilename: 'chunk/[name].js',
    library: 'so',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    sourcePrefix: '\t', //更改输出包中每行的前缀
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
    host: ip.address(),//'0.0.0.0', //
    //historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
    },
    contentBase: './',
    https: false, //先不启动
    before(app) {
      require('../mock/mock-Router.js').before(app);
    },
    proxy: pkg.prox,
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
      name: 'manifest',
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: '../assets/js/vendor',
          chunks: 'all',
          //enforce: true //不知道干啥的，webpack官方示例提到
        },
      },
    },
    occurrenceOrder: true, // 在不同的模式之间保持文件名一致（例如只构建）
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.min',
      'vue-router': 'vue-router/dist/vue-router.min',
      vuex: 'vuex/dist/vuex.min',

      mockjs: 'mockjs/dist/mock.js',
      '@': resolve('assets'),
      components: resolve('components'),
      views: resolve('views'),
      directives: resolve('directives'),
      router: resolve('router'),
      store: resolve('store'),
    },
    extensions: ['.js', '.less', '.css', '.vue', '.jsx', '.txt', '.json'], //2.0的配置
  },
  resolveLoader: {
    moduleExtensions: ['-loader'],
  },
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    /*"iview": "iView"*/
  },
  module: {
    //4.0之前是 loaders,现在修改为 rules
    rules: [{
      test: /\.js$/,
      include: resolve('/'),
      loader: 'babel',
    }, {
      test: /\.vue$/,
      loader: 'vue',
    }, {
      test: /\.(css|less)$/,
      include: resolve('/'),
      loader: 'style!css!less',
    }, {
      test: /\.(html|tpl)$/,
      include: resolve('/'),
      loader: 'html',
    }, {
      test: /\.json$/,
      include: resolve('/'),
      loader: 'json',
    }, {
      test: /\.xml$/,
      include: resolve('/'),
      loader: 'xml',
    }, {
      test: /\.(png|jpg|jpeg|gif|icon|ico|webp)$/,
      include: resolve('/'),
      loader: 'url?limit=4192&name=assets/img/[name].[hash:5].[ext]',
    }, {
      test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
      include: resolve('/'),
      loader: 'file?&name=assets/fonts/[name].[ext]',
    }, {
      test: /\.(swf|mp4)?$/,
      include: resolve('/'),
      loader: 'file?name=assets/video/[name].[hash:5].[ext]',
    }, {
      test: /\.txt$/,
      include: resolve('/'),
      loader: 'text',
    },
      /*, {
				test: /\.jsx$/,
				include: resolve("/"),
				loaders: ['jsx', 'babel']
			}*/
    ],
  },
  plugins: [
    /*new HappyPack({
			loaders: ['babel-loader?presets[]=es2015']
		}),*/
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('/components/main/index.ejs'),
    }),
    //4.0 删除 CommonsChunkPlugin模块，改为splitChunks
    /* new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor'
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			chunks: ['vendor'],
		}), */
    //new webpack.NoErrorsPlugin(), 4.0去除

    //4.0报错   Use Chunks.groupsIterable and filter by instanceof Entrypoint instead
    /*new ExtractTextPlugin({
			filename: 'assets/css/[name].css',
			allChunks: true
		}),*/
    /* new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(js|css)$'),
      threshold: 50240,
      minRatio: 0.8,
    }), */
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
      plugins.push(new CleanPlugin(['*'], {
        root: resolve(pkg.output.path),
        verbose: true,
        dry: false,
      }));
      /* //拷贝文件
			plugins.push(new CopyWebpackPlugin([{
				from: resolve("assets/js/nova/"),
				to: resolve(`${pkg.output.path}/assets/js/nova/`),
				//force:true,//强制覆盖先前的插件
				ignore: ['.*']
			}], {
				copyUnmodified: true //覆盖所有
			})); */
      return plugins;
    })(),
  ],
};

//Gulp
//npm install babel-core babel-loader babel-plugin-transform-runtime babel-polyfill babel-preset-es2015 babel-preset-stage-0 babel-runtime clean-webpack-plugin compression-webpack-plugin copy-webpack-plugin css-loader file-loader gulp gulp-imagemin gulp-copy gulp-load-plugins happypack html-loader html-webpack-plugin ip less less-loader path style-loader text-loader url-loader vue vue-hot-reload-api vue-html-loader vue-loader vue-router vue-style-loader vue-template-compiler vuex webpack webpack-bundle-analyzer webpack-dev-server webpack-cli webpack-visualizer-plugin mockjs --save-dev

//无 gulp
//npm install babel-core babel-loader babel-plugin-transform-runtime babel-polyfill babel-preset-es2015 babel-preset-stage-0 babel-runtime clean-webpack-plugin compression-webpack-plugin copy-webpack-plugin css-loader file-loader happypack html-loader html-webpack-plugin ip less less-loader path style-loader text-loader url-loader vue vue-hot-reload-api vue-html-loader vue-loader vue-router vue-style-loader vue-template-compiler vuex webpack webpack-bundle-analyzer webpack-dev-server webpack-cli webpack-visualizer-plugin mockjs gulp gulp-copy --save-dev

//vux-loader 配置
//npm install babel-core babel-loader babel-plugin-transform-runtime babel-polyfill babel-preset-es2015 babel-preset-stage-0 babel-runtime clean-webpack-plugin compression-webpack-plugin copy-webpack-plugin css-loader file-loader happypack html-loader html-webpack-plugin ip less less-loader path style-loader url-loader vue vue-hot-reload-api vue-html-loader vue-loader vue-router vue-style-loader vue-template-compiler vuex webpack webpack-bundle-analyzer webpack-dev-server webpack-cli webpack-visualizer-plugin mockjs gulp gulp-copy vux vux-loader --save-dev

//----------------------------------------------------------------------
/**
 * vux-loader 配置
 */
module.exports = webpackConfig;
