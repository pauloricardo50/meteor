import 'babel-polyfill';
import SimpleSchema from 'simpl-schema';

export const borrowerFiles = (b = {}) => ({
  auction: [
    {
      id: 'identity',
    },
    {
      id: 'residencyPermit',
      condition: !b.isSwiss,
    },
    {
      id: 'taxes',
      // condition: true, //TODO: implement married couple logic
    },
    {
      id: 'salaryCertificate',
    },
    {
      id: 'salaryChange',
      condition: !!b.hasChangedSalary,
    },
    {
      id: 'bonus',
      condition: !!b.bonus && Object.keys(b.bonus).length > 0,
    },
    {
      id: 'otherIncome',
      condition: b.otherIncome && !!(b.otherIncome.length > 0),
    },
    {
      id: 'ownCompanyFinancialStatements',
      condition: !!b.worksForOwnCompany,
    },
    {
      id: 'divorceJudgment',
      condition: !b.civilStatus === 'divorced',
      noTooltips: true,
    },
    {
      id: 'expenses',
      condition: !!b.otherIncome && !!(b.otherIncome.length > 0),
    },
  ],
  contract: [
    {
      id: 'nonPursuitExtract',
      doubleTooltip: true,
    },
    {
      id: 'lastSalaries',
      noTooltips: true,
    },
    {
      id: 'currentMortgages',
      condition: !!b.realEstate && !!b.realEstate.length > 0,
    },
    {
      id: 'bankAssetsChange',
      condition: b.fortuneChange,
    },
    {
      id: 'pensionFundYearlyStatement',
      condition: b.insuranceSecondPillar > 0,
      doubleTooltip: true,
    },
    {
      id: 'retirementInsurancePlan',
      condition: b.insuranceThirdPillar > 0, // TODO, separate from insurance and other below
      doubleTooltip: true,
    },
    {
      id: 'retirementPlanOther',
      // condition: true, TODO
      condition: false,
      doubleTooltip: true,
    },
  ],
  closing: [],
});

export const requestFiles = (r = {}) => ({
  auction: [
    {
      id: 'plans',
    },
    {
      id: 'cubage',
      doubleTooltip: true,
    },
    {
      id: 'pictures',
    },
  ],
  contract: [
    {
      id: 'buyersContract',
      tooltipSuffix: !!r.general && r.general.purchaseType === 'refinancing' ? 'a' : 'b',
    },
    {
      id: 'reimbursementStatement',
      condition: !!r.general && r.general.purchaseType === 'refinancing',
    },
    {
      id: 'rent',
      condition: !!r.general && r.general.usageType === 'investment',
      doubleTooltip: true,
    },
    {
      id: 'landRegisterExtract',
      doubleTooltip: true,
    },
    {
      id: 'marketingBrochure',
      condition: !!r.general && r.general.purchaseType === 'acquisition',
      required: false,
    },
    {
      id: 'coownershipAllocationAgreement',
      condition: !!r.property && !!r.property.isCoproperty,
      doubleTooltip: true,
    },
    {
      id: 'coownershipAgreement',
      condition: !!r.property && !!r.property.isCoproperty,
      doubleTooltip: true,
    },
    {
      id: 'fireAndWaterInsurance',
      condition: !!(r.property && r.property.isNew),
    },
  ],
  // closing: [
  //   {
  //     id: 'retirementWithdrawalStatement',
  //     label: 'Attestation LPP - après retrait',
  //     help1: 'Certificat émis sur votre demande par votre caisse de pension démontrant votre situation LPP après retrait',
  //     help2: 'Vous pouvez obtenir ce document, sur demande, auprès de votre caisse de pension',
  //     condition: !!r.logic && r.insuranceUsePreset === 'withdrawal',
  //   },
  // ],
  admin: [
    {
      id: 'contract',
    },
    {
      id: 'signedContract',
    },
  ],
});

const getFileIDs = list => {
  let files;
  const ids = [];
  switch (list) {
    case 'borrower':
      files = borrowerFiles();
      break;
    case 'request':
      files = requestFiles();
      break;
    default:
      throw new Error('invalid file list');
  }

  Object.keys(files).forEach(key => files[key].forEach(f => ids.push(f.id)));

  return ids;
};

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

// Generates a schema given a list name (request, or borrowers)
export const getFileSchema = list => {
  const schema = {};

  const arr = getFileIDs(list);

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

export const fakeFile = {
  name: 'fakeFile.pdf',
  size: 10000,
  type: 'application/pdf',
  url: 'https://www.fake-url.com',
  key: 'asdf/fakeKey/fakeFile.pdf',
  fileCount: 0,
};
