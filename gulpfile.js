const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer").default;
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");

function html(done) {
  src("src/*.html").pipe(dest("dist"));

  done();
}

function styles(done) {
  src("src/styles/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write("./"))
    .pipe(dest("dist/css"));

  done();
}

function watchFiles() {
  watch("src/*.html", html);
  watch("src/styles/**/*.scss", styles);
}

exports.default = series(html, styles, watchFiles);
