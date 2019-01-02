import { INTEREST_RATES } from '../../interestRatesConstants';

//
// borrower fragments
//
export const baseBorrower = {
  firstName: 1,
  lastName: 1,
  name: 1,
  createdAt: 1,
  updatedAt: 1,
  userId: 1,
  $options: { sort: { createdAt: 1 } },
};

export const loanBorrower = {
  ...baseBorrower,
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
  mortgageNotes: mortgageNote,
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
};

export const sideNavBorrower = {
  ...baseBorrower,
  user: { assignedEmployee: { email: 1 } },
  loans: { name: 1 },
};

//
// Contact fragments
//
export const contact = {
  firstName: 1,
  lastName: 1,
  name: 1,
  address: 1,
  zipCode: 1,
  address1: 1,
  address2: 1,
  city: 1,
  canton: 1,
  phoneNumbers: 1,
  phoneNumber: 1,
  emails: 1,
  email: 1,
  organisations: { name: 1, _id: 1, address: 1 },
};

//
// InterestRate fragments
//
const singleInterestRate = type => ({
  [type]: { rateLow: 1, rateHigh: 1, trend: 1 },
});

const ratess = Object.values(INTEREST_RATES).reduce(
  (interestRates, type) => ({
    ...interestRates,
    ...singleInterestRate(type),
  }),
  {},
);

export const interestRates = {
  createdAt: 1,
  updatedAt: 1,
  date: 1,
  ...ratess,
};

export const currentInterestRates = {
  date: 1,
  ...ratess,
};

//
// Irs10Y fragments
//
export const irs10y = {
  date: 1,
  rate: 1,
};

//
// Lender fragments
//
export const lender = {
  organisation: {
    address: 1,
    address1: 1,
    address2: 1,
    canton: 1,
    city: 1,
    contacts: contact,
    logo: 1,
    name: 1,
    type: 1,
    zipCode: 1,
  },
  contact,
  loan: { _id: 1 },
  offers: fullOffer,
};

export const adminLender = {
  ...lender,
  status: 1,
};

//
// Loan fragments
//
export const loan = {
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
};

export const loanBase = {
  ...loan,
  promotionOptions: {
    promotionLots: {
      name: 1,
      status: 1,
      reducedStatus: 1,
      value: 1,
      properties: userProperty,
    },
    name: 1,
    custom: 1,
    attributedToMe: 1,
    priority: 1,
    promotion: 1,
    value: 1,
    solvency: 1,
  },
};

export const adminLoan = {
  ...userLoan,
  closingDate: 1,
  lenders: adminLender,
  properties: adminProperty,
  signingDate: 1,
  status: 1,
};

export const userLoan = {
  ...loanBase,
  adminValidation: 1,
  borrowers: loanBorrower,
  contacts: 1,
  offers: fullOffer,
  properties: userProperty,
  user: appUser,
  userFormsEnabled: 1,
};

export const adminLoans = {
  ...loanBase,
  borrowers: { name: 1 },
  closingDate: 1,
  properties: { value: 1, address1: 1 },
  signingDate: 1,
  status: 1,
  user: { assignedEmployee: { email: 1 }, name: 1 },
};

export const proLoans = {
  name: 1,
  user: { name: 1, phoneNumbers: 1, email: 1 },
  promotionProgress: 1,
  promotionLinks: 1,
  promotionOptions: {
    name: 1,
    status: 1,
    promotionLots: { _id: 1, attributedTo: { user: { _id: 1 } } },
    solvency: 1,
  },
  promotions: { _id: 1, users: { _id: 1 }, status: 1 },
  createdAt: 1,
};

export const sideNavLoan = {
  ...loanBase,
  status: 1,
  user: { assignedEmployee: { email: 1 }, name: 1 },
};

//
// MortgageNote fragments
//
export const mortgageNote = {
  value: 1,
  rank: 1,
  type: 1,
  category: 1,
  canton: 1,
};

