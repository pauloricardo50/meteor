/* eslint-disable prettier */
/* eslint-disable */

const path = require('path');
const fs = require('fs');

const config = {
  // Where the lang directory is stored with the complete list of strings
  // for each language
  pathToLangDir: '../core',
  // An array of languages to look for
  languages: ['fr'],
  // The list of directories to scan and create language files for
  directories: [
    {
      id: 'app',
      path: '../microservices/app',
      exceptions: [
        'AdminFilesTab',
        'AmortizationChart',
        'ArrayInput',
        'BorrowerAddPartner',
        'BorrowerRemover',
        'ConditionsButton',
        'ConfirmMethod',
        'ContactButton',
        'FileAdder',
        'files',
        'FinancingStructures',
        'Forms',
        'Impersonation',
        'LoginPage',
        'Microlocation',
        'offer',
        'PropertyForm',
        'StatusIconTooltip',
        'steps',
        'Uploader',
        'Valuation',
        'Widget1',
      ],
    },
    {
      id: 'www',
      path: '../microservices/www',
      exceptions: ['Start2Form', 'Forms', 'offer', 'Widget1'],
    },
    {
      id: 'admin',
      path: '../microservices/admin',
      exceptions: [
        'AdminFilesTab',
        'ArrayInput',
        'collections',
        'ConditionsButton',
        'ConfirmMethod',
        'FileAdder',
        'files',
        'FinancingStructures',
        'Forms',
        'Impersonation',
        'LoginPage',
        'Microlocation',
        'offer',
        'OfferAdder',
        'PropertyForm',
        'StatusIconTooltip',
        'steps',
        'Table',
        'Uploader',
        'Valuation',
      ],
    },
  ],
  // List of strings that don't have a component file associated to them, so
  // this algorithm would miss them, provide the first part of those strings
  // here
  generalExceptions: [
    'e-Potek',
    'ExpensesChart',
    'ExpensesChartInterests',
    'File',
    'FileTabs',
    'Form',
    'general',
    'GoogleMap',
    'InterestsTable',
    'LayoutError',
    'LoanChecklist',
    'MissingDoc',
    'NotFound',
    'property',
    'Recap',
    'roles',
    'Search',
    'SearchResults',
    'Table',
    'tooltip',
    'tooltip2',
    'TooltipSynonyms',
    'TopNav',
    'TopNavDropdown',
    'UploaderArray',
  ],
};

const findFilesWithExtension = (startPath, extension) => {
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
};

const isKeyAllowed = allowedKeys => key => {
  return allowedKeys.some(allowedKey => key.startsWith(allowedKey));
};

// Given a lang/ directory and a specific language, get all the strings with
// keys provided in the allowedKeys array
const filterLanguageKeys = (pathToLangDir, language, allowedKeys) => {
  const langObject = JSON.parse(
    fs.readFileSync(createPathToLanguage(pathToLangDir, language), 'utf8'),
  );
  const langKeys = Object.keys(langObject);
  const remainingKeys = langKeys.filter(isKeyAllowed(allowedKeys));

  const optimizedLangObject = Object.keys(langObject)
    .filter(key => remainingKeys.includes(key))
    .reduce((obj, key) => Object.assign({ [key]: langObject[key] }, obj), {});

  return optimizedLangObject;
};

// Given a JSON object of language strings, write it to path
const writeLanguageToDirectory = (language, path) => {
  const json = JSON.stringify(language);
  ensureDirectoryExistence(path);
  fs.writeFileSync(path, json, 'utf8');
};

// Recursively create directories if they don't exist to the specified filePath
const ensureDirectoryExistence = filePath => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

const createPathToLanguage = (dir, language) =>
  dir + '/lang/' + language + '.json';

// Given a config object, create unique language files for each microservice
const createLanguages = ({
  directories,
  languages,
  generalExceptions,
  pathToLangDir,
}) => {
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
};

const getCustomConfig = () => {
  // Get the third argument from the command line, which should be an id of
  // one of the microservices
  const argument = process.argv[2];

  if (argument) {
    const possibleArguments = config.directories.map(
      directoryConfig => directoryConfig.id,
    );

    if (!possibleArguments.includes(argument)) {
      throw Error(
        'Invalid argument, it has to be one of these: ' +
          possibleArguments.join(' '),
      );
    }

    const customConfig = Object.assign({}, config, {
      directories: config.directories.filter(
        directoryConfig => directoryConfig.id === argument,
      ),
    });

    return customConfig;
  }

  return config;
};

createLanguages(getCustomConfig());
