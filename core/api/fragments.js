// import merge from 'lodash/merge';

import { Meteor } from 'meteor/meteor';
import { INTEREST_RATES } from './constants';

// //
// // borrower fragments
// //
export const baseBorrower = () => ({
  createdAt: 1,
  firstName: 1,
  lastName: 1,
  name: 1,
  updatedAt: 1,
  userId: 1,
});

export const loanBorrower = ({ withSort } = {}) => ({
  ...baseBorrower(),
  additionalDocuments: { id: 1, label: 1, requiredByAdmin: 1 },
  address1: 1,
  address2: 1,
  adminValidation: 1,
  age: 1,
  bank3A: 1,
  bankFortune: 1,
  birthPlace: 1,
  bonus2015: 1,
  bonus2016: 1,
  bonus2017: 1,
  bonus2018: 1,
  bonusExists: 1,
  canton: 1,
  childrenCount: 1,
  citizenship: 1,
  city: 1,
  civilStatus: 1,
  company: 1,
  expenses: 1,
  gender: 1,
  insurance2: 1,
  insurance3A: 1,
  insurance3B: 1,
  isSwiss: 1,
  isUSPerson: 1,
  loans: { name: 1 },
  logic: 1,
  mortgageNotes: mortgageNote(),
  otherFortune: 1,
  otherIncome: 1,
  personalBank: 1,
  realEstate: 1,
  residencyPermit: 1,
  salary: 1,
  sameAddress: 1,
  thirdPartyFortune: 1,
  worksForOwnCompany: 1,
  zipCode: 1,
  ...(withSort ? { $options: { sort: { createdAt: 1 } } } : {}),
});

export const adminBorrower = () => ({
  ...loanBorrower(),
  loans: loanBase(),
  user: appUser(),
});

export const sideNavBorrower = () => ({
  ...baseBorrower(),
  loans: { name: 1 },
  user: { assignedEmployee: { email: 1 } },
});

// //
// // Contact fragments
// //
export const contact = () => ({
  address: 1,
  address1: 1,
  address2: 1,
  canton: 1,
  city: 1,
  email: 1,
  emails: 1,
  firstName: 1,
  lastName: 1,
  name: 1,
  organisations: { name: 1, _id: 1, address: 1 },
  phoneNumber: 1,
  phoneNumbers: 1,
  zipCode: 1,
});

// //
// // InterestRate fragments
// //
const singleInterestRate = type => ({
  [type]: { rateLow: 1, rateHigh: 1, trend: 1 },
});

const rates = Object.values(INTEREST_RATES).reduce(
  (interestRates, type) => ({
    ...interestRates,
    ...singleInterestRate(type),
  }),
  {},
);

export const interestRates = () => ({
  ...rates,
  createdAt: 1,
  updatedAt: 1,
  date: 1,
});

export const currentInterestRates = () => ({
  ...rates,
  date: 1,
});

// //
// // Irs10Y fragments
// //
export const irs10y = () => ({
  date: 1,
  rate: 1,
});

// //
// // Lender fragments
// //
export const lender = () => ({
  contact: contact(),
  loan: { _id: 1 },
  offers: fullOffer(),
  organisation: {
    address: 1,
    address1: 1,
    address2: 1,
    canton: 1,
    city: 1,
    contacts: contact(),
    logo: 1,
    name: 1,
    type: 1,
    zipCode: 1,
  },
});

export const adminLender = () => ({
  ...lender,
  status: 1,
});

// //
// // Loan fragments
// //
export const loan = () => ({
  additionalDocuments: { id: 1, label: 1, requiredByAdmin: 1 },
  borrowerIds: 1,
  borrowers: { firstName: 1, lastName: 1, name: 1 },
  canton: 1,
  createdAt: 1,
  currentOwner: 1,
  enableOffers: 1,
  futureOwner: 1,
  hasPromotion: 1,
  logic: 1,
  name: 1,
  otherOwner: 1,
  previousLender: 1,
  previousLoanTranches: 1,
  promotions: {
    name: 1,
    address: 1,
    contacts: 1,
  },
  properties: { value: 1, address1: 1 },
  propertyIds: 1,
  purchaseType: 1,
  residenceType: 1,
  selectedStructure: 1,
  status: 1,
  structure: 1,
  structures: 1,
  updatedAt: 1,
  userId: 1,
  verificationStatus: 1,
});

