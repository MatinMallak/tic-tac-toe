import { src, dest, watch, series, parallel } from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import cleanCss from "gulp-clean-css";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import uglify from "gulp-uglify";
import browserSyncLib from "browser-sync";
import ttf2woff2 from "gulp-ttf2woff2";

const browserSync = browserSyncLib.create();
const sass = gulpSass(dartSass);

const paths = {
  html: {
    src: "src/*.html",
    dist: "dist",
  },
  fonts: {
    src: "src/assets/fonts/*.ttf",
    dist: "dist/assets/fonts",
  },
  styles: {
    src: "src/styles/**/*.scss",
    dist: "dist/css",
  },
  scripts: {
    src: "src/js/**/*.js",
    dist: "dist/js",
  },
};

function html(done) {
  src(paths.html.src).pipe(dest(paths.html.dist)).pipe(browserSync.stream());

  done();
}

function fonts(done) {
  src(paths.fonts.src, { encoding: false })
    .pipe(dest(paths.fonts.dist))
    .pipe(ttf2woff2())
    .pipe(dest(paths.fonts.dist));

  done();
}

function styles(done) {
  src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass(dartSass).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write("./"))
    .pipe(dest(paths.styles.dist))
    .pipe(browserSync.stream());

  done();
}

function scripts(done) {
  src(paths.scripts.src)
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream());

  done();
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
    port: 4000,
  });
}

function watchFiles() {
  watch(paths.html.src, html);
  watch(paths.fonts.src, fonts);
  watch(paths.styles.src, styles);
  watch(paths.scripts.src, scripts);
}

const build = parallel(html, fonts, styles, scripts);

export default series(build, parallel(serve, watchFiles));
