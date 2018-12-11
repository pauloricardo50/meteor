// @flow
import { BORROWERS_COLLECTION } from './borrowers/borrowerConstants';
import { LOANS_COLLECTION } from './loans/loanConstants';
import { LOTS_COLLECTION } from './lots/lotConstants';
import { OFFERS_COLLECTION } from './offers/offerConstants';
import { ORGANISATIONS_COLLECTION } from './organisations/organisationConstants';
import { PROMOTION_LOTS_COLLECTION } from './promotionLots/promotionLotConstants';
import { PROMOTION_OPTIONS_COLLECTION } from './promotionOptions/promotionOptionConstants';
import { PROMOTIONS_COLLECTION } from './promotions/promotionConstants';
import { PROPERTIES_COLLECTION } from './properties/propertyConstants';
import { TASKS_COLLECTION } from './tasks/taskConstants';
import { USERS_COLLECTION } from './users/userConstants';
import { INTEREST_RATES_COLLECTION } from './interestRates/interestRatesConstants';
import { IRS10Y_COLLECTION } from './irs10y/irs10yConstants';
import { CONTACTS_COLLECTION } from './contacts/contactsConstants';

export * from './borrowers/borrowerConstants';
export * from './files/fileConstants';
export * from './interestRates/interestRatesConstants';
export * from './loans/loanConstants';
export * from './lots/lotConstants';
export * from './offers/offerConstants';
export * from './organisations/organisationConstants';
export * from './PDFGenerator/pdfGeneratorConstants';
export * from './promotionLots/promotionLotConstants';
export * from './promotionOptions/promotionOptionConstants';
export * from './promotions/promotionConstants';
export * from './properties/propertyConstants';
export * from './tasks/taskConstants';
export * from './users/userConstants';
export * from './wuest/wuestConstants';
export * from './security/constants';
export * from './irs10y/irs10yConstants';
export * from './contacts/contactsConstants';

export const SUCCESS = 'SUCCESS';
export const WARNING = 'WARNING';
export const ERROR = 'ERROR';
export const COLLECTIONS = {
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
  PROMOTIONS_COLLECTION,
  LOTS_COLLECTION,
  PROMOTION_OPTIONS_COLLECTION,
  PROMOTION_LOTS_COLLECTION,
  TASKS_COLLECTION,
  OFFERS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  USERS_COLLECTION,
  INTEREST_RATES_COLLECTION,
  IRS10Y_COLLECTION,
  CONTACTS_COLLECTION,
};
