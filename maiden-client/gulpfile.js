const BrowserSync = require("browser-sync");
const child       = require("child_process");
const clean       = require("gulp-clean");
const gulp        = require("gulp");
const htmlmin     = require("gulp-htmlmin");
const hugobin     = require("hugo-bin");
const minCSS      = require("gulp-clean-css");
const postcss     = require("gulp-postcss");
const rename      = require("gulp-rename");
const uglify      = require("gulp-uglify");
const sass        = require("gulp-sass");
const zip         = require("gulp-zip");

const browserSync = BrowserSync.create();

// Default Hugo arguments.

const defaultHugoArgs = ["-d", "../dist", "-s", "site", "-v"];

// Development build.

gulp.task("hugo", (cb) => { buildSite(cb); });

// Production tasks.

gulp.task("build", ["sass", "js", "fonts", "images"], (cb) => buildSite(cb, [], "production"));
gulp.task("build-clean", ["clean"], () => gulp.start("build"));
// gulp.task("dist", ["build-clean"], () => {
//   return gulp.src("dist/*")
//         .pipe(zip("dist.zip"))
//         .pipe(gulp.dest("dist"))
// });

// Run development server.

gulp.task("server", ["hugo", "sass", "js", "fonts", "images"], (cb) => runServer(cb));

// Compile Sass to CSS and minify.

gulp.task("sass", () => {
  return gulp.src("src/sass/style.sass")
  .pipe(sass())
  .pipe(minCSS())
  .pipe(rename({ suffix: ".min" }))
  .pipe(gulp.dest("dist/css"))
  .pipe(browserSync.stream());
});

// Minify JS and copy to /dist.

gulp.task("js", () => {

  // Don't re-minify minified files...

  gulp.src(["src/js/**/*", "!src/js/main.js", "!src/js/hero-background.js"])
  .pipe(gulp.dest("dist/js"))
  .pipe(browserSync.stream());

  // ...only these ones.

  return gulp.src(["src/js/main.js", "src/js/hero-background.js"])
  .pipe(uglify())
  .on("error", function(error) { console.log(error.toString()); })
  .pipe(rename({ suffix: ".min" }))
  .pipe(gulp.dest("dist/js"));
});

// Copy fonts to /dist.

gulp.task("fonts", () => {
  return gulp.src("src/fonts/**/*") // TODO: flatten
  .pipe(gulp.dest("dist/fonts"))
  .pipe(browserSync.stream());
});

// Copy images to /dist.

gulp.task("images", () => {
  return gulp.src("src/images/**/*") // TODO: minify images
  .pipe(gulp.dest("dist/images"))
  .pipe(browserSync.stream());
});

gulp.task("html", ["clean-hugo"], function() {
  return gulp.src("dist/*.html")
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest("dist"))
  .pipe(browserSync.stream());
});

gulp.task("clean", function () {
  return gulp.src("dist", {read: false})
  .pipe(clean());
});

gulp.task("clean-hugo", function () {
  return gulp.src([
    "dist/categories/**",
    "dist/tags/**",
    "dist/index.xml",
    "dist/sitemap.xml",
    "dist/.keep"
    ], {read: false, force: true})
  .pipe(clean());
});

function runServer() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch("src/js/**/*.js", ["js"]);
  gulp.watch("src/sass/**/*.sass", ["sass"]);
  gulp.watch("src/fonts/**/*", ["fonts"]);
  gulp.watch("src/images/**/*", ["images"]);
  gulp.watch("site/**/*", ["hugo"]);
}

function buildSite(cb, options, environment="development") {
  const args = options ? defaultHugoArgs.concat(options) : defaultHugoArgs;

  process.env.NODE_ENV = environment;

  return child.spawn(hugobin, args, {stdio: "inherit"}).on("close", (status) => {
    if (status === 0) {

      // Minify HTML after successful Hugo build.

      gulp.start("html"); // gulp.start() will be deprecated someday

      cb();

    } else {
      browserSync.notify("Hugo build failed.");
      cb("Hugo build failed.");
    }
  });
}