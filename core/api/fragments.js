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
  birthDate: 1,
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
  documents: 1,
  expenses: 1,
  gender: 1,
  hasOwnCompany: 1,
  insurance2: 1,
  insurance3A: 1,
  insurance3B: 1,
  isSwiss: 1,
  isUSPerson: 1,
  loans: { name: 1 },
  mortgageNotes: mortgageNote(),
  netSalary: 1,
  otherFortune: 1,
  otherIncome: 1,
  ownCompanies: 1,
  personalBank: 1,
  realEstate: 1,
  residencyPermit: 1,
  salary: 1,
  sameAddress: 1,
  step: 1,
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
  organisations: { name: 1, address: 1 },
  phoneNumber: 1,
  phoneNumbers: 1,
  zipCode: 1,
  offers: { _id: 1 },
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
  ...lender(),
  status: 1,
});

// //
// // LenderRules fragments
// //
export const lenderRules = () => ({
  adminComments: 1,
  allowPledge: 1,
  amortizationGoal: 1,
  amortizationYears: 1,
  bonusConsideration: 1,
  bonusHistoryToConsider: 1,
  companyIncomeConsideration: 1,
  companyIncomeHistoryToConsider: 1,
  createdAt: 1,
  dividendsConsideration: 1,
  dividendsHistoryToConsider: 1,
  expensesSubtractFromIncome: 1,
  filter: 1,
  fortuneReturnsRatio: 1,
  incomeConsiderationType: 1,
  investmentIncomeConsideration: 1,
  maxBorrowRatio: 1,
  maxIncomeRatio: 1,
  maxIncomeRatioTight: 1,
  minCash: 1,
  name: 1,
  order: 1,
  pdfComments: 1,
  pensionIncomeConsideration: 1,
  realEstateIncomeConsiderationType: 1,
  theoreticalInterestRate: 1,
  theoreticalInterestRate2ndRank: 1,
  theoreticalMaintenanceRate: 1,
  updatedAt: 1,
});

// //
// // Loan fragments
// //
export const loan = () => ({
  additionalDocuments: { id: 1, label: 1, requiredByAdmin: 1 },
  applicationType: 1,
  borrowerIds: 1,
  borrowers: { firstName: 1, lastName: 1, name: 1 },
  canton: 1,
  createdAt: 1,
  currentOwner: 1,
  customName: 1,
  enableOffers: 1,
  futureOwner: 1,
  hasProProperty: 1,
  hasPromotion: 1,
  name: 1,
  otherOwner: 1,
  previousLender: 1,
  previousLoanTranches: 1,
  promotions: {
    name: 1,
    address: 1,
    contacts: 1,
    type: 1,
    users: { name: 1, email: 1, phoneNumber: 1 },
  },
  properties: { totalValue: 1, address1: 1 },
  propertyIds: 1,
  purchaseType: 1,
  residenceType: 1,
  selectedStructure: 1,
  status: 1,
  step: 1,
  structure: 1,
  structures: 1,
  updatedAt: 1,
  userId: 1,
  verificationStatus: 1,
  shareSolvency: 1,
});

export const loanBase = () => ({
  ...loan(),
  promotionOptions: loanPromotionOption(),
});

const userPropertyValue = { borrowRatio: 1, propertyValue: 1 };
const adminPropertyValue = { ...userPropertyValue, organisationName: 1 };
const userMaxPropertyValue = {
  main: { min: userPropertyValue, max: userPropertyValue },
  second: { min: userPropertyValue, max: userPropertyValue },
  canton: 1,
  date: 1,
  borrowerHash: 1,
};
const adminMaxPropertyValue = {
  main: { min: adminPropertyValue, max: adminPropertyValue },
  second: { min: adminPropertyValue, max: adminPropertyValue },
  canton: 1,
  date: 1,
  borrowerHash: 1,
};

