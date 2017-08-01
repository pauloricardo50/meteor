
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

export const requestFileIDs = [
  // Auction
  'plans',
  'cubage',
  'pictures',

  // Contract
  'buyersContract',
  'landRegisterExtract',
  'marketingBrochure',
  'coownershipAllocationAgreement',
  'coownershipAgreement',
  'fireAndWaterInsurance',
];

export const borrowerFileIDs = [
  // Auction
  'identity',
  'residencyPermit',
  'taxes',
  'salaryCertificate',
  'salaryChange',
  'bonus',
  'otherIncome',
  'ownCompanyFinancialStatements',
  'divorceDecree',
  'expenses',

  // Contract
  'nonPursuitExtract',
  'reimbursementStatement',
  'lastSalaries',
  'rent',
  'currentMortgages',
  'bankAssetsChange',
  'pensionFundYearlyStatement',
  'retirementInsurancePlan',
  'retirementPlanOther',

  // Closing
  'retirementWithdrawalStatement',
];

export const RequestFilesSchema = new SimpleSchema(getFileSchema(requestFileIDs));
export const BorrowerFilesSchema = new SimpleSchema(getFileSchema(borrowerFileIDs));
