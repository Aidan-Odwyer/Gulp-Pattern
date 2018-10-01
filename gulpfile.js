var gulp 		 = require('gulp'),
	sass 		 = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat		 = require('gulp-concat'),
	uglify		 = require('gulp-uglifyjs'),
	cssnano		 = require('gulp-cssnano'),
	rename 		 = require('gulp-rename'),
	del 		 = require('del'),
	imagemin	 = require('gulp-imagemin'),
	pngquant	 = require('imagemin-pngquant'),
	cache 		 = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer');

gulp.task('clean', function() {
	return del.sync('public');
});

gulp.task('clear', function() {
	return cache.clearAll();
});

gulp.task('sass', function() {
	return gulp.src('src/sass/**/*.sass')
		.pipe(sass())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
	return gulp.src([
		'src/libs/jquery/public/jquery.min.js'
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify(''))
	.pipe(gulp.dest('src/js'));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'src'
		},
		notify: false
	});
});

gulp.task('img', function() {
	return gulp.src('src/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('public/img'));
});

gulp.task('watch', ['browser-sync', 'scripts'], function() {
	gulp.watch('src/sass/**/*.sass', ['sass']);
	gulp.watch('src/*.html', browserSync.reload);
	gulp.watch('src/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {
	var buildCss = gulp.src([
		'src/css/style.css'
		])
	.pipe(gulp.dest('public/css'));

	var buildFonts = gulp.src('src/fonts/**/*')
	.pipe(gulp.dest('public/fonts'));

	var buildJs = gulp.src('src/js/**/*')
	.pipe(gulp.dest('public/js'));

	var buildHtml = gulp.src('src/*.html')
	.pipe(gulp.dest('public'));
});

gulp.task('default', ['watch']);