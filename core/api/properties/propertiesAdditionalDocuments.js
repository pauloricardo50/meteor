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
    condition: ({ doc: { propertyType } }) =>
      propertyType === propertyConstants.PROPERTY_TYPE.HOUSE,
  },
  {
    id: DOCUMENTS.PROPERTY_MINERGIE_CERTIFICATE,
    condition: ({ doc: { minergie } }) =>
      minergie !== propertyConstants.MINERGIE_CERTIFICATE.WITHOUT_CERTIFICATE,
  },
  {
    id: DOCUMENTS.COOWNERSHIP_AGREEMENT,
    condition: ({ doc: { isCoproperty } }) => isCoproperty === true,
  },
  {
    id: DOCUMENTS.COOWNERSHIP_ALLOCATION_AGREEMENT,
    condition: ({ doc: { isCoproperty } }) => isCoproperty === true,
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
];
