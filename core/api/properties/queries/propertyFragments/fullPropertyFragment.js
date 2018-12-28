import merge from 'lodash/merge';

import { propertySummaryFragment } from './propertyFragments';
import loanBaseFragment from '../../../loans/queries/loanFragments/loanBaseFragment';
import { mortgageNoteFragment } from '../../../mortgageNotes/queries/mortgageNoteFragments';
import appUserFragment from '../../../users/queries/userFragments/appUserFragment';

export default {
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
