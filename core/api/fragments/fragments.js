import { INTEREST_RATES } from '../../interestRatesConstants';

//
// borrower fragments
//
export const baseBorrowerFragment = {
  firstName: 1,
  lastName: 1,
  name: 1,
  createdAt: 1,
  updatedAt: 1,
  userId: 1,
  $options: { sort: { createdAt: 1 } },
};

export const loanBorrowerFragment = {
  ...baseBorrowerFragment,
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
  mortgageNotes: mortgageNoteFragment,
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

export const sideNavBorrowerFragment = {
  ...baseBorrowerFragment,
  user: { assignedEmployee: { email: 1 } },
  loans: { name: 1 },
};

//
// Contact fragments
//
export const contactFragment = {
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
const singleInterestRateFragment = type => ({
  [type]: { rateLow: 1, rateHigh: 1, trend: 1 },
});

const ratesFragments = Object.values(INTEREST_RATES).reduce(
  (interestRates, type) => ({
    ...interestRates,
    ...singleInterestRateFragment(type),
  }),
  {},
);

export const interestRatesFragment = {
  createdAt: 1,
  updatedAt: 1,
  date: 1,
  ...ratesFragments,
};

export const currentInterestRatesFragment = {
  date: 1,
  ...ratesFragments,
};

//
// Irs10Y fragments
//
export const irs10yFragment = {
  date: 1,
  rate: 1,
};

//
// Lender fragments
//
export const lenderFragment = {
  organisation: {
    address: 1,
    address1: 1,
    address2: 1,
    canton: 1,
    city: 1,
    contacts: contactFragment,
    logo: 1,
    name: 1,
    type: 1,
    zipCode: 1,
  },
  contact: contactFragment,
  loan: { _id: 1 },
  offers: fullOfferFragment,
};

export const adminLenderFragment = {
  ...lenderFragment,
  status: 1,
};

//
// Loan fragments
//
export const loanFragment = {
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

export const loanBaseFragment = {
  ...loanFragment,
  promotionOptions: {
    promotionLots: {
      name: 1,
      status: 1,
      reducedStatus: 1,
      value: 1,
      properties: userPropertyFragment,
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

export const adminLoanFragment = {
  ...userLoanFragment,
  closingDate: 1,
  lenders: adminLenderFragment,
  properties: adminPropertyFragment,
  signingDate: 1,
  status: 1,
};

export const userLoanFragment = {
  ...loanBaseFragment,
  adminValidation: 1,
  borrowers: loanBorrowerFragment,
  contacts: 1,
  offers: fullOfferFragment,
  properties: userPropertyFragment,
  user: appUserFragment,
  userFormsEnabled: 1,
};

export const adminLoansFragment = {
  ...loanBaseFragment,
  borrowers: { name: 1 },
  closingDate: 1,
  properties: { value: 1, address1: 1 },
  signingDate: 1,
  status: 1,
  user: { assignedEmployee: { email: 1 }, name: 1 },
};

export const proLoansFragment = {
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

export const sideNavLoanFragment = {
  ...loanBaseFragment,
  status: 1,
  user: { assignedEmployee: { email: 1 }, name: 1 },
};

//
// MortgageNote fragments
//
export const mortgageNoteFragment = {
  value: 1,
  rank: 1,
  type: 1,
  category: 1,
  canton: 1,
};

//
// Offer fragments
//
export const fullOfferFragment = {
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
  user: simpleUserFragment,
};

//
// Organisation fragments
//
export const baseOrganisationFragment = {
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

export const fullOrganisationFragment = {
  ...baseOrganisationFragment,
  contacts: contactFragment,
  lenders: lenderFragment,
  offers: fullOfferFragment,
};

//
// PromotionLot fragments
//
export const proPromotionLotFragment = {
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
  properties: propertyPromotionFragment,
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

export const appPromotionLotFragment = {
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
  properties: propertyPromotionFragment,
  name: 1,
  attributedTo: {
    user: { _id: 1 },
  },
  promotion: { name: 1, status: 1 },
};

//
// PromotionOption fragments
//
export const fullPromotionOptionFragment = {
  createdAt: 1,
  updatedAt: 1,
  promotionLots: { name: 1, promotion: { name: 1 } },
  lots: { name: 1, type: 1, status: 1, description: 1 },
  loan: { name: 1 },
  priority: 1,
  custom: 1,
  solvency: 1,
};

export const proPromotionOptionFragment = {
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

export const appPromotionOptionFragment = {
  createdAt: 1,
  updatedAt: 1,
  custom: 1,
  lots: {
    name: 1,
    type: 1,
    description: 1,
    value: 1,
  },
  promotionLots: appPromotionLotFragment,
  priority: 1,
  attributedToMe: 1,
  solvency: 1,
};

//
// Promotion fragments
//
export const basePromotionFragment = {
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
  properties: propertyPromotionFragment,
  soldPromotionLots: 1,
  status: 1,
  type: 1,
  updatedAt: 1,
  users: { _id: 1, name: 1, email: 1, roles: 1 },
  zipCode: 1,
};

export const proPromotionFragment = {
  ...basePromotionFragment,
  promotionLots: {
    _id: 1,
    value: 1,
    status: 1,
    reducedStatus: 1,
    lots: { name: 1, value: 1, type: 1, description: 1, status: 1 },
    properties: propertyPromotionFragment,
    promotionOptions: { _id: 1 },
    name: 1,
    attributedTo: { user: { name: 1 } },
  },
  assignedEmployee: { name: 1, email: 1 },
  assignedEmployeeId: 1,
};

export const proPromotionsFragment = {
  ...basePromotionFragment,
};

export const adminPromotionsFragment = {
  ...proPromotionFragment,
};

export const searchPromotionsFragment = {
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

export const propertySummaryFragment = {
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

export const fullPropertyFragment = {
  ...propertySummaryFragment,
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
  loans: loanBaseFragment,
  longitude: 1,
  minergie: 1,
  monthlyExpenses: 1,
  mortgageNotes: mortgageNoteFragment,
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
  user: appUserFragment,
  volume: 1,
  volumeNorm: 1,
};

export const adminPropertyFragment = {
  ...fullPropertyFragment,
  valuation: adminValuation,
};

export const promotionPropertyFragment = {
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

export const sideNavPropertyFragment = {
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

export const userPropertyFragment = {
  ...fullPropertyFragment,
  valuation: userValuation,
};

//
// Task fragments
//
export const baseTaskFragment = {
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

export const taskFragment = {
  ...baseTaskFragment,
  assignedEmployeeId: 1,
  assignedEmployee: simpleUserFragment,
  borrower: { ...baseBorrowerFragment, user: { assignedEmployeeId: 1 } },
  loan: { name: 1, user: { assignedEmployeeId: 1 } },
  property: { address1: 1, user: { assignedEmployeeId: 1 } },
  user: simpleUserFragment,
};

//
// User fragments
//
export const simpleUserFragment = {
  email: 1,
  emails: 1,
  name: 1,
  firstName: 1,
  lastName: 1,
  phoneNumbers: 1,
  roles: 1,
};

export const adminUserFragment = {
  ...fullUserFragment,
  assignedEmployee: simpleUserFragment,
};

export const appUserFragment = {
  ...fullUserFragment,
  assignedEmployee: simpleUserFragment,
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

export const fullUserFragment = {
  ...simpleUserFragment,
  assignedEmployee: simpleUserFragment,
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
        properties: userPropertyFragment,
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

export const proUserFragment = {
  ...fullUserFragment,
  assignedEmployee: simpleUserFragment,
};
