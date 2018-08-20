import {
  PURCHASE_TYPE,
  RESIDENCE_TYPE,
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
  PROPERTY_TYPE,
  CIVIL_STATUS,
} from '../constants';
import { DOCUMENTS } from './fileConstants';

export const borrowerDocuments = (b = {}) => ({
  auction: [
    { id: DOCUMENTS.IDENTITY },
    { id: DOCUMENTS.RESIDENCY_PERMIT, condition: !b.isSwiss },
    // TODO: implement married couple logic
    { id: DOCUMENTS.TAXES },
    { id: DOCUMENTS.SALARY_CERTIFICATE },
    {
      id: DOCUMENTS.BONUSES,
      condition: !!b.bonus && Object.keys(b.bonus).length > 0,
    },
    {
      id: DOCUMENTS.OTHER_INCOME,
      condition: b.otherIncome && !!(b.otherIncome.length > 0),
    },
    {
      id: DOCUMENTS.OWN_COMPANY_FINANCIAL_STATEMENTS,
      condition: !!b.worksForOwnCompany,
    },
    {
      id: DOCUMENTS.DIVORCE_RULING,
      condition: !b.civilStatus === CIVIL_STATUS.DIVORCED,
      noTooltips: true,
    },
    {
      id: DOCUMENTS.EXPENSES_JUSTIFICATION,
      condition: !!b.expenses && !!(b.expenses.length > 0),
    },
  ],
  contract: [
    { id: DOCUMENTS.DEBT_COLLECTION_REGISTER_EXTRACT, doubleTooltip: true },
    { id: DOCUMENTS.LAST_SALARIES, noTooltips: true },
    {
      id: DOCUMENTS.CURRENT_MORTGAGES,
      condition: !!b.realEstate && !!b.realEstate.length > 0,
    },
    {
      id: DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT,
      condition: b.insuranceSecondPillar > 0,
      doubleTooltip: true,
    },
    {
      id: DOCUMENTS.THIRD_PILLAR_ACCOUNTS,
      condition: b.insuranceThirdPillar > 0, // TODO, separate from insurance and other below
      doubleTooltip: true,
    },
  ],
  closing: [],
  all() {
    return [...this.auction, ...this.contract, ...this.closing];
  },
});

export const loanDocuments = (r = {}) => {
  const isRefinancing = !!r.general && r.general.purchaseType === PURCHASE_TYPE.REFINANCING;
  return {
    auction: [],
    contract: [
      {
        id: DOCUMENTS.BUYERS_CONTRACT,
        tooltipSuffix: isRefinancing ? 'a' : 'b',
      },
      {
        id: DOCUMENTS.REIMBURSEMENT_STATEMENT,
        condition: isRefinancing,
      },
    ],
    closing: [],
    admin: [{ id: DOCUMENTS.CONTRACT }, { id: DOCUMENTS.SIGNED_CONTRACT }],
    all() {
      return [
        ...this.auction,
        ...this.contract,
        ...this.closing,
        ...this.admin,
        ...this.other,
      ];
    },
  };
};

export const propertyDocuments = (property = {}, loan = {}) => ({
  auction: [
    { id: DOCUMENTS.PROPERTY_PLANS },
    {
      id: DOCUMENTS.PROPERTY_VOLUME,
      doubleTooltip: true,
      condition: property.propertyType === PROPERTY_TYPE.HOUSE,
    },
    { id: DOCUMENTS.PROPERTY_PICTURES },
    {
      id: DOCUMENTS.PROPERTY_MARKETING_BROCHURE,
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
      id: DOCUMENTS.INVESTMENT_PROPERTY_RENT_JUSTIFICATION,
      condition:
        !!loan.general
        && loan.general.residenceType === RESIDENCE_TYPE.INVESTMENT,
      doubleTooltip: true,
    },
    { id: DOCUMENTS.LAND_REGISTER_EXTRACT, doubleTooltip: true },
    {
      id: DOCUMENTS.COOWNERSHIP_ALLOCATION_AGREEMENT,
      condition: property.isCoproperty,
      doubleTooltip: true,
    },
    {
      id: DOCUMENTS.COOWNERSHIP_AGREEMENT,
      condition: property.isCoproperty,
      doubleTooltip: true,
    },
    { id: DOCUMENTS.FIRE_AND_WATER_INSURANCE, condition: !!property.isNew },
  ],
  all() {
    return [...this.auction, ...this.contract];
  },
});

export const getDocumentArrayByStep = (func, step) => [
  ...func()[step],
  { id: DOCUMENTS.OTHER },
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
