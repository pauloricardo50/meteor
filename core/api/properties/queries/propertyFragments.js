import merge from 'lodash/merge';
import { mortgageNoteFragment } from 'imports/core/api/mortgageNotes/queries/mortgageNoteFragments/index';
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
  canton: 1,
  city: 1,
  insideArea: 1,
  promotion: { name: 1 },
  propertyType: 1,
  status: 1,
  userId: 1,
  value: 1,
  zipCode: 1,
  $options: { sort: { createdAt: 1 } },
};

export const propertyPromotionFragment = {
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
  loans: merge({}, loanBaseFragment),
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
  loans: { name: 1 },
  name: 1,
  promotion: { name: 1 },
  updatedAt: 1,
  user: { assignedEmployee: { email: 1 } },
  value: 1,
  zipCode: 1,
};
