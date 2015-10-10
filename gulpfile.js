
// GULP PLUGIN VARIABLES
////////////////////////////////////////////

var gulp 			= require('gulp'),

	// global
	concat			= require('gulp-concat'),
	rename			= require('gulp-rename'),
	sourcemaps   	= require('gulp-sourcemaps'),	
	size		 	= require('gulp-filesize'),
	browserSync		= require('browser-sync').create(),
	reload		 	= browserSync.reload,

	// html
	minHTML 		= require('gulp-minify-html'),
	
	// css
	sass 		 	= require('gulp-sass'),
	autoprefixer 	= require('gulp-autoprefixer'),
	minCSS		 	= require('gulp-minify-css'),
	
	// js
	jshint 			= require('gulp-jshint'),
	stylish			= require('jshint-stylish'),
	uglify 			= require('gulp-uglify'),
	changed 		= require('gulp-changed'),

	// svg
	svgSprite		= require('gulp-svg-sprite'),
	svgConfig 		= {
		mode		: { // output mode
			view	: {	// view mode for background-image svg usage
				dimensions : true, 
				sprite  : 'sprite-view',
				bust	: false,
				render	: { scss : true }
			} // view
		} // mode
	}; // svgConfig



// PROJECT FILE PATHS
////////////////////////////////////////////

var dev = {
	scss  : './dev/scss/**/*.scss',
	js    : './dev/js/**/*.js',
	html  : './dev/**/*.html',
	img   : './dev/img/**/*.{jpg,jpeg,png,gif}',
	svg   : './dev/svg',
	svgBg : './dev/svg/svg-bg/*.svg',
	svgView : './dev/svg/view/sprite.css', 
	svgIn : './dev/svg/svg-inline/*.svg'
};

var prod = {
	css  : './prod/css',
	js   : './prod/js',
	html : './prod/',
	img  : './prod/img'
};



// GULP TASKS
////////////////////////////////////////////

// gulp
gulp.task('default', ['browserSync']);

// browser sync - static server
gulp.task('browserSync', ['sass', 'html', 'js'], function() {
	browserSync.init({
		server: './prod/'
	});

	gulp.watch(dev.scss, ['sass']);
	gulp.watch(dev.html, ['html']);
	gulp.watch(dev.js, ['js']);
});

// HTML: minify & move to production
gulp.task('html', function(){
	return gulp.src(dev.html)
	.pipe(changed(prod.html))
	.pipe(minHTML())
	.pipe(gulp.dest(prod.html))
	.pipe(size())
	.pipe(reload({stream: true}));
});

// SCSS/SASS: compile, rename, & move to production
gulp.task('sass', function(){
	return gulp.src(dev.scss)
	.pipe(sourcemaps.init())
	.pipe(sass({ errLogToConsole: true }))
	.pipe(autoprefixer())
	.pipe(rename('style.css'))
	.pipe(sourcemaps.write('../maps'))
	.pipe(gulp.dest(prod.css))
	.pipe(browserSync.stream()); 
});

// **
// CSS: concat with vendor, minify, & move to production
// **

// JS: lint, concat/rename, & move to production
/// jshint skips files declared in .jshintignore
gulp.task('js', function(){
	return gulp.src([
		'./dev/js/vendor/jquery.min.js',
		'./dev/js/vendor/jquery.validate.js',
		'./dev/js/vendor/additional-methods.min.js',
		'./dev/js/script.js'])
	.pipe(changed(prod.js))
	.pipe(sourcemaps.init())
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'))
	.pipe(concat('script.js'))
	.pipe(sourcemaps.write())
	.pipe(uglify({ errLogToConsole: true }))
	.pipe(gulp.dest(prod.js))
	.pipe(size())
	.pipe(reload({stream: true}));
});

// SVG: run svg-sprite, currently outputs to developement
gulp.task('svg', function(){
return gulp.src(dev.svgBg)
	.pipe(svgSprite(svgConfig)).on('error', function(error){ console.log(error); })
	.pipe(gulp.dest(dev.svg));
	// move files from dev to prod
});

// **
// IMG: optimize jpg/gif/png & move to production
// **

