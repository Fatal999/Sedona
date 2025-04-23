import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
// import squoosh from 'gulp-libsquoosh';
import svgstore from 'gulp-svgstore';
import svgo from 'gulp-svgo';
import rename from 'gulp-rename';
import { deleteAsync } from 'del';


// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}

// Scripts

const script = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'));
}

//Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  // .pipe (squoosh())
  .pipe(gulp.dest('build/img'));
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'));
}

//WebP

const createWebP = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  // .pipe (squoosh({
  //   webp: {}
  // }))
  .pipe(gulp.dest('build/img'));
}

//SVG

const SVG = () => {
  return gulp.src('source/img/**/*.svg')
  .pipe (svgo())
  .pipe(gulp.dest('build/img'));
}

const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
  .pipe(svgo({
    plugins: [
        {
            removeViewBox: false,
        },
        'sortAttrs',
    ],
}))
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
}

//Copy

const copy = (done) => {
  return gulp.src(['source/fonts/*.{woff2,woff}',
                   'source/*.ico'
], {
  base: 'source'
})
  .pipe(gulp.dest('build'))
  done();
}

//Clean

const clean = () => {
  return deleteAsync ('build');
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

//Reload

export const reload = (done) => {
  browser.reload ();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

//Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
  styles,
  html,
  script,
  SVG,
  sprite,
  createWebP
  ),
);

//Default

export default gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
  styles,
  html,
  script,
  SVG,
  sprite,
  createWebP
  ),
  gulp.series(
    server,
    watcher
  )
);
