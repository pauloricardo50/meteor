var path = require('path');
var fs = require('fs');

function findFilesWithExtension(startPath, extension) {
  if (!fs.existsSync(startPath)) {
    console.log('no dir ', startPath);
    return;
  }

  var results = [];

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);

    if (stat.isDirectory()) {
      var recursedResult = findFilesWithExtension(filename, extension); //recurse
      results = [...results, ...recursedResult];
    } else if (filename.indexOf(extension) >= 0) {
      var fileWithExtension = filename.replace(/^.*[\\\/]/, '');
      results.push(fileWithExtension.split('.')[0]);
    }
  }

  return results;
}

function filterLanguageKeys(language, allowedKeys) {
  var langObject = JSON.parse(fs.readFileSync('../lang/' + language + '.json', 'utf8'));
  var langKeys = Object.keys(langObject);
  var remainingKeys = langKeys.filter(key => allowedKeys.indexOf(key.split('.')[0]) >= 0);

  var optimizedLangObject = Object.keys(langObject)
    .filter(key => remainingKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = langObject[key];
      return obj;
    }, {});

  return optimizedLangObject;
}

function writeLanguageToDirectory(language, path) {
  var json = JSON.stringify(language);
  ensureDirectoryExistence(path);
  fs.writeFileSync(path, json, 'utf8');
}

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function createPathToLanguage(dir, language) {
  return dir + '/lang/' + language + '.json';
}

function run({ directories, languages }) {
  console.log('Starting language building process...');

  directories.forEach(directory => {
    const componentNames = findFilesWithExtension(directory, '.jsx');

    languages.forEach(language => {
      console.log('Creating ' + language + ' file for ' + directory);
      const languageObject = filterLanguageKeys(language, componentNames);
      const path = createPathToLanguage(directory, language);

      writeLanguageToDirectory(languageObject, path);
    });
  });
}

const config = {
  languages: ['fr', 'en'],
  directories: ['../sApp', '../sWww', '../sAdmin', '../sLender'],
};

run(config);