export const loanBase = () => ({
  ...loan(),
  promotionOptions: {
    attributedToMe: 1,
    custom: 1,
    name: 1,
    priority: 1,
    promotion: 1,
    promotionLots: {
      name: 1,
      status: 1,
      reducedStatus: 1,
      value: 1,
      properties: promotionProperty(),
    },
    solvency: 1,
    value: 1,
  },
});

export const userLoan = ({ withSort, withFilteredPromotions } = {}) => ({
  ...loanBase,
  adminValidation: 1,
  borrowers: loanBorrower({ withSort }),
  contacts: 1,
  offers: fullOffer(),
  properties: userProperty({ withSort }),
  user: appUser(),
  userFormsEnabled: 1,
  ...(withFilteredPromotions
    ? {
      promotions: {
        name: 1,
        address: 1,
        status: 1,
        contacts: 1,
        loans: {
          _id: 1,
          $filter({ filters, params: { loanId } }) {
            filters.userId = Meteor.userId();
            filters._id = loanId;
          },
        },
      },
    }
    : {}),
});

export const adminLoan = ({ withSort } = {}) => ({
  ...userLoan({ withSort }),
  closingDate: 1,
  lenders: adminLender(),
  properties: adminProperty(),
  signingDate: 1,
  status: 1,
});
export const adminLoans = () => ({
  ...loanBase(),
  borrowers: { name: 1 },
  closingDate: 1,
  properties: { value: 1, address1: 1 },
  signingDate: 1,
  status: 1,
  user: { assignedEmployee: { email: 1 }, name: 1 },
});

export const proLoans = () => ({
  createdAt: 1,
  name: 1,
  promotions: { _id: 1, users: { _id: 1 }, status: 1 },
  promotionLinks: 1,
  promotionOptions: {
    name: 1,
    status: 1,
    promotionLots: { _id: 1, attributedTo: { user: { _id: 1 } } },
    solvency: 1,
  },
  promotionProgress: 1,
  user: { name: 1, phoneNumbers: 1, email: 1 },
});

export const sideNavLoan = () => ({
  ...loanBase(),
  status: 1,
  user: { assignedEmployee: { email: 1 }, name: 1 },
});

// //
// // MortgageNote fragments
// //
export function mortgageNote() {
  return {
    canton: 1,
    category: 1,
    rank: 1,
    type: 1,
    value: 1,
  };
}

// //
// // Offer fragments
// //
export const fullOffer = () => ({
  amortizationGoal: 1,
  amortizationYears: 1,
  conditions: 1,
  epotekFees: 1,
  feedback: 1,
  ...Object.values(INTEREST_RATES).reduce(
    (obj, rate) => ({ ...obj, [rate]: 1 }),
    {},
  ),
  fees: 1,
  lender: {
    loan: { _id: 1, name: 1 },
    contact: { _id: 1, name: 1 },
    organisation: { _id: 1, name: 1 },
  },
  loanId: 1,
  maxAmount: 1,
  organisation: 1,
  user: simpleUser(),
});

// //
// // Organisation fragments
// //
export const baseOrganisation = () => ({
  address: 1,
  address1: 1,
  address2: 1,
  canton: 1,
  city: 1,
  contacts: { role: 1, email: 1, name: 1 },
  features: 1,
  logo: 1,
  name: 1,
  type: 1,
  zipCode: 1,
});

export const fullOrganisation = () => ({
  ...baseOrganisation(),
  contacts: contact(),
  lenders: lender(),
  offers: fullOffer(),
});

