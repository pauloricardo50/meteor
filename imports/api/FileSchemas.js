import 'babel-polyfill';
import SimpleSchema from 'simpl-schema';

// Schema used for every file
const FileSchema = new SimpleSchema({
  name: String,
  size: Number,
  type: String,
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
  key: String,
  fileCount: Number,
});

// Generates a schema given an array of fileIDs
const getFileSchema = arr => {
  const schema = {};

  arr.forEach(id => {
    schema[id] = {
      type: Array,
      optional: true,
      maxCount: 100,
    };
    schema[`${id}.$`] = FileSchema;
  });

  return schema;
};

const requestFileIDs = [
  'buyersContract',
  'landRegisterExtract',
  'plans',
  'cubage',
  'fireAndWaterInsurance',
  'pictures',
  'marketingBrochure',
  'coownershipAllocationAgreement',
  'coownershipAgreement',
];

const borrowerFileIDs = [
  'identity',
  'residencyPermit',
  'taxes',
  'salaryCertificate',
  'variableIncome',
  'salaryChange',
  'lastSalaries',
  'ownCompanyFinancialStatements',
  'otherIncome',
  'rent',
  'currentMortgages',
  'reimbursementStatement',
  'pensionFundCertificate',
  'fortuneChange',
  'bankStatements',
  'nonPursuitExtract',
];

export const RequestFilesSchema = new SimpleSchema(getFileSchema(requestFileIDs));
export const BorrowerFilesSchema = new SimpleSchema(getFileSchema(borrowerFileIDs));
