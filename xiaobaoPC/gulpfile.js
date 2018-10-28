const gulp = require('gulp'),
	gulpCopy = require('gulp-copy'),
	config = require('./build/config/packConfig.js');

/**
 * webpack 调用
 * 编译代码
 */
const webpack = require('webpack');
const webpackConfig = require('./build/config/webpack.config.js');
gulp.task('build', function (callback) {
	var dateTime = new Date().getTime();
	console.log('## 代码编译开始...');

	webpack(webpackConfig, function (err, state) {
		callback(err);
		var dateTime2 = (new Date().getTime() - dateTime) / 1000;
		console.log('## 代码编译完成，共耗时：' + dateTime2 + "秒");
	})
})
/**
 * 复制整个文件夹
 */
/*gulp.task('copy', ['build'], function () {
	console.log('## 开始拷贝文件到 WebRoot...');
	return gulp.src('dist/**/*').pipe(gulp.dest("../../WebRoot/pub/hr/hr-mobile/"))
});*/

/*
 * 图片压塑，执行顺序：先执行build 后执行  图片压塑
 * */
const imagemin = require('gulp-imagemin');
const plugins = require('gulp-load-plugins')();
gulp.task('img-min', ['build'], function () {
	console.log("\n## 图片压缩中...");
	var dateTime = new Date().getTime();
	gulp.src(config.output.path + '**' + "/*.+(png|jpg|ico|gif)")
		.pipe(plugins.imagemin())
		.pipe(gulp.dest(config.output.path));
});

gulp.task('buildCopy');
gulp.task('buildImg', ['build', 'img-min']); //图片压缩,不进行上传