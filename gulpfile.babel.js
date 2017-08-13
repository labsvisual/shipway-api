/**
 * File: gulpfile.babel.js
 * Description: The buildfile for all the API modules. This build-file transpiles
 * the API to two versions: ES5 and ES6 with their respective minified versions.
 */

import gulp from 'gulp';

import concat from 'gulp-concat';
import sourcemap from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import watch from 'gulp-watch';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import uglifyES6 from 'gulp-uglify-es';

gulp.task( 'es5:transpile', () => {

    gulp.src( [ './lib/**/shipway.js' ] )
        .pipe( plumber() )
        .pipe( babel( {
            presets: [ 'es2015' ]
        } ) )
        .pipe( rename( 'shipway.es5.js' ) )
        .pipe( gulp.dest( './lib' ) );

} );

gulp.task( 'es5:minify', [ 'es5:transpile' ] ,() => {

    gulp.src( [ './dist/shipway.es5.js' ] )
        .pipe( plumber() )
        .pipe( sourcemap.init() )
        .pipe( uglify() )
        .pipe( sourcemap.write( './' ) )
        .pipe( gulp.dest( './dist' ) );

} );

gulp.task( 'es6:clean', () => {

    gulp.src( './src/**/*.js' )
        .pipe( plumber() )
        .pipe( concat( 'shipway.es6.js' ) )
        .pipe( sourcemap.init() )
        .pipe( uglifyES6( {

            compress: false,
            mangle: false

        } ) )
        .pipe( sourcemap.write() )
        .pipe( gulp.dest( './dist' ) );

} );

gulp.task( 'es6:minify', [ 'es6:clean' ] ,() => {

    gulp.src( './dist/shipway.es6.js' )
        .pipe( plumber() )
        .pipe( concat( 'shipway.es6.min.js' ) )
        .pipe( sourcemap.init() )
        .pipe( uglifyES6() )
        .pipe( sourcemap.write( './' ) )
        .pipe( gulp.dest( './dist' ) );

} );

gulp.task( 'default', [ 'es5:transpile', 'es5:minify', 'es6:clean', 'es6:minify' ] );

gulp.task( 'watch', () => {

    gulp.watch( './lib/**/*.js', [ 'es5:transpile' ] );

} );