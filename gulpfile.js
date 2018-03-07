var fs = require("fs"),
    gulp = require("gulp"),
    clean = require("gulp-clean"),
    merge = require("event-stream").merge,
    sequence = require("run-sequence"),
    jshint = require("gulp-jshint"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
    mocha = require("gulp-mocha"),
    istanbul = require("gulp-istanbul"),
    webserver = require('gulp-webserver'),
    jsdoc = require("gulp-jsdoc3"),
    uglify = require("gulp-uglify"),
    buffer = require('vinyl-buffer'),
    rename = require('gulp-rename'),
    babel = require('babel-core/register');


gulp.task("clean", function () {
    return merge(
        gulp.src(["./dist/browser/kuroshiro.js", "./dist/browser/kuroshiro.min.js"])
            .pipe(clean())
    );
});


gulp.task("build", function () {
    if (!fs.existsSync("./dist")) {
        fs.mkdirSync("./dist");
    }
    if (!fs.existsSync("./dist/browser/")) {
        fs.mkdirSync("./dist/browser/");
    }

    var b = browserify({
        entries: ["./src/kuroshiro.js"],
        standalone: "kuroshiro" // window.kuroshiro
    });
    return b.bundle()
        .pipe(source("kuroshiro.js"))
        .pipe(buffer())
        .pipe(gulp.dest("./dist/browser/"));
});

gulp.task('compress', function() {
    return gulp.src("./dist/browser/*.js")
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest("./dist/browser"));
});

gulp.task("watch", function () {
    gulp.watch([ "./src/**/*.js", "./test/**/*.js" ], [ "lint", "build", "jsdoc" ]);
});


gulp.task("clean-dict", function () {
    gulp.src("./dist/dict/")
        .pipe(clean());
});


gulp.task("copy-dict", function () {
    if (!fs.existsSync("./dist")) {
        fs.mkdirSync("./dist");
    }
    gulp.src("./node_modules/kuromoji/dict/**")
        .pipe(gulp.dest("./dist/dict/"));
});


gulp.task("test", function () {
    return gulp.src("./test/**/*.js", { read: false })
        .pipe(mocha({ timeout: 30000, compilers: { js: babel }, require: ["babel-polyfill"], reporter: "list", exit: true }));
        //.on('error', console.error);
});

// gulp.task("test", function () {
//     return gulp.src("./test/**/*.js", { read: false })
//         .pipe(mocha({ timeout: 30000, reporter: "list", exit: true }))
//         .on('error', console.error);
// });

gulp.task("coverage", function (done) {
    gulp.src(["./src/**/*.js"])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on("finish", function () {
            gulp.src(["test/**/*.js"])
                .pipe(mocha({ timeout: 30000, reporter: "list" }))
                .pipe(istanbul.writeReports())
                .on("end", done);
        });
});


gulp.task("lint", function () {
    return gulp.src(["./src/**/*.js"])
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});


gulp.task("webserver", function() {
    gulp.src("./")
        .pipe(webserver({
            port: 8000,
            livereload: true,
            directoryListing: true
        }));
});


gulp.task("jsdoc", function () {
    gulp.src(["./src/**/*.js"])
        .pipe(jsdoc("./jsdoc"));
});


gulp.task("default", function () {
    sequence("lint", "clean", "build", "compress");
});
