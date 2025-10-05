const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer").default;
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");

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

function scripts(done) {
  src("src/js/**/*.js")
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(dest("dist/js"));

  done();
}

function watchFiles() {
  watch("src/*.html", html);
  watch("src/styles/**/*.scss", styles);
  watch("src/js/**/*.js", scripts);
}

exports.default = series(html, styles, scripts, watchFiles);