export const userLoan = ({ withSort, withFilteredPromotions } = {}) => ({
  ...loanBase(),
  adminValidation: 1,
  borrowers: loanBorrower({ withSort }),
  contacts: 1,
  displayWelcomeScreen: 1,
  documents: 1,
  offers: fullOffer(),
  properties: userProperty({ withSort }),
  user: appUser(),
  userFormsEnabled: 1,
  maxPropertyValue: userMaxPropertyValue,
  ...(withFilteredPromotions
    ? {
      promotions: {
        address: 1,
        contacts: 1,
        documents: { promotionImage: 1 },
        name: 1,
        status: 1,
        users: {
          _id: 1,
          name: 1,
          email: 1,
          phoneNumber: 1,
          organisations: { users: { title: 1 } },
        },
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
  displayWelcomeScreen: 1,
  lenders: adminLender(),
  maxPropertyValue: adminMaxPropertyValue,
  properties: adminProperty({ withSort }),
  revenues: fullRevenues(),
  signingDate: 1,
  status: 1,
});

export const adminLoans = () => ({
  ...loanBase(),
  borrowers: { name: 1 },
  closingDate: 1,
  properties: { totalValue: 1, address1: 1 },
  signingDate: 1,
  status: 1,
  user: { assignedEmployee: { email: 1 }, name: 1 },
});

export const proLoans = () => ({
  createdAt: 1,
  name: 1,
  status: 1,
  promotions: { name: 1, users: { _id: 1 }, status: 1 },
  promotionLinks: 1,
  promotionOptions: {
    name: 1,
    status: 1,
    promotionLots: { attributedTo: { user: { _id: 1 } } },
    solvency: 1,
    value: 1,
  },
  loanProgress: 1,
  user: {
    name: 1,
    phoneNumbers: 1,
    email: 1,
    referredByUser: { name: 1, organisations: { name: 1 } },
    referredByOrganisation: { name: 1 },
  },
  hasPromotion: 1,
  hasProProperty: 1,
  properties: { address1: 1, category: 1, users: { _id: 1 }, totalValue: 1 },
  structure: 1,
  maxPropertyValue: userMaxPropertyValue,
  residenceType: 1,
  shareSolvency: 1,
});

export const sideNavLoan = () => ({
  ...loanBase(),
  status: 1,
  user: { assignedEmployee: { email: 1 }, name: 1 },
});

// //
// // MortgageNote fragments
// //
export const mortgageNote = () => ({
  canton: 1,
  category: 1,
  rank: 1,
  type: 1,
  value: 1,
});

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
    loan: {
      status: 1,
      name: 1,
      user: { name: 1, assignedEmployee: { email: 1, name: 1 } },
      borrowers: { name: 1 },
    },
    contact: { name: 1, email: 1 },
    organisation: { name: 1, lenderRules: lenderRules() },
  },
  loanId: 1,
  maxAmount: 1,
  organisation: 1,
  user: simpleUser(),
  createdAt: 1,
  withCounterparts: 1,
  enableOffer: 1,
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
  contacts: { title: 1, email: 1, name: 1 },
  features: 1,
  logo: 1,
  name: 1,
  type: 1,
  zipCode: 1,
  tags: 1,
  users: { _id: 1 },
});

export const fullOrganisation = () => ({
  ...baseOrganisation(),
  commissionRate: 1,
  commissionRates: 1,
  contacts: contact(),
  documents: 1,
  generatedRevenues: 1,
  lenderRules: lenderRules(),
  lenders: lender(),
  offers: fullOffer(),
  users: organisationUser(),
});

export const userOrganisation = () => ({
  logo: 1,
  name: 1,
  lenderRules: lenderRules(),
});

// //
// // PromotionLot fragments
// //
export const proPromotionLot = () => ({
  attributedTo: { user: { name: 1 } },
  createdAt: 1,
  documents: 1,
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
  documents: 1,
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
  canton: 1,
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
  canton: 1,
  createdAt: 1,
  custom: 1,
  loan: {
    name: 1,
    solvency: 1,
    user: { phoneNumbers: 1, name: 1, email: 1 },
    promotions: { users: { _id: 1 } },
    promotionOptions: {
      name: 1,
      promotionLots: { attributedTo: { user: { _id: 1 } } },
      solvency: 1,
    },
    loanProgress: 1,
  },
  lots: { name: 1, type: 1, description: 1 },
  priority: 1,
  solvency: 1,
  updatedAt: 1,
  promotion: { users: { _id: 1 } },
  promotionLots: { _id: 1 },
});

export const appPromotionOption = () => ({
  attributedToMe: 1,
  canton: 1,
  createdAt: 1,
  custom: 1,
  lots: { description: 1, name: 1, type: 1, value: 1 },
  promotionLots: appPromotionLot(),
  priority: 1,
  solvency: 1,
  updatedAt: 1,
});

export const loanPromotionOption = () => ({
  attributedToMe: 1,
  canton: 1,
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
  documents: 1,
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
  users: {
    name: 1,
    email: 1,
    roles: 1,
    phoneNumber: 1,
    organisations: { name: 1 },
  },
  zipCode: 1,
});

