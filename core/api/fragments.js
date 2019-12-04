// import merge from 'lodash/merge';

import { Meteor } from 'meteor/meteor';
import { INTEREST_RATES } from './constants';

// //
// // activity fragments
// //
export const activity = () => ({
  createdAt: 1,
  createdBy: 1,
  date: 1,
  description: 1,
  loan: { name: 1 },
  shouldNotify: 1,
  title: 1,
  type: 1,
  updatedAt: 1,
  user: { name: 1, email: 1 },
  metadata: 1,
  isServerGenerated: 1,
  isImportant: 1,
});

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
  additionalDocuments: 1,
  address1: 1,
  address2: 1,
  age: 1,
  bank3A: 1,
  bankFortune: 1,
  birthDate: 1,
  birthPlace: 1,
  bonus2015: 1,
  bonus2016: 1,
  bonus2017: 1,
  bonus2018: 1,
  bonus2019: 1,
  bonusExists: 1,
  canton: 1,
  childrenCount: 1,
  citizenship: 1,
  city: 1,
  civilStatus: 1,
  company: 1,
  divorcedDate: 1,
  documents: 1,
  expenses: 1,
  gender: 1,
  hasOwnCompany: 1,
  insurance2: 1,
  insurance3A: 1,
  insurance3B: 1,
  isSwiss: 1,
  isUSPerson: 1,
  job: 1,
  loans: { name: 1 },
  marriedDate: 1,
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
  worksForOwnCompany: 1,
  worksInSwitzerlandSince: 1,
  zipCode: 1,
  country: 1,
  donation: 1,
  ...(withSort ? { $options: { sort: { createdAt: 1 } } } : {}),
});

export const adminBorrower = () => ({
  ...loanBorrower(),
  loans: loanBase(),
  user: appUser(),
});

export const fullBorrower = adminBorrower;

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
  country: 1,
});

export const fullContact = contact;

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
    country: 1,
  },
});

export const adminLender = () => {
  const lenderFragment = lender();
  return {
    ...lenderFragment,
    adminNote: 1,
    offers: adminOffer(),
    organisation: {
      ...lenderFragment.organisation,
      commissionRates: 1,
    },
    status: 1,
  };
};

// //
// // LenderRules fragments
// //
export const lenderRules = () => ({
  adminComments: 1,
  allowPledge: 1,
  amortizationGoal: 1,
  amortizationYears: 1,
  bonusAlgorithm: 1,
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
  maxBorrowRatioWithPledge: 1,
  maxIncomeRatio: 1,
  maxIncomeRatioTight: 1,
  minCash: 1,
  name: 1,
  order: 1,
  organisation: { name: 1 },
  pdfComments: 1,
  pensionIncomeConsideration: 1,
  realEstateIncomeAlgorithm: 1,
  realEstateIncomeConsideration: 1,
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
  additionalDocuments: 1,
  applicationType: 1,
  anonymous: 1,
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
    address: 1,
    canton: 1,
    contacts: 1,
    lenderOrganisationLink: 1,
    name: 1,
    type: 1,
    users: { name: 1, email: 1, phoneNumber: 1 },
  },
  properties: { totalValue: 1, address1: 1, category: 1 },
  propertyIds: 1,
  purchaseType: 1,
  residenceType: 1,
  selectedStructure: 1,
  status: 1,
  step: 1,
  structure: 1,
  structures: {
    amortization: 1,
    amortizationType: 1,
    description: 1,
    disabled: 1,
    id: 1,
    loanTranches: 1,
    mortgageNoteIds: 1,
    name: 1,
    notaryFees: 1,
    offerId: 1,
    ownFunds: 1,
    promotionOptionId: 1,
    propertyId: 1,
    propertyValue: 1,
    propertyWork: 1,
    sortOffersBy: 1,
    wantedLoan: 1,
  },
  updatedAt: 1,
  userId: 1,
  shareSolvency: 1,
  simpleBorrowersForm: 1,
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
  borrowers: loanBorrower({ withSort }),
  contacts: 1,
  displayWelcomeScreen: 1,
  documents: 1,
  offers: 1,
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
          lenderOrganisationLink: 1,
          name: 1,
          status: 1,
          type: 1,
          canton: 1,
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
  adminNotes: 1,
  category: 1,
  financedPromotion: { name: 1 },
  financedPromotionLink: 1,
  lenders: adminLender(),
  maxPropertyValue: adminMaxPropertyValue,
  nextDueTask: 1,
  proNote: 1,
  properties: adminProperty({ withSort }),
  revenues: adminRevenue(),
  status: 1,
  tasksCache: {
    createdAt: 1,
    dueAt: 1,
    status: 1,
    title: 1,
    isPrivate: 1,
    assigneeLink: 1,
  },
  user: adminUser(),
});

