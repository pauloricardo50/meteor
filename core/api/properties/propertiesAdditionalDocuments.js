import { DOCUMENTS } from '../files/fileConstants';
import * as propertyConstants from './propertyConstants';

export const initialDocuments = [
  { id: DOCUMENTS.PURCHASE_CONTRACT },
  { id: DOCUMENTS.LAND_REGISTER_EXTRACT },
  { id: DOCUMENTS.PROPERTY_MARKETING_BROCHURE },
  { id: DOCUMENTS.PROPERTY_PICTURES },
  { id: DOCUMENTS.PROPERTY_PLANS },
  { id: DOCUMENTS.FIRE_AND_WATER_INSURANCE },
];

export const conditionalDocuments = [
  {
    id: DOCUMENTS.PROPERTY_WORKS_QUOTE,
    condition: ({ doc: { renovationYear } }) => !!renovationYear,
  },
  {
    id: DOCUMENTS.INVESTMENT_PROPERTY_CONDOMINIUM_REGULATION,
    condition: ({ doc: { isCoproperty } }) => !!isCoproperty,
  },
  {
    id: DOCUMENTS.INVESTMENT_PROPERTY_CONDOMINIUM_OWNERSHIP_DIVISION_REGISTER,
    condition: ({ doc: { isCoproperty, propertyType } }) =>
      [
        propertyConstants.PROPERTY_TYPE.FLAT,
        propertyConstants.PROPERTY_TYPE.INVESTMENT_BUILDING,
      ].includes(propertyType) && isCoproperty,
  },
  {
    id: DOCUMENTS.PROPERTY_PURCHASE_DEED,
    condition: ({ doc: { propertyType } }) =>
      propertyType === propertyConstants.PROPERTY_TYPE.INVESTMENT_BUILDING,
  },
  {
    id: DOCUMENTS.INVESTEMENT_PROPERTY_RENTAL_STATEMENT,
    condition: ({ doc: { propertyType } }) =>
      propertyType === propertyConstants.PROPERTY_TYPE.INVESTMENT_BUILDING,
  },
  {
    id: DOCUMENTS.PROPERTY_RENTAL_AGREEMENT,
    condition: ({ doc: { propertyType, isNew } }) =>
      propertyType === propertyConstants.PROPERTY_TYPE.INVESTMENT_BUILDING &&
      !isNew,
  },
  {
    id: DOCUMENTS.PROPERTY_RENTAL_PROJECT,
    condition: ({ doc: { propertyType, isNew } }) =>
      propertyType === propertyConstants.PROPERTY_TYPE.INVESTMENT_BUILDING &&
      isNew,
  },
  {
    id: DOCUMENTS.PROPERTY_VOLUME,
    condition: ({ doc: { propertyType, isNew } }) =>
      propertyType === propertyConstants.PROPERTY_TYPE.HOUSE && isNew,
  },
  {
    id: DOCUMENTS.PROPERTY_MINERGIE_CERTIFICATE,
    condition: ({ doc: { minergie } }) =>
      minergie !== propertyConstants.MINERGIE_CERTIFICATE.WITHOUT_CERTIFICATE,
  },
];
