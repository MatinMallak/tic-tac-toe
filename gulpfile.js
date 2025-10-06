const { src, dest, watch, series, parallel, task } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer").default;
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const browserSync = require("browser-sync").create();

const paths = {
  statics: {
    src: ["src/*.html", "src/assets/fonts/**/*"],
    dist: "dist",
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

function statics(done) {
  src(paths.statics.src, { base: "src/" })
    .pipe(dest(paths.statics.dist))
    .pipe(browserSync.stream());

  done();
}

function styles(done) {
  src(paths.styles.src)
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
  watch(paths.statics.src, statics);
  watch(paths.styles.src, styles);
  watch(paths.scripts.src, scripts);
}

exports.default = series(
  parallel(statics, styles, scripts),
  parallel(serve, watchFiles)
);