// //
// // PromotionLot fragments
// //
export const proPromotionLot = () => ({
  attributedTo: { user: { name: 1 } },
  createdAt: 1,
  lots: { name: 1, value: 1, type: 1, description: 1 },
  name: 1,
  promotion: {
    status: 1,
    name: 1,
    promotionLots: { name: 1 },
    users: { _id: 1 },
    lots: {
      name: 1,
      value: 1,
      type: 1,
      description: 1,
      promotionLots: { _id: 1 },
    },
  },
  promotionOptions: { _id: 1 },
  properties: promotionProperty(),
  status: 1,
  updatedAt: 1,
  value: 1,
});

export const appPromotionLot = () => ({
  attributedTo: { user: { _id: 1 } },
  createdAt: 1,
  lots: { name: 1, value: 1, type: 1, description: 1 },
  name: 1,
  promotion: { name: 1, status: 1 },
  properties: promotionProperty(),
  reducedStatus: 1,
  status: 1,
  updatedAt: 1,
  value: 1,
});

// //
// // PromotionOption fragments
// //
export const fullPromotionOption = () => ({
  createdAt: 1,
  custom: 1,
  loan: { name: 1 },
  lots: { name: 1, type: 1, status: 1, description: 1 },
  priority: 1,
  promotionLots: { name: 1, promotion: { name: 1 } },
  solvency: 1,
  updatedAt: 1,
});

export const proPromotionOption = () => ({
  createdAt: 1,
  custom: 1,
  loan: {
    solvency: 1,
    user: { phoneNumbers: 1, name: 1, email: 1 },
    promotions: { _id: 1 },
    promotionOptions: {
      name: 1,
      promotionLots: { attributedTo: { user: { _id: 1 } } },
      solvency: 1,
    },
    promotionProgress: 1,
  },
  lots: { name: 1, type: 1, description: 1 },
  priority: 1,
  solvency: 1,
  updatedAt: 1,
});

export const appPromotionOption = () => ({
  attributedToMe: 1,
  createdAt: 1,
  custom: 1,
  lots: { description: 1, name: 1, type: 1, value: 1 },
  promotionLots: appPromotionLot(),
  priority: 1,
  solvency: 1,
  updatedAt: 1,
});

// //
// // Promotion fragments
// //
export const basePromotion = () => ({
  address: 1,
  address1: 1,
  availablePromotionLots: 1,
  bookedPromotionLots: 1,
  canton: 1,
  city: 1,
  contacts: 1,
  createdAt: 1,
  loans: { _id: 1 },
  lots: {
    value: 1,
    name: 1,
    type: 1,
    description: 1,
    promotionLots: { name: 1 },
    status: 1,
  },
  name: 1,
  promotionLots: {
    _id: 1,
    status: 1,
    reducedStatus: 1,
    lots: { name: 1 },
    promotionOptions: { _id: 1 },
    name: 1,
  },
  properties: promotionProperty(),
  soldPromotionLots: 1,
  status: 1,
  type: 1,
  updatedAt: 1,
  users: { _id: 1, name: 1, email: 1, roles: 1 },
  zipCode: 1,
});

export const proPromotion = ({ withFilteredLoan } = {}) => ({
  ...basePromotion,
  assignedEmployee: { name: 1, email: 1 },
  assignedEmployeeId: 1,
  promotionLots: {
    _id: 1,
    attributedTo: { user: { name: 1 } },
    lots: { name: 1, value: 1, type: 1, description: 1, status: 1 },
    name: 1,
    promotionOptions: { _id: 1 },
    properties: promotionProperty(),
    reducedStatus: 1,
    status: 1,
    value: 1,
  },
  ...(withFilteredLoan
    ? {
      loans: {
        $filter({ filters, params: { loanId } }) {
          filters._id = loanId;
        },
      },
    }
    : {}),
});

export const proPromotions = () => ({
  ...basePromotion(),
});

export const adminPromotions = () => ({
  ...proPromotion(),
});

export const searchPromotions = () => ({
  createdAt: 1,
  name: 1,
  promotionLotLinks: 1,
  updatedAt: 1,
});

// //
// // Property fragments
// //
export const userValuation = () => ({
  date: 1,
  error: 1,
  max: 1,
  microlocation: 1,
  min: 1,
  status: 1,
});

export const adminValuation = () => ({
  ...userValuation(),
  value: 1,
});

