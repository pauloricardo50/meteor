import fs from 'fs';
import path from 'path';

const config = {
  // Where the lang directory is stored with the complete list of strings
  // for each language
  pathToLangDir: `${__dirname}/../core`,
  // An array of languages to look for
  languages: ['fr'],
  // The list of directories to scan and create language files for
  directories: [
    {
      id: 'admin',
      path: `${__dirname}/../microservices/admin`,
      exceptions: [
        'AccountPage',
        'AdminPromotionPage',
        'ArrayInput',
        'AutoForm',
        'BorrowerAdder',
        'BorrowerRemover',
        'BorrowersSummary',
        'collections',
        'CommissionRatesViewer',
        'ConditionsButton',
        'ConfirmMethod',
        'Contacts',
        'e-Potek',
        'EmailVerification',
        'errors',
        'ExternalUrl',
        'Feedback',
        'File',
        'FileAdder',
        'files',
        'FileTabs',
        'Financing',
        'Form',
        'Forms',
        'general',
        'GoogleMap',
        'Impersonation',
        'InterestRates',
        'InterestsChart',
        'InterestsTable',
        'Irs10y',
        'LayoutError',
        'Lenders',
        'LoanChecklist',
        'LoanClosingChecklist',
        'LoginPage',
        'Maps',
        'MaxPropertyValue',
        'methods',
        'MissingDoc',
        'MortgageNotesForm',
        'NotFound',
        'offer',
        'OfferAdder',
        'PasswordChange',
        'PDF',
        'PercentWithStatus',
        'ProCustomersTable',
        'Promotion',
        'ProOrganisationUserAdder',
        'property',
        'PropertyAdder',
        'PropertyCustomerAdder',
        'PropertyForm',
        'ProPropertyPage',
        'Recap',
        'RevenuesByStatus',
        'roles',
        'Search',
        'SearchResults',
        'SimpleFinancingCertificate',
        'StatusIconTooltip',
        'steps',
        'Table',
        'tooltip',
        'tooltip2',
        'TooltipSynonyms',
        'TopNav',
        'TopNavDropdown',
        'TranchePicker',
        'Uploader',
        'UploaderArray',
      ],
    },
    {
      id: 'app',
      path: `${__dirname}/../microservices/app`,
      exceptions: [
        'AccountPage',
        'AmortizationChart',
        'ArrayInput',
        'AutoForm',
        'BorrowerAdder',
        'BorrowerAddPartner',
        'BorrowerRemover',
        'BorrowersPage',
        'BorrowersSummary',
        'CalendlyModal',
        'cities',
        'collections',
        'ConditionsButton',
        'ConfirmMethod',
        'ContactButton',
        'e-Potek',
        'EmailVerification',
        'errors',
        'ExternalUrl',
        'File',
        'FileAdder',
        'files',
        'FileTabs',
        'Financing',
        'Form',
        'Forms',
        'general',
        'GoogleMap',
        'ImpersonateNotification',
        'Impersonation',
        'InterestsTable',
        'LayoutError',
        'LoanChecklist',
        'LoanClosingChecklist',
        'LoginPage',
        'Maps',
        'MaxPropertyValue',
        'Microlocation',
        'MissingDoc',
        'MortgageNotesForm',
        'NotFound',
        'offer',
        'PasswordChange',
        'PasswordResetPage',
        'PercentWithStatus',
        'Promotion',
        'property',
        'PropertyAdder',
        'PropertyCustomerAdder',
        'PropertyForm',
        'ProPropertyPage',
        'Recap',
        'roles',
        'Search',
        'SearchResults',
        'SimpleDashboardPage',
        'SimpleFinancingCertificate',
        'StatusIconTooltip',
        'steps',
        'Table',
        'tooltip',
        'tooltip2',
        'TooltipSynonyms',
        'TopNav',
        'TopNavDropdown',
        'TranchePicker',
        'Uploader',
        'UploaderArray',
        'UserReservation',
        'Widget1',
      ],
    },
    {
      id: 'pro',
      path: `${__dirname}/../microservices/pro`,
      exceptions: [
        'AccountPage',
        'BorrowersSummary',
        'collections',
        'CommissionRatesViewer',
        'ConfirmMethod',
        'EmailVerification',
        'errors',
        'ExternalUrl',
        'File',
        'files',
        'FileTabs',
        'Form',
        'Forms',
        'general',
        'GoogleMap',
        'ImpersonateNotification',
        'Impersonation',
        'InterestsTable',
        'LayoutError',
        'LoanChecklist',
        'LoginPage',
        'Maps',
        'MissingDoc',
        'NotFound',
        'PasswordChange',
        'PasswordResetPage',
        'PercentWithStatus',
        'ProCustomerAdder',
        'ProCustomersTable',
        'Promotion',
        'PromotionCustomersTable',
        'PromotionLotGroupsManager',
        'PromotionLotPage',
        'ProOrganisationUserAdder',
        'PropertiesTable',
        'property',
        'PropertyCustomerAdder',
        'ProPropertyPage',
        'Recap',
        'RevenuesByStatus',
        'roles',
        'Search',
        'SearchResults',
        'Table',
        'tooltip',
        'tooltip2',
        'TooltipSynonyms',
        'TopNav',
        'TopNavDropdown',
        'Uploader',
        'UploaderArray',
      ],
    },
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
      const recursedResult = findFilesWithExtension(filename, extension); // recurse
      results = [...results, ...recursedResult];
    } else if (filename.indexOf(extension) >= 0) {
      const fileWithExtension = filename.replace(/^.*[\\\/]/, '');
      results.push(fileWithExtension.split('.')[0]);
    }
  }

  return results;
};

const isKeyAllowed = allowedKeys => key =>
  allowedKeys.some(allowedKey => key.startsWith(allowedKey));

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
    .reduce((obj, key) => ({ [key]: langObject[key], ...obj }), {});

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

const createPathToLanguage = (dir, language) => `${dir}/lang/${language}.json`;

// Given a config object, create unique language files for each microservice
const createLanguages = ({ directories, languages, pathToLangDir }) => {
  console.log('Starting language building process...');

  directories.forEach(({ path: dirPath, exceptions: dirExceptions }) => {
    const componentNames = findFilesWithExtension(dirPath, '.jsx');

    languages.forEach(language => {
      console.log(`Creating ${language} file for ${dirPath}`);
      const languageObject = filterLanguageKeys(pathToLangDir, language, [
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
        `Invalid argument, it has to be one of these: ${possibleArguments.join(
          ' ',
        )}`,
      );
    }

    const customConfig = {
      ...config,
      directories: config.directories.filter(
        directoryConfig => directoryConfig.id === argument,
      ),
    };

    return customConfig;
  }

  return config;
};

createLanguages(getCustomConfig());
