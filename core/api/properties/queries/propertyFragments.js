import { loanSummary } from '../../loans/queries/loanFragments';

export const userValuation = {
  min: 1,
  max: 1,
  status: 1,
  error: 1,
  date: 1,
  microlocation: 1,
};

export const adminValuation = {
  ...userValuation,
  value: 1,
};

export const property = {
  address1: 1,
  address2: 1,
  city: 1,
  zipCode: 1,
  value: 1,
  status: 1,
  propertyType: 1,
  residenceType: 1,
  houseType: 1,
  flatType: 1,
  numberOfFloors: 1,
  floorNumber: 1,
  insideArea: 1,
  areaNorm: 1,
  volume: 1,
  volumeNorm: 1,
  roomCount: 1,
  landArea: 1,
  parking: {
    inside: 1,
    outside: 1,
  },
  minergie: 1,
  constructionYear: 1,
  renovationYear: 1,
  terraceArea: 1,
  investmentRent: 1,
  createdAt: 1,
  qualityProfile: {
    condition: 1,
    standard: 1,
  },
  isCoproperty: 1,
  isNew: 1,
  copropertyPercentage: 1,
  name: 1,
  latitude: 1,
  longitude: 1,
  customFields: 1,
  monhtlyExpenses: 1,
  pictures: 1,
  documents: 1,
  adminValidation: 1,
  user: {
    emails: 1,
    assignedEmployee: { emails: 1 },
  },
  // fields used in LoanSummary component
  loans: loanSummary,
};

export const userPropertyFragment = {
  ...property,
  valuation: userValuation,
};

export const adminPropertyFragment = {
  ...property,
  valuation: adminValuation,
};
