var gulp         = require('gulp'),
    livereload   = require('gulp-livereload'),
    browserSync  = require('browser-sync').create(),
    reload       = browserSync.reload;


var projectNum = '9002' ; 

// 静态服务器
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./" + projectNum
        },
        port: 8080,
        notify: false, //刷新是否提示
        open: false //是否自动打开页面
    });
});
gulp.task('default',function(){
    gulp.run('browser-sync');
    gulp.watch(['./'+projectNum+'/**'], function(){
        gulp.src(['./'+projectNum+'/*.html']).pipe(reload({stream: true}));
    });
})