export const propertySummary = () => ({
  address1: 1,
  address2: 1,
  canton: 1,
  city: 1,
  insideArea: 1,
  promotion: { name: 1 },
  propertyType: 1,
  status: 1,
  userId: 1,
  value: 1,
  zipCode: 1,
});

export const fullProperty = ({ withSort } = {}) => ({
  ...propertySummary(),
  additionalDocuments: { id: 1, label: 1, requiredByAdmin: 1 },
  adminValidation: 1,
  areaNorm: 1,
  bathroomCount: 1,
  category: 1,
  constructionYear: 1,
  copropertyPercentage: 1,
  createdAt: 1,
  customFields: 1,
  description: 1,
  flatType: 1,
  floorNumber: 1,
  gardenArea: 1,
  houseType: 1,
  investmentRent: 1,
  isCoproperty: 1,
  isNew: 1,
  landArea: 1,
  latitude: 1,
  loans: loanBase(),
  longitude: 1,
  minergie: 1,
  monthlyExpenses: 1,
  mortgageNotes: mortgageNote(),
  name: 1,
  numberOfFloors: 1,
  parkingInside: 1,
  parkingOutside: 1,
  pictures: 1,
  promotion: { name: 1 },
  qualityProfileCondition: 1,
  qualityProfileStandard: 1,
  renovationYear: 1,
  residenceType: 1,
  roomCount: 1,
  terraceArea: 1,
  updatedAt: 1,
  user: appUser(),
  volume: 1,
  volumeNorm: 1,
  ...(withSort ? { $options: { sort: { createdAt: 1 } } } : {}),
});

export const adminProperty = ({ withSort } = {}) => ({
  ...fullProperty({ withSort }),
  valuation: adminValuation(),
});

export const promotionProperty = () => ({
  address: 1,
  bathroomCount: 1,
  canton: 1,
  description: 1,
  gardenArea: 1,
  insideArea: 1,
  monthlyExpenses: 1,
  name: 1,
  roomCount: 1,
  terraceArea: 1,
  value: 1,
});

export const sideNavProperty = () => ({
  address1: 1,
  city: 1,
  createdAt: 1,
  loans: { name: 1 },
  name: 1,
  promotion: { name: 1 },
  updatedAt: 1,
  user: { assignedEmployee: { email: 1 } },
  value: 1,
  zipCode: 1,
});

export const userProperty = () => ({
  ...fullProperty(),
  valuation: userValuation(),
});

// //
// // Task fragments
// //
export const baseTask = () => ({
  completedAt: 1,
  createdAt: 1,
  dueAt: 1,
  fileKey: 1,
  relatedDoc: 1,
  status: 1,
  title: 1,
  type: 1,
  updatedAt: 1,
  userId: 1,
});

export const task = () => ({
  ...baseTask(),
  assignedEmployeeId: 1,
  assignedEmployee: simpleUser(),
  borrower: { ...baseBorrower, user: { assignedEmployeeId: 1 } },
  loan: { name: 1, user: { assignedEmployeeId: 1 } },
  property: { address1: 1, user: { assignedEmployeeId: 1 } },
});

// //
// // User fragments
// //
export const simpleUser = () => ({
  email: 1,
  emails: 1,
  name: 1,
  firstName: 1,
  lastName: 1,
  phoneNumbers: 1,
  roles: 1,
});

export const adminUser = () => ({
  ...fullUser(),
  assignedEmployee: simpleUser(),
});

export const fullUser = () => ({
  ...simpleUser(),
  apiToken: 1,
  assignedEmployee: simpleUser(),
  createdAt: 1,
  emails: 1,
  loans: loanBase(),
  updatedAt: 1,
});

export const appUser = () => ({
  ...fullUser(),
  assignedEmployee: simpleUser(),
  borrowers: { _id: 1, name: 1 },
  loans: {
    _id: 1,
    borrowers: { _id: 1 },
    logic: { step: 1 },
    name: 1,
    purchaseType: 1,
  },
  properties: { _id: 1 },
});

export const proUser = () => ({
  ...fullUser(),
  assignedEmployee: simpleUser(),
});
