/* eslint-disable prettier */
/* eslint-disable */

const path = require('path');
const fs = require('fs');

const config = {
  // Where the lang directory is stored with the complete list of strings
  // for each language
  pathToLangDir: __dirname + '/../core',
  // An array of languages to look for
  languages: ['fr'],
  // The list of directories to scan and create language files for
  directories: [
    {
      id: 'admin',
      path: __dirname + '/../microservices/admin',
      exceptions: [
        'AccountPage',
        'AdminFilesTab',
        'AdminPromotionPage',
        'ArrayInput',
        'AutoForm',
        'BorrowerRemover',
        'BorrowerReuser',
        'collections',
        'CommissionRatesViewer',
        'ConditionsButton',
        'ConfirmMethod',
        'Contacts',
        'EmailVerification',
        'Feedback',
        'FileAdder',
        'files',
        'Financing',
        'Forms',
        'Impersonation',
        'InterestRates',
        'InterestsChart',
        'InterestsTable',
        'Irs10y',
        'Lenders',
        'LoginPage',
        'MaxPropertyValue',
        'methods',
        'Microlocation',
        'MortgageNotesForm',
        'offer',
        'OfferAdder',
        'PasswordChange',
        'PDF',
        'ProCustomersTable',
        'Promotion',
        'PromotionLotPage',
        'ProOrganisationUserAdder',
        'PropertyForm',
        'RevenuesByStatus',
        'StatusIconTooltip',
        'steps',
        'Table',
        'Uploader',
      ],
    },
    {
      id: 'app',
      path: __dirname + '/../microservices/app',
      exceptions: [
        'AccountPage',
        'AdminFilesTab',
        'AmortizationChart',
        'ArrayInput',
        'AutoForm',
        'BorrowerAddPartner',
        'BorrowerRemover',
        'BorrowerReuser',
        'BorrowersPage',
        'collections',
        'ConditionsButton',
        'ConfirmMethod',
        'ContactButton',
        'EmailVerification',
        'FileAdder',
        'files',
        'Financing',
        'Forms',
        'Impersonation',
        'ImpersonateNotification',
        'LoginPage',
        'MaxPropertyValue',
        'Microlocation',
        'MortgageNotesForm',
        'offer',
        'PasswordChange',
        'PasswordResetPage',
        'Promotion',
        'PropertyForm',
        'SimpleDashboardPage',
        'StatusIconTooltip',
        'steps',
        'Uploader',
        'UserReservation',
        'Widget1',
      ],
    },
    {
      id: 'pro',
      path: __dirname + '/../microservices/pro',
      exceptions: [
        'AccountPage',
        'collections',
        'CommissionRatesViewer',
        'ConfirmMethod',
        'ContactButton',
        'EmailVerification',
        'files',
        'Forms',
        'Impersonation',
        'LoginPage',
        'PasswordChange',
        'PasswordResetPage',
        'ProCustomerAdder',
        'ProCustomersTable',
        'PropertiesTable',
        'Promotion',
        'PromotionLotPage',
        'ProOrganisationUserAdder',
        'RevenuesByStatus',
        'Uploader',
      ],
    },
    {
      id: 'www',
      path: __dirname + '/../microservices/www',
      exceptions: ['Forms', 'offer', 'Start2Form', 'Widget1', 'ContactButton'],
    },
  ],
  // List of strings that don't have a component file associated to them, so
  // this algorithm would miss them, provide the first part of those strings
  // here
  generalExceptions: [
    'BorrowersSummary',
    'e-Potek',
    'errors',
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
    'Maps',
    'MissingDoc',
    'NotFound',
    'PercentWithStatus',
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
    'PropertyCustomerAdder',
    'ProPropertyPage',
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
    if (files[i] === 'core') {
      // don't scan core directory, add those to exceptions
      continue;
    }

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
