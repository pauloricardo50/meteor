import { loanBaseFragment } from '../../loans/queries/loanFragments';
import { appUserFragment } from '../../users/queries/userFragments';

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
  city: 1,
  insideArea: 1,
  propertyType: 1,
  status: 1,
  value: 1,
  zipCode: 1,
  $options: { sort: { createdAt: 1 } },
};

export const fullPropertyFragment = {
  ...propertySummaryFragment,
  adminValidation: 1,
  areaNorm: 1,
  constructionYear: 1,
  copropertyPercentage: 1,
  createdAt: 1,
  customFields: 1,
  flatType: 1,
  floorNumber: 1,
  houseType: 1,
  investmentRent: 1,
  isCoproperty: 1,
  isNew: 1,
  landArea: 1,
  latitude: 1,
  loans: loanBaseFragment,
  longitude: 1,
  minergie: 1,
  monthlyExpenses: 1,
  name: 1,
  numberOfFloors: 1,
  parking: 1,
  pictures: 1,
  qualityProfile: 1,
  renovationYear: 1,
  residenceType: 1,
  roomCount: 1,
  terraceArea: 1,
  user: appUserFragment,
  volume: 1,
  volumeNorm: 1,
};

export const userPropertyFragment = {
  ...fullPropertyFragment,
  valuation: userValuation,
};

export const adminPropertyFragment = {
  ...fullPropertyFragment,
  valuation: adminValuation,
};

export const sideNavPropertyFragment = {
  address1: 1,
  city: 1,
  createdAt: 1,
  updatedAt: 1,
  user: { assignedEmployee: { email: 1 } },
  value: 1,
  zipCode: 1,
};
