import {
  PURCHASE_TYPE,
  RESIDENCE_TYPE,
  PROPERTY_TYPE,
  CIVIL_STATUS,
  STEPS,
  STEP_ORDER,
  PROPERTIES_COLLECTION,
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
} from '../constants';
import { DOCUMENTS } from './fileConstants';
import Calculator from '../../utils/Calculator/index';

export const borrowerDocuments = (b = {}) => ({
  [STEPS.PREPARATION]: [
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
      id: DOCUMENTS.OTHER_INCOME_JUSTIFICATION,
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
  [STEPS.GET_CONTRACT]: [
    { id: DOCUMENTS.DEBT_COLLECTION_REGISTER_EXTRACT, doubleTooltip: true },
    { id: DOCUMENTS.LAST_SALARIES, noTooltips: true },
    {
      id: DOCUMENTS.CURRENT_MORTGAGES,
      condition: !!b.realEstate && !!b.realEstate.length > 0,
    },
    {
      id: DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT,
      condition: Calculator.getInsurance2({ borrowers: b }) > 0,
      doubleTooltip: true,
    },
    {
      id: DOCUMENTS.THIRD_PILLAR_ACCOUNTS,
      condition:
        Calculator.getInsurance3A({ borrowers: b }) > 0
        || Calculator.getInsurance3B({ borrowers: b }) > 0
        || Calculator.getBank3A({ borrowers: b }) > 0,
      doubleTooltip: true,
    },
  ],
  [STEPS.CLOSING]: [],
  all() {
    return [
      ...this[STEPS.PREPARATION],
      ...this[STEPS.GET_CONTRACT],
      ...this[STEPS.CLOSING],
    ];
  },
});

export const loanDocuments = ({ general: { purchaseType } }) => {
  const isRefinancing = purchaseType === PURCHASE_TYPE.REFINANCING;
  return {
    [STEPS.PREPARATION]: [],
    [STEPS.GET_CONTRACT]: [
      {
        id: DOCUMENTS.BUYERS_CONTRACT,
        tooltipSuffix: isRefinancing ? 'a' : 'b',
      },
      {
        id: DOCUMENTS.REIMBURSEMENT_STATEMENT,
        condition: isRefinancing,
      },
    ],
    [STEPS.CLOSING]: [],
    all() {
      return [
        ...this[STEPS.PREPARATION],
        ...this[STEPS.GET_CONTRACT],
        ...this[STEPS.CLOSING],
      ];
    },
  };
};

export const propertyDocuments = (property = {}, loan = {}) => ({
  [STEPS.PREPARATION]: [
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
  [STEPS.GET_CONTRACT]: [
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
  [STEPS.CLOSING]: [],
  all() {
    return [
      ...this[STEPS.PREPARATION],
      ...this[STEPS.GET_CONTRACT],
      ...this[STEPS.CLOSING],
    ];
  },
});

export const getDocumentArrayByStep = (func, step) => [
  ...func()[step],
  { id: DOCUMENTS.OTHER, required: false },
];

const getKeysFromArray = (order, key) => order.slice(0, order.indexOf(key) + 1);

const flattenDocumentsByStep = (documentsObject, step) => {
  const previousSteps = getKeysFromArray(STEP_ORDER, step);
  return previousSteps.reduce(
    (documents, s) => [
      ...documents,
      ...(documentsObject[s] ? documentsObject[s] : []),
    ],
    [],
  );
};

const makeGetDocumentsList = collection => ({ loan, id }) => {
  let documents;
  const isLoans = collection === LOANS_COLLECTION;
  if (!id && !isLoans) {
    return [];
  }

  const doc = !isLoans && loan[collection].find(({ _id }) => _id === id);
  const { step } = loan.logic;

  if (collection === PROPERTIES_COLLECTION) {
    const allPropertyDocuments = propertyDocuments(doc, loan);
    documents = flattenDocumentsByStep(allPropertyDocuments, step);
  }
  if (collection === BORROWERS_COLLECTION) {
    const allBorrowerDocuments = borrowerDocuments(doc);
    documents = flattenDocumentsByStep(allBorrowerDocuments, step);
  }
  if (collection === LOANS_COLLECTION) {
    const allLoanDocuments = loanDocuments(loan);
    documents = flattenDocumentsByStep(allLoanDocuments, step);
  }

  return [
    ...documents,
    ...(doc && doc.additionalDocuments
      ? doc.additionalDocuments.map(additionalDoc => ({
        ...additionalDoc,
        required: true,
      }))
      : []),
    { id: DOCUMENTS.OTHER, required: false },
  ];
};

export const getPropertyDocuments = makeGetDocumentsList(PROPERTIES_COLLECTION);
export const getBorrowerDocuments = makeGetDocumentsList(BORROWERS_COLLECTION);
export const getLoanDocuments = makeGetDocumentsList(LOANS_COLLECTION);
