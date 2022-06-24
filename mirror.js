const path = require('path');
const fse = require('fs-extra');

const dist = path.resolve(__dirname, './dist');
fse.ensureDirSync(dist);
fse.emptyDirSync(dist);

const files = [
  path.resolve(__dirname, './audio'),
  path.resolve(__dirname, './css'),
  path.resolve(__dirname, './doc'),
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
