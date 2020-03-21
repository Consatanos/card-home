import {
    src,
    dest,
    watch,
    series,
    parallel
} from 'gulp';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config';
import sass from 'gulp-sass';
import mincss from "gulp-clean-css";
import autoprefixer from 'gulp-autoprefixer';
import groupmedia from 'gulp-group-css-media-queries';
import image from 'gulp-image';
import svg from "gulp-svg-sprite";
import del from 'del';
import browsersync from 'browser-sync';

/**
 * clean docs directory
 */
const clean = () => {
    return del(["./docs/*"]);
};

/**
 * server and watch change files
 */
const serve = () => {
    browsersync.init({
        server: "./docs/",
        port: 4000,
        notify: true
    });
    watch([
        './src/html/*.html'
    ], parallel(html));
    watch([
        './src/js/*.js',
        './src/js/**/*.js'
    ], parallel(js));
    watch([
        './src/scss/main.{scss,sass}',
        './src/scss/**/*.{scss,sass}'
    ], parallel(scss));
    watch([
        './src/image/*.{jpg,png}',
        './src/image/**/*.{jpg,png}'
    ], parallel(images));
    watch([
        './src/svg/*.svg'
    ], parallel(sprite));
};

/**
 * html task
 */
const html = () => {
    return src('./src/html/*.html')
        .pipe(dest('./docs/'));
};

/**
 * js task
 */
const js = () => {
    return src('./src/js/*.js')
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(dest('./docs/'));
};

/**
 * style task with sass
 */
const scss = () => {
    return src('./src/scss/style.{scss,sass}')
        .pipe(sass())
        .pipe(groupmedia())
        .pipe(autoprefixer({
            grid: 'autoplace'
        }))
        .pipe(mincss())
        .pipe(dest('./docs/'));
};

/**
 * image task
 */
const images = () => {
    return src('./src/image/*.{jpg,png}')
        .pipe(image())
        .pipe(dest('./docs/image/'));
};

/**
 * svg task
 */
const sprite = () => {
    return src('./src/svg/*.svg')
        .pipe(svg({
            shape: {
                dest: "svg"
            },
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(dest('./docs/image'));
};

const development = series(
    clean,
    html,
    scss,
    js,
    images,
    sprite,
    parallel(serve)
);

exports.default = development;