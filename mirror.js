const path = require('path');
const fse = require('fs-extra');
const glob = require('glob');
const { minify } = require('html-minifier-terser');
const postcss = require('postcss');
const cssnano = require('cssnano');
const terser = require('terser');

const dist = path.resolve(__dirname, './dist');
fse.ensureDirSync(dist);
fse.emptyDirSync(dist);

const files = [
  path.resolve(__dirname, './audio'),
  path.resolve(__dirname, './css'),
  path.resolve(__dirname, './img'),
  path.resolve(__dirname, './lang'),
  path.resolve(__dirname, './lib'),
  path.resolve(__dirname, './script'),
  path.resolve(__dirname, './browserWarning.html'),
  path.resolve(__dirname, './favicon.ico'),
  path.resolve(__dirname, './index.html'),
  path.resolve(__dirname, './mobileWarning.html'),
];

files.forEach((file) => {
  fse.copySync(file, path.resolve(dist, path.basename(file)));
});

// delete po files
const pofiles = glob.sync('dist/**/*.po', { cwd: __dirname });
pofiles.forEach((file) => {
  fse.removeSync(path.resolve(__dirname, file));
});

// minify html
const htmlfiles = glob.sync('dist/**/*.html', { cwd: __dirname });
htmlfiles.forEach(async (file) => {
  const html = fse.readFileSync(path.resolve(__dirname, file), 'utf8');
  const result = await minify(html, {
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
  });
  fse.writeFileSync(path.resolve(__dirname, file), result);
});

// minify json
const jsonfiles = glob.sync('dist/**/*.json', { cwd: __dirname });
jsonfiles.forEach((file) => {
  const json = fse.readFileSync(path.resolve(__dirname, file), 'utf8');
  const result = JSON.stringify(JSON.parse(json));
  fse.writeFileSync(path.resolve(__dirname, file), result);
});

// minify css
const cssfiles = glob.sync('dist/**/*.css', { cwd: __dirname });
cssfiles.forEach(async (file) => {
  const css = fse.readFileSync(path.resolve(__dirname, file), 'utf8');
  const result = await postcss([cssnano]).process(css, { from: undefined });
  fse.writeFileSync(path.resolve(__dirname, file), result.css);
});

// minify js
const jsfiles = glob.sync('dist/**/*.js', { cwd: __dirname });
jsfiles.forEach(async (file) => {
  const js = fse.readFileSync(path.resolve(__dirname, file), 'utf8');
  const result = await terser.minify(js);
  fse.writeFileSync(path.resolve(__dirname, file), result.code);
});
