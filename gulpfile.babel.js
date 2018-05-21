import gulp from "gulp";
import clean from "gulp-clean";
import { merge } from "event-stream"
import sequence from "run-sequence";
import jshint from "gulp-jshint";
import mocha from "gulp-mocha";
import istanbul from "gulp-istanbul";
import webserver from "gulp-webserver";
import jsdoc from "gulp-jsdoc3";
import babel from "rollup-plugin-babel";
import { rollup } from "rollup";
import { uglify } from 'rollup-plugin-uglify';

import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";

gulp.task("lint", () => {
    return gulp.src(["./src/**/*.js"])
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

gulp.task("clean", () => {
    return merge(
        gulp.src(["./kuroshiro.js", "./kuroshiro.js.map"])
            .pipe(clean())
    );
});

gulp.task("build-dev", () => {
    return rollup({
        input: './src/index.js',
        plugins: [
            babel(babelrc())
        ]
    })
        .then(bundle => {
            return bundle.write({
                file: './kuroshiro.js',
                format: 'umd',
                name: 'kuroshiro',
                sourcemap: true
            });
        })
});

gulp.task("build", () => {
    return rollup({
        input: './src/index.js',
        plugins: [
            babel({
                exclude: 'node_modules/**',
                babelrc: false,
                presets: [
                    ["env",
                        {
                            "targets": {
                                "node": "6",
                                "browsers": [
                                    ">0.25%",
                                    "not ie 11",
                                    "not op_mini all"
                                ]
                            },
                            "modules": false
                        }
                    ]
                ],
                plugins: [
                    'external-helpers', 
                    ["transform-runtime", {
                        "helpers": false,
                        "polyfill": false,
                        "regenerator": true,
                        "moduleName": "babel-runtime"
                    }]
                ]
            }),
            uglify()
        ]
    })
        .then(bundle => {
            return bundle.write({
                file: './kuroshiro.js',
                format: 'cjs',
                name: 'Kuroshiro',
                sourcemap: true
            });
        })
});

gulp.task("test", () => {
    return gulp.src("./test/**/*.js", { read: false })
        .pipe(mocha({ timeout: 30000, reporter: "list", exit: true }))
        .on('error', console.error);
});

gulp.task("coverage", (done) => {
    gulp.src(["./kuroshiro.js"])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on("finish", function () {
            gulp.src(["test/**/*.js"])
                .pipe(mocha({ timeout: 30000, reporter: "list" }))
                .pipe(istanbul.writeReports())
                .on("end", done);
        });
});

gulp.task("webserver", () => {
    gulp.src("./")
        .pipe(webserver({
            port: 8000,
            livereload: true,
            directoryListing: true
        }));
});

gulp.task("jsdoc", (done) => {
    let jsdocConfig = {
        "tags": {
            "allowUnknownTags": true
        },
        "opts": {
            "destination": "./docs/",
            "encoding": "utf8",
            "recurse": true
        },
        "plugins": [
            "plugins/markdown"
        ],
        "templates": {
            "cleverLinks": false,
            "monospaceLinks": false,
            "default": {
                "outputSourceFiles": true
            },
            "path": "ink-docstrap",
            "theme": "cerulean",
            "navType": "vertical",
            "linenums": true,
            "dateFormat": "MMMM Do YYYY, h:mm:ss a"
        }
    };
    gulp.src(["./src/**/*.js"], { read: false })
        .pipe(jsdoc(jsdocConfig, done));
});

gulp.task("watch", () => {
    gulp.watch(["./src/**/*.js", "./test/**/*.js"], ["lint", "build", "jsdoc"]);
});

gulp.task("default", () => {
    sequence("lint", "clean", "build", "test");
});