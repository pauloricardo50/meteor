/* eslint-disable no-console */
/*
  Finds strings used in each app

  Usage: node extract.js path/to/app1 path/to/app2

  Writes a file for each app in the current directory (appName.json)
  with the strings in the app, and combined.json with the combined
  results
*/
const { resolve: resolvePath, basename } = require('path');
const crypto = require('crypto');
const { writeFileSync } = require('fs');
const {
  findTImport,
  getId,
  findTComponents,
  getAttrValue,
  createTPaths,
} = require('./find-strings');
const walkApp = require('.');

let result = {};

module.exports = function (filePath, ast, imports, appDir) {
  const tPaths = createTPaths(appDir);
  const tName = findTImport(filePath, imports, tPaths);

  const components = findTComponents(ast, tName);
  components.forEach(component => {
    let id = getId(component);
    const defaultMessage = getAttrValue('defaultMessage');
    const description = getAttrValue('description');

    if (id instanceof RegExp) {
      return;
    }

    if (!id) {
      const hash = crypto
        .createHash('MD5')
        .update(JSON.stringify({ defaultMessage, description }))
        .digest('hex');
      id = hash;
    }
    result[id] = {
      defaultMessage,
      description,
      id,
    };
  });
};

const archList = ['client'];
const startTime = new Date();
let count = 0;
const appDirs = process.argv.slice(2);
let combined = {};

for (let i = 0; i < appDirs.length; i += 1) {
  const appDir = resolvePath(process.cwd(), appDirs[i]);
  const appName = basename(appDir);
  const appStart = new Date();
  let appCount = 0;

  // eslint-disable-next-line no-loop-func
  walkApp(appDir, archList, ({ path, imports, ast }) => {
    module.exports(path, ast, imports, appDir);
    appCount += 1;
  });

  combined = Object.assign(combined, result);
  const appEnd = new Date();

  console.log('');
  console.log('App:      ', appName);
  console.log('Spent:    ', `${appEnd.getTime() - appStart.getTime()}ms`);
  console.log('Files:    ', count);
  console.log('Extracted:', Object.keys(result).length, 'strings');

  writeFileSync(`./${appName}.json`, JSON.stringify(result, null, 2));
  console.log(`Wrote ./${appName}.json`);
  console.log('');

  count += appCount;
  result = {};
}

const endTime = new Date();
console.log('');
console.log('-Combined-');
console.log('Spent:    ', `${endTime.getTime() - startTime.getTime()}ms`);
console.log('Files:    ', count);
console.log('Extracted:', Object.keys(combined).length, 'strings');
console.log('');

writeFileSync('./combined.json', JSON.stringify(combined, null, 2));
console.log('Wrote ./combined.json');
