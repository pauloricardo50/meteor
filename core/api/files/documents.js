import SimpleSchema from 'simpl-schema';
import {
  FILE_STATUS,
  PURCHASE_TYPE,
  RESIDENCE_TYPE,
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
  PROPERTY_TYPE,
} from '../constants';

export const borrowerDocuments = (b = {}) => ({
  auction: [
    { id: 'identity' },
    { id: 'residencyPermit', condition: !b.isSwiss },
    // TODO: implement married couple logic
    { id: 'taxes' },
    { id: 'salaryCertificate' },
    { id: 'bonus', condition: !!b.bonus && Object.keys(b.bonus).length > 0 },
    {
      id: 'otherIncome',
      condition: b.otherIncome && !!(b.otherIncome.length > 0),
    },
    { id: 'ownCompanyFinancialStatements', condition: !!b.worksForOwnCompany },
    {
      id: 'divorceJudgment',
      condition: !b.civilStatus === 'divorced',
      noTooltips: true,
    },
    {
      id: 'expenses',
      condition: !!b.expenses && !!(b.expenses.length > 0),
    },
  ],
  contract: [
    { id: 'nonPursuitExtract', doubleTooltip: true },
    { id: 'lastSalaries', noTooltips: true },
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
    { id: 'plans' },
    {
      id: 'cubage',
      doubleTooltip: true,
      condition: property.propertyType === PROPERTY_TYPE.HOUSE,
    },
    { id: 'pictures' },
    {
      id: 'marketingBrochure',
      condition: !!(
        loan
        && loan.general
        && loan.general.purchaseType === PURCHASE_TYPE.ACQUISITION
      ),
      required: false,
    },
  ],
  contract: [
    {
      id: 'rent',
      condition:
        !!loan.general
        && loan.general.residenceType === RESIDENCE_TYPE.INVESTMENT,
      doubleTooltip: true,
    },
    { id: 'landRegisterExtract', doubleTooltip: true },
    {
      id: 'coownershipAllocationAgreement',
      condition: property.isCoproperty,
      doubleTooltip: true,
    },
    {
      id: 'coownershipAgreement',
      condition: property.isCoproperty,
      doubleTooltip: true,
    },
    { id: 'fireAndWaterInsurance', condition: !!property.isNew },
  ],
  all() {
    return [...this.auction, ...this.contract];
  },
});

export const getDocumentArrayByStep = (func, step) => [
  ...func()[step],
  { id: 'other' },
];

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
