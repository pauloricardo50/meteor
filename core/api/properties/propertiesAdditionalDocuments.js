import { DOCUMENTS } from '../files/fileConstants';
import { PURCHASE_TYPE } from '../loans/loanConstants';
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
    fieldsToWatch: ['renovationYear'],
  },
  {
    id: DOCUMENTS.INVESTMENT_PROPERTY_CONDOMINIUM_REGULATION,
    condition: ({ doc: { isCoproperty } }) => !!isCoproperty,
    fieldsToWatch: ['isCoproperty'],
  },
  {
    id: DOCUMENTS.INVESTMENT_PROPERTY_CONDOMINIUM_OWNERSHIP_DIVISION_REGISTER,
    condition: ({ doc: { isCoproperty, propertyType } }) =>
      [
        propertyConstants.PROPERTY_TYPE.FLAT,
        propertyConstants.PROPERTY_TYPE.INVESTMENT_BUILDING,
      ].includes(propertyType) && isCoproperty,
    fieldsToWatch: ['isCoproperty', 'propertyType'],
  },
  {
    id: DOCUMENTS.PROPERTY_PURCHASE_DEED,
    condition: ({ doc: { propertyType } }) =>
      propertyType === propertyConstants.PROPERTY_TYPE.INVESTMENT_BUILDING,
    fieldsToWatch: ['propertyType'],
  },
  {
    id: DOCUMENTS.INVESTEMENT_PROPERTY_RENTAL_STATEMENT,
    condition: ({ doc: { propertyType } }) =>
      propertyType === propertyConstants.PROPERTY_TYPE.INVESTMENT_BUILDING,
    fieldsToWatch: ['propertyType'],
  },
  {
    id: DOCUMENTS.PROPERTY_RENTAL_AGREEMENT,
    condition: ({ doc: { propertyType, isNew } }) =>
      propertyType === propertyConstants.PROPERTY_TYPE.INVESTMENT_BUILDING &&
      !isNew,
    fieldsToWatch: ['isNew', 'propertyType'],
  },
  {
    id: DOCUMENTS.PROPERTY_RENTAL_PROJECT,
    condition: ({ doc: { propertyType, isNew } }) =>
      propertyType === propertyConstants.PROPERTY_TYPE.INVESTMENT_BUILDING &&
      isNew,
    fieldsToWatch: ['isNew', 'propertyType'],
  },
  {
    id: DOCUMENTS.PROPERTY_VOLUME,
    condition: ({ doc: { propertyType, isNew } }) =>
      propertyType === propertyConstants.PROPERTY_TYPE.HOUSE && isNew,
    fieldsToWatch: ['isNew', 'propertyType'],
  },
  {
    id: DOCUMENTS.PROPERTY_MINERGIE_CERTIFICATE,
    condition: ({ doc: { minergie } }) =>
      minergie !== propertyConstants.MINERGIE_CERTIFICATE.WITHOUT_CERTIFICATE,
    fieldsToWatch: ['minergie'],
  },
  // Conditional documents updated with loan changes
  {
    id: DOCUMENTS.PROPERTY_LAST_INTERESTS_SCHEDULE,
    condition: ({ doc: { purchaseType } }) =>
      purchaseType === PURCHASE_TYPE.REFINANCING,
    requireOtherCollectionDoc: true,
    fieldsToWatch: ['purchaseType'],
  },
  {
    id: DOCUMENTS.PROPERTY_CURRENT_MORTGAGE,
    condition: ({ doc: { purchaseType } }) =>
      purchaseType === PURCHASE_TYPE.REFINANCING,
    requireOtherCollectionDoc: true,
    fieldsToWatch: ['purchaseType'],
  },
  {
    id: DOCUMENTS.HEATER_TYPE,
    condition: ({ doc: { purchaseType } }) =>
      purchaseType === PURCHASE_TYPE.REFINANCING,
    requireOtherCollectionDoc: true,
    fieldsToWatch: ['purchaseType'],
  },
  {
    id: DOCUMENTS.REIMBURSEMENT_PENALTIES,
    condition: ({ doc: { purchaseType } }) =>
      purchaseType === PURCHASE_TYPE.REFINANCING,
    requireOtherCollectionDoc: true,
    fieldsToWatch: ['purchaseType'],
  },
];