//
// Offer fragments
//
export const fullOffer = {
  amortizationGoal: 1,
  amortizationYears: 1,
  conditions: 1,
  epotekFees: 1,
  feedback: 1,
  ...Object.values(INTEREST_RATES).reduce(
    (rates, rate) => ({ ...rates, [rate]: 1 }),
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
  user: simpleUser,
};

//
// Organisation fragments
//
export const baseOrganisation = {
  address: 1,
  address1: 1,
  address2: 1,
  canton: 1,
  city: 1,
  contacts: { _id: 1, role: 1, email: 1, name: 1 },
  logo: 1,
  name: 1,
  type: 1,
  features: 1,
  zipCode: 1,
};

export const fullOrganisation = {
  ...baseOrganisation,
  contacts: contact,
  lenders: lender,
  offers: fullOffer,
};

//
// PromotionLot fragments
//
export const proPromotionLot = {
  _id: 1,
  createdAt: 1,
  updatedAt: 1,
  value: 1,
  status: 1,
  lots: {
    name: 1,
    value: 1,
    type: 1,
    description: 1,
  },
  properties: propertyPromotion,
  promotionOptions: { _id: 1 },
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
  name: 1,
  attributedTo: {
    user: { name: 1 },
  },
};

export const appPromotionLot = {
  _id: 1,
  createdAt: 1,
  updatedAt: 1,
  value: 1,
  status: 1,
  reducedStatus: 1,
  lots: {
    name: 1,
    value: 1,
    type: 1,
    description: 1,
  },
  properties: propertyPromotion,
  name: 1,
  attributedTo: {
    user: { _id: 1 },
  },
  promotion: { name: 1, status: 1 },
};

//
// PromotionOption fragments
//
export const fullPromotionOption = {
  createdAt: 1,
  updatedAt: 1,
  promotionLots: { name: 1, promotion: { name: 1 } },
  lots: { name: 1, type: 1, status: 1, description: 1 },
  loan: { name: 1 },
  priority: 1,
  custom: 1,
  solvency: 1,
};

export const proPromotionOption = {
  createdAt: 1,
  updatedAt: 1,
  loan: {
    solvency: 1,
    user: { phoneNumbers: 1, name: 1, email: 1 },
    promotions: { _id: 1 },
    promotionOptions: {
      name: 1,
      promotionLots: {
        _id: 1,
        attributedTo: { user: { _id: 1 } },
      },
      solvency: 1,
    },
    promotionProgress: 1,
  },
  lots: { name: 1, type: 1, description: 1 },
  priority: 1,
  custom: 1,
  solvency: 1,
};

export const appPromotionOption = {
  createdAt: 1,
  updatedAt: 1,
  custom: 1,
  lots: {
    name: 1,
    type: 1,
    description: 1,
    value: 1,
  },
  promotionLots: appPromotionLot,
  priority: 1,
  attributedToMe: 1,
  solvency: 1,
};

//
// Promotion fragments
//
export const basePromotion = {
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
  properties: propertyPromotion,
  soldPromotionLots: 1,
  status: 1,
  type: 1,
  updatedAt: 1,
  users: { _id: 1, name: 1, email: 1, roles: 1 },
  zipCode: 1,
};

export const proPromotion = {
  ...basePromotion,
  promotionLots: {
    _id: 1,
    value: 1,
    status: 1,
    reducedStatus: 1,
    lots: { name: 1, value: 1, type: 1, description: 1, status: 1 },
    properties: propertyPromotion,
    promotionOptions: { _id: 1 },
    name: 1,
    attributedTo: { user: { name: 1 } },
  },
  assignedEmployee: { name: 1, email: 1 },
  assignedEmployeeId: 1,
};

export const proPromotions = {
  ...basePromotion,
};

export const adminPromotions = {
  ...proPromotion,
};

export const searchPromotions = {
  createdAt: 1,
  updatedAt: 1,
  name: 1,
  promotionLotLinks: 1,
};

//
// Property fragments
//
export const userValuation = {
  date: 1,
  error: 1,
  max: 1,
  microlocation: 1,
  min: 1,
  status: 1,
};

export const adminValuation = {
  ...userValuation,
  value: 1,
};

export const propertySummary = {
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
};

export const fullProperty = {
  ...propertySummary,
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
  // residenceType is required for the valuation
  loans: loanBase,
  longitude: 1,
  minergie: 1,
  monthlyExpenses: 1,
  mortgageNotes: mortgageNote,
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
  user: appUser,
  volume: 1,
  volumeNorm: 1,
};

export const adminProperty = {
  ...fullProperty,
  valuation: adminValuation,
};

export const promotionProperty = {
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
};

export const sideNavProperty = {
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
};

export const userProperty = {
  ...fullProperty,
  valuation: userValuation,
};

//
// Task fragments
//
export const baseTask = {
  createdAt: 1,
  dueAt: 1,
  completedAt: 1,
  status: 1,
  title: 1,
  type: 1,
  updatedAt: 1,
  userId: 1,
  fileKey: 1,
  relatedDoc: 1,
  $options: { sort: { createdAt: -1 } },
};

export const task = {
  ...baseTask,
  assignedEmployeeId: 1,
  assignedEmployee: simpleUser,
  borrower: { ...baseBorrower, user: { assignedEmployeeId: 1 } },
  loan: { name: 1, user: { assignedEmployeeId: 1 } },
  property: { address1: 1, user: { assignedEmployeeId: 1 } },
  user: simpleUser,
};

//
// User fragments
//
export const simpleUser = {
  email: 1,
  emails: 1,
  name: 1,
  firstName: 1,
  lastName: 1,
  phoneNumbers: 1,
  roles: 1,
};

export const adminUser = {
  ...fullUser,
  assignedEmployee: simpleUser,
};

export const appUser = {
  ...fullUser,
  assignedEmployee: simpleUser,
  loans: {
    _id: 1,
    name: 1,
    borrowers: { _id: 1 },
    purchaseType: 1,
    logic: { step: 1 },
  },
  borrowers: { _id: 1, name: 1 },
  properties: { _id: 1 },
};

export const fullUser = {
  ...simpleUser,
  assignedEmployee: simpleUser,
  emails: 1,
  createdAt: 1,
  updatedAt: 1,
  loans: {
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
    promotionOptions: {
      promotionLots: {
        name: 1,
        status: 1,
        reducedStatus: 1,
        value: 1,
        properties: userProperty,
      },
      name: 1,
      custom: 1,
      attributedToMe: 1,
      priority: 1,
      promotion: 1,
      value: 1,
      solvency: 1,
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
  },
  apiToken: 1,
};

export const proUser = {
  ...fullUser,
  assignedEmployee: simpleUser,
};
