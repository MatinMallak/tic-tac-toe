const { src, dest, watch } = require("gulp");

function html() {
  src("src/*.html").pipe(dest("dist"));
}

function watchFiles() {
  watch("src/*.html", html);
}

exports.default = watchFiles;
