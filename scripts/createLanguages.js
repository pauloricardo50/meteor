/* eslint-disable prettier */
/* eslint-disable */

const path = require('path');
const fs = require('fs');

function findFilesWithExtension(startPath, extension) {
  let results = [];

  if (!fs.existsSync(startPath)) {
    console.log('no dir ', startPath);
    return results;
  }

  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);

    if (stat.isDirectory()) {
      const recursedResult = findFilesWithExtension(filename, extension); //recurse
      results = [...results, ...recursedResult];
    } else if (filename.indexOf(extension) >= 0) {
      const fileWithExtension = filename.replace(/^.*[\\\/]/, '');
      results.push(fileWithExtension.split('.')[0]);
    }
  }

  return results;
}

function filterLanguageKeys(pathToLangDir, language, allowedKeys) {
  const langObject = JSON.parse(fs.readFileSync(createPathToLanguage(pathToLangDir, language), 'utf8'));
  const langKeys = Object.keys(langObject);
  const remainingKeys = langKeys.filter(key => allowedKeys.indexOf(key.split('.')[0]) >= 0,);

  const optimizedLangObject = Object.keys(langObject)
    .filter(key => remainingKeys.includes(key))
    .reduce((obj, key) => Object.assign({ [key]: langObject[key] }, obj), {});

  return optimizedLangObject;
}

function writeLanguageToDirectory(language, path) {
  const json = JSON.stringify(language);
  ensureDirectoryExistence(path);
  fs.writeFileSync(path, json, 'utf8');
}

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function createPathToLanguage(dir, language) {
  return dir + '/lang/' + language + '.json';
}

function run({ directories, languages, exceptions, pathToLangDir }) {
  console.log('Starting language building process...');

  directories.forEach(directory => {
    const componentNames = findFilesWithExtension(directory, '.jsx');

    languages.forEach(language => {
      console.log('Creating ' + language + ' file for ' + directory);
      const languageObject = filterLanguageKeys(pathToLangDir, language, [
        ...exceptions,
        ...componentNames,
      ]);
      const path = createPathToLanguage(directory, language);

      writeLanguageToDirectory(languageObject, path);
    });
  });
}

const config = {
  pathToLangDir: '../core',
  languages: ['fr', 'en'],
  directories: ['../sApp', '../sWww', '../sAdmin', '../sLender'],
  exceptions: [
    'TopNav',
    'TopNavDropdown',
    'Recap',
    'general',
    'tooltip',
    'tooltip2',
    'ExpensesChartInterests',
    'ExpensesChart',
    'Search',
  ],
};

run(config);
