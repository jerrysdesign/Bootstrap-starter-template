var gulp = require('gulp'), 
	slim = require('gulp-slim'),
	sass = require('gulp-ruby-sass') ,
	notify = require("gulp-notify") ,
	bower = require('gulp-bower'),
	webserver = require('gulp-webserver'),
	connect = require('gulp-connect');

var config = {
	slimPath: './resources/slim',
	sassPath: './resources/sass',
	bowerDir: './bower_components' 
}

gulp.task('bower', function() { 
	return bower()
		.pipe(gulp.dest(config.bowerDir)) 
});

gulp.task('icons', function() { 
	return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*') 
		.pipe(gulp.dest('./public/fonts')); 
});

gulp.task('slim', function(){
	gulp.src(config.slimPath + '/*.slim')
		.pipe(slim({
			pretty: true
		}))
		.pipe(gulp.dest("./public"));
});

gulp.task('css', function() { 
	return gulp.src(config.sassPath + '/style.scss')
		.pipe(sass({
			style: 'compressed',
			loadPath: [
				'./resources/sass',
				config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
				config.bowerDir + '/fontawesome/scss',
			]
		 }) 
			.on("error", notify.onError(function (error) {
				return "Error: " + error.message;
			}))) 
		.pipe(gulp.dest('./public/css'))
		.pipe(connect.reload()); 
});

gulp.task('webserver', function() {
	gulp.src('./public')
		.pipe(webserver({
			host: 'localhost',
			port: '5000',
			livereload: true,
			directoryListing: false
	}));
});
// Rerun the task when a file changes
 gulp.task('watch', function() {
	gulp.watch(config.sassPath + '/*.scss', ['css']); 
});

gulp.task('default', ['bower', 'icons', 'slim', 'css', 'webserver', 'watch']);
