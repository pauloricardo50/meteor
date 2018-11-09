import { DOCUMENTS } from '../files/fileConstants';
import * as propertyConstants from './propertyConstants';
import { RESIDENCE_TYPE } from '../constants';
import Loans from '../loans/loans';

export const initialDocuments = [
  { id: DOCUMENTS.PURCHASE_CONTRACT },
  { id: DOCUMENTS.LAND_REGISTER_EXTRACT },
  { id: DOCUMENTS.PROPERTY_MARKETING_BROCHURE },
  { id: DOCUMENTS.PROPERTY_PICTURES },
  { id: DOCUMENTS.PROPERTY_PLANS },
  { id: DOCUMENTS.FIRE_AND_WATER_INSURANCE },
];

const getLoanResidenceType = ({ propertyId, userId }) => {
  const loan = Loans.findOne({ userId, propertyIds: { $in: [propertyId] } });
  return loan && loan.general.residenceType;
};

export const conditionalDocuments = [
  {
    id: DOCUMENTS.PROPERTY_VOLUME,
    relatedFields: ['propertyType'],
    condition: ({ context }) =>
      context.field('propertyType').value
      === propertyConstants.PROPERTY_TYPE.HOUSE,
  },
  {
    id: DOCUMENTS.COOWNERSHIP_AGREEMENT,
    relatedFields: ['isCoproperty'],
    condition: ({ context }) => context.field('isCoproperty').value === true,
  },
  {
    id: DOCUMENTS.COOWNERSHIP_ALLOCATION_AGREEMENT,
    relatedFields: ['isCoproperty'],
    condition: ({ context }) => context.field('isCoproperty').value === true,
  },
  {
    id: DOCUMENTS.INVESTEMENT_PROPERTY_RENTAL_STATEMENT,
    condition: ({ doc: { _id: propertyId, userId } }) =>
      getLoanResidenceType({ propertyId, userId })
      === RESIDENCE_TYPE.INVESTMENT,
  },
  {
    id: DOCUMENTS.INVESTEMENT_PROPERTY_SERVICE_CHARGE_SETTLEMENT,
    condition: ({ doc: { _id: propertyId, userId } }) =>
      getLoanResidenceType({ propertyId, userId })
      === RESIDENCE_TYPE.INVESTMENT,
  },
  {
    id: DOCUMENTS.INVESTEMENT_PROPERTY_WORKS_HISTORY,
    condition: ({ doc: { _id: propertyId, userId } }) =>
      getLoanResidenceType({ propertyId, userId })
      === RESIDENCE_TYPE.INVESTMENT,
  },
  {
    id: DOCUMENTS.INVESTMENT_PROPERTY_CONDOMINIUM_OWNERSHIP_DIVISION_REGISTER,
    condition: ({ doc: { _id: propertyId, userId }, context }) =>
      getLoanResidenceType({ propertyId, userId })
        === RESIDENCE_TYPE.INVESTMENT
      && context.field('propertyType').value
        === propertyConstants.PROPERTY_TYPE.FLAT,
  },
  {
    id: DOCUMENTS.INVESTMENT_PROPERTY_CONDOMINIUM_REGULATION,
    condition: ({ doc: { _id: propertyId, userId }, context }) =>
      getLoanResidenceType({ propertyId, userId })
        === RESIDENCE_TYPE.INVESTMENT
      && context.field('propertyType').value
        === propertyConstants.PROPERTY_TYPE.FLAT,
  },
];
