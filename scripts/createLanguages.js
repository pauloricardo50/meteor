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
  const langObject = JSON.parse(
    fs.readFileSync(createPathToLanguage(pathToLangDir, language), 'utf8'),
  );
  const langKeys = Object.keys(langObject);
  const remainingKeys = langKeys.filter(
    key => allowedKeys.indexOf(key.split('.')[0]) >= 0,
  );

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

function run({ directories, languages, generalExceptions, pathToLangDir }) {
  console.log('Starting language building process...');

  directories.forEach(({ path: dirPath, exceptions: dirExceptions }) => {
    const componentNames = findFilesWithExtension(dirPath, '.jsx');

    languages.forEach(language => {
      console.log('Creating ' + language + ' file for ' + dirPath);
      const languageObject = filterLanguageKeys(pathToLangDir, language, [
        ...generalExceptions,
        ...dirExceptions,
        ...componentNames,
      ]);
      const pathToLanguage = createPathToLanguage(dirPath, language);

      writeLanguageToDirectory(languageObject, pathToLanguage);
    });
  });
}

const config = {
  pathToLangDir: '../core',
  languages: ['fr', 'en'],
  directories: [
    {
      path: '../microservices/app',
      exceptions: [
        'steps',
        'ProjectBarChart',
        'LoginPage',
        'Forms',
        'files',
        'offer',
      ],
    },
    { path: '../microservices/www', exceptions: ['Start2Form'] },
    { path: '../microservices/admin', exceptions: ['LoginPage'] },
    { path: '../microservices/lender', exceptions: ['LoginPage'] },
    {
      path: '../microservices/admin-temp',
      exceptions: [
        'steps',
        'ProjectBarChart',
        'LoginPage',
        'Forms',
        'files',
        'offer',
      ],
    },
  ],
  generalExceptions: [
    'TopNav',
    'TopNavDropdown',
    'Recap',
    'general',
    'tooltip',
    'tooltip2',
    'ExpensesChartInterests',
    'ExpensesChart',
    'Search',
    'e-Potek',
    'NotFound',
    'LayoutError',
  ],
};

run(config);