export const adminLoans = () => ({
  ...loanBase(),
  borrowers: { name: 1 },
  category: 1,
  properties: { totalValue: 1, address1: 1 },
  status: 1,
  user: { assignedEmployee: { email: 1 }, name: 1 },
});

export const proLoans = () => ({
  anonymous: 1,
  createdAt: 1,
  name: 1,
  status: 1,
  promotions: {
    name: 1,
    users: { _id: 1 },
    status: 1,
    lenderOrganisationLink: 1,
  },
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
    assignedEmployee: { name: 1, phoneNumbers: 1, email: 1 },
  },
  hasPromotion: 1,
  hasProProperty: 1,
  maxPropertyValue: userMaxPropertyValue,
  properties: { address1: 1, category: 1, users: { _id: 1 }, totalValue: 1 },
  relatedTo: 1,
  referralId: 1,
  referredByText: 1,
  residenceType: 1,
  shareSolvency: 1,
  structure: 1,
});

export const proLoanWithRevenues = () => ({
  anonymous: 1,
  promotionOptions: {
    value: 1,
    promotionLots: { properties: { totalValue: 1, value: 1 } },
  },
  properties: { totalValue: 1, value: 1 },
  revenues: { amount: 1 },
  selectedStructure: 1,
  status: 1,
  structures: {
    id: 1,
    propertyValue: 1,
    propertyId: 1,
    promotionOptionId: 1,
  },
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
// // Notification fragments
// //
export const notification = () => ({
  activity: activity(),
  createdAt: 1,
  readAt: 1,
  recipients: { firstName: 1, lastName: 1, name: 1 },
  relatedDoc: 1,
  task: task(),
  title: 1,
  revenue: adminRevenue(),
  updatedAt: 1,
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
      user: { name: 1, assignedEmployee: { email: 1, name: 1, firstName: 1 } },
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

export const adminOffer = () => ({
  ...fullOffer(),
  documents: 1,
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
  country: 1,
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
  offers: 1,
  offerCount: 1,
  users: organisationUser(),
});

export const userOrganisation = () => ({
  logo: 1,
  name: 1,
  lenderRules: lenderRules(),
});

export const adminOrganisation = () => ({
  ...fullOrganisation(),
  lenders: adminLender(),
  adminNote: 1,
  documents: 1,
  referredCustomers: { _id: 1 },
});

// //
// // PromotionLot fragments
// //
export const proPromotionLot = () => ({
  attributedTo: { user: { name: 1 }, promotions: { _id: 1 } },
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
    constructionTimeline: 1,
    signingDate: 1,
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
  bank: 1,
  canton: 1,
  createdAt: 1,
  reservationDeposit: 1,
  reservationDepositStatus: 1,
  documents: 1,
  loan: { name: 1 },
  lots: { name: 1, type: 1, status: 1, description: 1 },
  simpleVerification: 1,
  fullVerification: 1,
  priority: 1,
  promotionLots: { name: 1, promotion: { name: 1 } },
  reservationAgreement: 1,
  solvency: 1,
  status: 1,
  updatedAt: 1,
});

export const proPromotionOption = () => ({
  ...fullPromotionOption(),
  loan: {
    name: 1,
    solvency: 1,
    status: 1,
    user: { phoneNumbers: 1, name: 1, email: 1 },
    promotions: {
      users: { _id: 1, name: 1, organisations: { name: 1 } },
      agreementDuration: 1,
    },
    promotionOptions: {
      name: 1,
      promotionLots: { attributedTo: { user: { _id: 1 } }, status: 1 },
      solvency: 1,
      loan: { loanProgress: 1 },
    },
    loanProgress: 1,
  },
  promotion: { users: { _id: 1 }, agreementDuration: 1 },
});

export const appPromotionOption = () => ({
  attributedToMe: 1,
  bank: 1,
  canton: 1,
  createdAt: 1,
  reservationDeposit: 1,
  reservationDepositStatus: 1,
  documents: 1,
  loan: {
    user: { _id: 1 },
    promotions: { _id: 1, users: { name: 1, organisations: { name: 1 } } },
  },
  lots: { description: 1, name: 1, type: 1, value: 1 },
  simpleVerification: 1,
  fullVerification: 1,
  priority: 1,
  promotionLots: appPromotionLot(),
  reservationAgreement: 1,
  solvency: 1,
  status: 1,
  updatedAt: 1,
});

export const loanPromotionOption = () => ({
  ...appPromotionOption(),
  name: 1,
  promotion: { name: 1 },
  promotionLots: {
    name: 1,
    status: 1,
    reducedStatus: 1,
    value: 1,
    properties: promotionProperty(),
    attributedTo: { user: { _id: 1 } },
  },
  value: 1,
});

// //
// // Promotion fragments
// //
export const basePromotion = () => ({
  address: 1,
  address1: 1,
  availablePromotionLots: 1,
  agreementDuration: 1,
  reservedPromotionLots: 1,
  canton: 1,
  city: 1,
  constructionTimeline: 1,
  contacts: 1,
  createdAt: 1,
  documents: 1,
  lenderOrganisation: { name: 1, logo: 1 },
  loans: { _id: 1, createdAt: 1 },
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
    phoneNumbers: 1,
    organisations: { name: 1 },
  },
  zipCode: 1,
  signingDate: 1,
  country: 1,
});

export const proPromotion = ({ withFilteredLoan } = {}) => ({
  ...basePromotion(),
  adminNote: 1,
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
  promotionLoan: { _id: 1, name: 1 },
  authorizationStatus: 1,
  projectStatus: 1,
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
  organisation: 1,
  promotion: { name: 1 },
  propertyType: 1,
  status: 1,
  thumbnail: 1,
  totalValue: 1,
  userId: 1,
  value: 1,
  zipCode: 1,
  country: 1,
});

export const fullProperty = ({ withSort } = {}) => ({
  ...propertySummary(),
  additionalDocuments: 1,
  additionalMargin: 1,
  areaNorm: 1,
  bathroomCount: 1,
  category: 1,
  constructionValue: 1,
  constructionYear: 1,
  copropertyPercentage: 1,
  createdAt: 1,
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
  minergie: 1,
  mortgageNotes: mortgageNote(),
  name: 1,
  numberOfFloors: 1,
  parkingInside: 1,
  parkingOutside: 1,
  pictures: 1,
  promotion: { name: 1 },
  renovationYear: 1,
  residenceType: 1,
  roomCount: 1,
  terraceArea: 1,
  totalValue: 1,
  updatedAt: 1,
  user: appUser(),
  users: { _id: 1 },
  userLinks: 1,
  useOpenGraph: 1,
  volume: 1,
  volumeNorm: 1,
  yearlyExpenses: 1,
  ...(withSort ? { $options: { sort: { createdAt: 1 } } } : {}),
});

export const adminProperty = ({ withSort } = {}) => ({
  ...fullProperty({ withSort }),
  users: { name: 1, organisations: { name: 1 } },
  loanCount: 1,
  useOpenGraph: 1,
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
  mortgageNotes: mortgageNote(),
  name: 1,
  propertyType: 1,
  roomCount: 1,
  terraceArea: 1,
  totalValue: 1,
  value: 1,
  yearlyExpenses: 1,
});

export const userProperty = ({ withSort } = {}) => {
  const obj = { ...fullProperty({ withSort }) };
  delete obj.users;
  return obj;
};

export const proPropertySummary = () => ({
  address1: 1,
  city: 1,
  createdAt: 1,
  status: 1,
  totalValue: 1,
  loanCount: 1,
  country: 1,
  userLinks: 1,
  users: { name: 1 },
});

export const proProperty = ({ withSort } = {}) => ({
  ...fullProperty({ withSort }),
  loanCount: 1,
  useOpenGraph: 1,
  users: { name: 1, organisations: { name: 1 }, email: 1, phoneNumber: 1 },
});

export const apiProperty = () => ({
  externalId: 1,
  address1: 1,
  address2: 1,
  city: 1,
  zipCode: 1,
  value: 1,
  description: 1,
  propertyType: 1,
  houseType: 1,
  flatType: 1,
  roomCount: 1,
  insideArea: 1,
  landArea: 1,
  terraceArea: 1,
  constructionYear: 1,
  externalUrl: 1,
  useOpenGraph: 1,
  imageUrls: 1,
  country: 1,
  status: 1,
});

// //
// // Task fragments
// //
export const baseTask = () => ({
  completedAt: 1,
  createdAt: 1,
  dueAt: 1,
  status: 1,
  title: 1,
  description: 1,
  updatedAt: 1,
  isPrivate: 1,
  priority: 1,
});

export const task = () => ({
  ...baseTask(),
  assigneeLink: 1,
  assignee: simpleUser(),
  loan: { name: 1, borrowers: { name: 1 }, user: { name: 1 } },
  user: { name: 1 },
  promotion: { name: 1 },
  lender: { name: 1 },
  organisation: { name: 1 },
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
  isDisabled: 1,
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
  assignedEmployeeCache: 1,
  promotions: { name: 1, status: 1 },
  proProperties: { address1: 1, status: 1, loanCount: 1, totalValue: 1 },
  referredByUser: { name: 1, organisations: { name: 1 } },
  referredByOrganisation: { name: 1 },
  referredByOrganisationLink: 1,
});

export const appUser = () => ({
  ...fullUser(),
  assignedEmployee: simpleUser(),
  borrowers: { name: 1 },
  loans: {
    borrowers: { _id: 1, name: 1 },
    customName: 1,
    hasPromotion: 1,
    hasProProperty: 1,
    name: 1,
    promotions: { address: 1, name: 1, documents: 1 },
    properties: { address: 1, documents: 1 },
    purchaseType: 1,
    step: 1,
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
    city: 1,
    permissions: 1,
    status: 1,
    users: { _id: 1 },
    zipCode: 1,
  },
});

// //
// // Revenues fragments
// //
export const adminRevenue = () => ({
  amount: 1,
  createdAt: 1,
  description: 1,
  expectedAt: 1,
  loan: { name: 1, borrowers: { name: 1 }, user: { name: 1 } },
  organisationLinks: 1,
  organisations: { name: 1 },
  paidAt: 1,
  secondaryType: 1,
  sourceOrganisationLink: 1,
  sourceOrganisation: { name: 1 },
  status: 1,
  type: 1,
});

// //
// // Sessions fragments
// //
export const userSession = () => ({
  updatedAt: 1,
  isImpersonate: 1,
  lastPageVisited: 1,
  userId: 1,
  connectionId: 1,
  shared: 1,
  userIsConnected: 1,
  impersonatingAdmin: { name: 1, firstName: 1, lastName: 1 },
  followed: 1,
});
