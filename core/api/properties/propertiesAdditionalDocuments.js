import { DOCUMENTS } from '../files/fileConstants';
import * as propertyConstants from './propertyConstants';
import { RESIDENCE_TYPE } from '../constants';
import Loans from '../loans';

export const initialDocuments = [
  { id: DOCUMENTS.PURCHASE_CONTRACT },
  { id: DOCUMENTS.LAND_REGISTER_EXTRACT },
  { id: DOCUMENTS.PROPERTY_MARKETING_BROCHURE },
  { id: DOCUMENTS.PROPERTY_PICTURES },
  { id: DOCUMENTS.PROPERTY_PLANS },
  { id: DOCUMENTS.FIRE_AND_WATER_INSURANCE },
];

const getLoanResidenceType = (propertyId) => {
  // If a property is shared among multiple loans, this may work in unexpected ways,
  // since each of those properties could have a different residenceType
  const loan = Loans.findOne(
    { propertyIds: propertyId },
    { fields: { residenceType: 1 }, sort: { createdAt: 1 } },
  );
  return loan && loan.residenceType;
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
    condition: ({ doc: { _id: propertyId } }) =>
      getLoanResidenceType(propertyId) === RESIDENCE_TYPE.INVESTMENT,
  },
  {
    id: DOCUMENTS.INVESTEMENT_PROPERTY_SERVICE_CHARGE_SETTLEMENT,
    condition: ({ doc: { _id: propertyId } }) =>
      getLoanResidenceType(propertyId) === RESIDENCE_TYPE.INVESTMENT,
  },
];
