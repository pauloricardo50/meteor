import SimpleSchema from 'simpl-schema';
import {
  FILE_STATUS,
  PURCHASE_TYPE,
  USAGE_TYPE,
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
} from '../constants';

export const borrowerDocuments = (b = {}) => ({
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
  all() {
    return [...this.auction, ...this.contract, ...this.closing];
  },
});

export const loanDocuments = (r = {}) => ({
  auction: [],
  contract: [
    {
      id: 'buyersContract',
      tooltipSuffix:
        !!r.general && r.general.purchaseType === 'refinancing' ? 'a' : 'b',
    },
    {
      id: 'reimbursementStatement',
      condition: !!r.general && r.general.purchaseType === 'refinancing',
    },
    {
      id: 'coownershipAllocationAgreement',
      condition: !!r.propertyId && !!r.propertyId.isCoproperty,
      doubleTooltip: true,
    },
    {
      id: 'coownershipAgreement',
      condition: !!r.propertyId && !!r.propertyId.isCoproperty,
      doubleTooltip: true,
    },
    {
      id: 'fireAndWaterInsurance',
      condition: !!(r.propertyId && r.propertyId.isNew),
    },
  ],
  closing: [],
  other: [
    { id: 'upload0' },
    { id: 'upload1' },
    { id: 'upload2' },
    { id: 'upload3' },
    { id: 'upload4' },
  ],
  admin: [{ id: 'contract' }, { id: 'signedContract' }],
  all() {
    return [
      ...this.auction,
      ...this.contract,
      ...this.closing,
      ...this.admin,
      ...this.other,
    ];
  },
});

export const propertyDocuments = (property = {}, loan = {}) => ({
  auction: [
    {
      id: 'plans',
    },
    {
      id: 'cubage',
      doubleTooltip: true,
      condition: property.style === 'villa',
    },
    {
      id: 'pictures',
    },
    {
      id: 'marketingBrochure',
      condition: !!(
        loan &&
        loan.general &&
        loan.general.purchaseType === PURCHASE_TYPE.ACQUISITION
      ),
      required: false,
    },
  ],
  contract: [
    {
      id: 'rent',
      condition:
        !!loan.general && loan.general.usageType === USAGE_TYPE.INVESTMENT,
      doubleTooltip: true,
    },
    {
      id: 'landRegisterExtract',
      doubleTooltip: true,
    },
  ],
  all() {
    return [...this.auction, ...this.contract];
  },
});

export const getDocumentIDs = (list) => {
  let documents;
  const ids = [];
  switch (list) {
  case BORROWERS_COLLECTION:
    documents = borrowerDocuments();
    break;
  case LOANS_COLLECTION:
    documents = loanDocuments();
    break;
  case PROPERTIES_COLLECTION:
    documents = propertyDocuments();
    break;
  default:
    throw new Error('invalid file list');
  }

  documents.all().forEach(f => ids.push(f.id));

  return ids;
};

// Schema used for every file
export const FileSchema = new SimpleSchema({
  name: String,
  initialName: String,
  size: Number,
  type: String,
  url: { type: String, regEx: SimpleSchema.RegEx.Url },
  key: String,
  status: { type: String, allowedValues: Object.values(FILE_STATUS) },
  error: { optional: true, type: String },
});

export const DocumentSchema = new SimpleSchema({
  files: { type: Array, defaultValue: [], maxCount: 100 },
  'files.$': FileSchema,
  uploadCount: { type: Number, defaultValue: 0 },
  label: { type: String, optional: true },
  isAdmin: { type: Boolean, optional: true, defaultValue: false },
});
