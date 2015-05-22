var gulp = require('gulp'), 
	less = require('gulp-less') ,
	notify = require("gulp-notify") ,
	bower = require('gulp-bower'),
	webserver = require('gulp-webserver'),
	connect = require('gulp-connect');


var config = {
	lessPath: './resources/less',
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

gulp.task('css', function() { 
	return gulp.src(config.lessPath + '/style.less')
		.pipe(less({
			paths: [
				'./resources/less',
				config.bowerDir + '/bootstrap/less',
				config.bowerDir + '/fontawesome/less'
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
	gulp.watch(config.lessPath + '/*.less', ['css']); 
});

gulp.task('default', ['bower', 'icons', 'css', 'webserver', 'watch']);