export const proPromotion = ({ withFilteredLoan } = {}) => ({
  ...basePromotion(),
  assignedEmployee: { name: 1, email: 1 },
  assignedEmployeeId: 1,
  promotionLots: {
    attributedTo: { user: { name: 1 } },
    lots: { name: 1, value: 1, type: 1, description: 1, status: 1 },
    name: 1,
    promotionOptions: { _id: 1 },
    properties: promotionProperty(),
    reducedStatus: 1,
    status: 1,
    value: 1,
    promotion: { _id: 1 },
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
  promotionLots: { attributedTo: { user: { name: 1 } }, promotion: { _id: 1 } },
});

export const adminPromotions = proPromotion;

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
  address: 1,
  address1: 1,
  address2: 1,
  canton: 1,
  city: 1,
  externalId: 1,
  externalUrl: 1,
  imageUrls: 1,
  insideArea: 1,
  promotion: { name: 1 },
  propertyType: 1,
  status: 1,
  totalValue: 1,
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
  constructionValue: 1,
  constructionYear: 1,
  copropertyPercentage: 1,
  createdAt: 1,
  customFields: 1,
  description: 1,
  documents: 1,
  flatType: 1,
  floorNumber: 1,
  gardenArea: 1,
  houseType: 1,
  investmentRent: 1,
  isCoproperty: 1,
  isNew: 1,
  landArea: 1,
  landValue: 1,
  latitude: 1,
  loans: loanBase(),
  longitude: 1,
  additionalMargin: 1,
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
  totalValue: 1,
  updatedAt: 1,
  user: appUser(),
  users: { _id: 1 },
  volume: 1,
  volumeNorm: 1,
  ...(withSort ? { $options: { sort: { createdAt: 1 } } } : {}),
});

export const adminProperty = ({ withSort } = {}) => ({
  ...fullProperty({ withSort }),
  useOpenGraph: 1,
  valuation: adminValuation(),
});

export const promotionProperty = () => ({
  additionalMargin: 1,
  address: 1,
  bathroomCount: 1,
  canton: 1,
  constructionValue: 1,
  description: 1,
  gardenArea: 1,
  insideArea: 1,
  landValue: 1,
  monthlyExpenses: 1,
  name: 1,
  propertyType: 1,
  roomCount: 1,
  terraceArea: 1,
  totalValue: 1,
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
  totalValue: 1,
  zipCode: 1,
});

export const userProperty = ({ withSort } = {}) => ({
  ...fullProperty({ withSort }),
  valuation: userValuation(),
});

export const proPropertySummary = () => ({
  address1: 1,
  city: 1,
  status: 1,
  totalValue: 1,
  loans: { _id: 1 },
});

export const proProperty = ({ withSort } = {}) => ({
  ...fullProperty({ withSort }),
  useOpenGraph: 1,
  users: { name: 1, organisations: { name: 1 }, email: 1, phoneNumber: 1 },
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
  phoneNumber: 1,
  roles: 1,
});

export const organisationUser = () => ({
  ...simpleUser(),
  organisations: baseOrganisation(),
});

export const fullUser = () => ({
  ...simpleUser(),
  apiPublicKey: 1,
  assignedEmployee: simpleUser(),
  createdAt: 1,
  emails: 1,
  loans: loanBase(),
  updatedAt: 1,
  organisations: fullOrganisation(),
});

export const adminUser = () => ({
  ...fullUser(),
  assignedEmployee: simpleUser(),
  promotions: { name: 1, status: 1 },
  proProperties: { address1: 1, status: 1 },
  referredByUser: { name: 1, organisations: { name: 1 } },
  referredByOrganisation: { name: 1 },
});

export const appUser = () => ({
  ...fullUser(),
  assignedEmployee: simpleUser(),
  borrowers: { name: 1 },
  loans: {
    borrowers: { _id: 1, name: 1 },
    step: 1,
    name: 1,
    purchaseType: 1,
    customName: 1,
  },
  properties: { _id: 1 },
});

export const proUser = () => ({
  ...fullUser(),
  assignedEmployee: simpleUser(),
  promotions: { _id: 1, name: 1, permissions: 1, status: 1, users: { _id: 1 } },
  properties: { _id: 1 },
  proProperties: {
    _id: 1,
    address1: 1,
    permissions: 1,
    status: 1,
    users: { _id: 1 },
  },
});

// //
// // Revenues fragments
// //
export const fullRevenues = () => ({
  status: 1,
  createdAt: 1,
  type: 1,
  description: 1,
  amount: 1,
  approximation: 1,
  organisationLinks: 1,
  organisations: { name: 1 },
});
