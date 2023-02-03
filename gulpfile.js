import pkj from 'gulp';
const { src, dest, watch, series } = pkj;
import nunjucksRender from 'gulp-nunjucks-render';
import less from 'gulp-less';
import image from 'gulp-image';
import browsersync from 'browser-sync';

function htmlTask() {
  return src('src/pages/**/*.html')
    .pipe(nunjucksRender({
      path: 'src/',
    })
  )
    .pipe(dest('dist'));
}

function cssTask() {
  return src('src/styles/styles.less', { sourcemaps: true })
      .pipe(less())
      .pipe(dest('dist/styles', { sourcemaps: '.' }));
}

function imagesTask() {
  return src('src/images/*.{jpg,png,svg,gif,ico,webp}')
  .pipe(image())
  .pipe(dest('dist/images'));
}

function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: './dist',
    }    
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

function watchTask(){
  watch('src/**/*.html', series(htmlTask, browsersyncReload));
  watch('src/images/*.{jpg,png,svg,gif,ico,webp}', series(imagesTask, browsersyncReload));
  watch('src/styles/*.{less, css}', series(cssTask, browsersyncReload));
}

export default series(
  htmlTask,
  cssTask,
  imagesTask,
  browsersyncServe,
  watchTask
);
