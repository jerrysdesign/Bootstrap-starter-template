
var gulp      = require('gulp'), 
    slim      = require('gulp-slim'),
    sass      = require('gulp-ruby-sass') ,
    notify    = require("gulp-notify") ,
    bower     = require('gulp-bower'),
    webserver = require('gulp-webserver'),
    connect   = require('gulp-connect');

// Ignore everything that begins with underscore
var hidden_files = '**/_*.*';
var ignored_files = '!'+hidden_files;

// Sources config
var source = {
  resource : './resources',
  slimPath : './resources/slim',
  sassPath : './resources/sass',
  bowerDir : './bower_components' 
}

var config = {
  templates: {
    main: [source.slimPath + '/index.slim'],
    file: [source.slimPath + '/*.slim'],
    watch: [source.slimPath + '/*.slim']
  },
  styles: {
    main: [source.sassPath + '/style.scss'],
    file: [source.sassPath + '/*.scss'],
    watch: [source.sassPath + '/*.scss']
  },
  dest: {
    templates: './public',
    styles: './public/css'
  },
  server: './public'
}

var buide = {
  templates: config.templates.file,
  styles: config.styles.main
}

gulp.task('bower', function() { 
  return bower()
    .pipe(gulp.dest(source.bowerDir)) 
});

gulp.task('icons', function() { 
  return gulp.src(source.bowerDir + '/fontawesome/fonts/**.*') 
    .pipe(gulp.dest('./public/fonts')); 
});

gulp.task('templates', function() {
  gulp.src(config.templates.file)
    .pipe(slim({
      pretty: true
    }))
    .pipe(gulp.dest(config.dest.templates))
});

gulp.task('css', function() { 
  return gulp.src(config.styles.main)
    .pipe(sass({
      style: 'compact',
      loadPath: [
        source.sassPath,
        source.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
        source.bowerDir + '/fontawesome/scss'
        ]
     }) 
    .on("error", notify.onError(function (error) {
      return "Error: " + error.message;
    }))) 
    .pipe(gulp.dest(config.dest.styles))
    .pipe(connect.reload()); 
});

gulp.task('webserver', function() {
  gulp.src(config.server)
    .pipe(webserver({
      host: 'localhost',
      port: '5000',
      livereload: true,
      directoryListing: false
  }));
});

// Rerun the task when a file changes
 gulp.task('watch', function() {
  gulp.watch(config.styles.watch, ['css']); 
  gulp.watch(config.templates.watch, ['templates']); 
});

var tasks = [
  'bower',
  'icons',
  'templates',
  'css',
  'webserver',
  'watch'
];

gulp.task('default', tasks);
