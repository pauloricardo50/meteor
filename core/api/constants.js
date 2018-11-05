// @flow
import { LOANS_COLLECTION } from './loans/loanConstants';
import { BORROWERS_COLLECTION } from './borrowers/borrowerConstants';
import { PROPERTIES_COLLECTION } from './properties/propertyConstants';
import { PROMOTIONS_COLLECTION } from './promotions/promotionConstants';
import { LOTS_COLLECTION } from './lots/lotConstants';
import { PROMOTION_OPTIONS_COLLECTION } from './promotionOptions/promotionOptionConstants';
import { PROMOTION_LOTS_COLLECTION } from './promotionLots/promotionLotConstants';
import { TASKS_COLLECTION } from './tasks/taskConstants';
import { OFFERS_COLLECTION } from './offers/offerConstants';

export * from './borrowers/borrowerConstants';
export * from './files/fileConstants';
export * from './interestRates/interestRatesConstants';
export * from './loans/loanConstants';
export * from './lots/lotConstants';
export * from './offers/offerConstants';
export * from './PDFGenerator/pdfGeneratorConstants';
export * from './promotionLots/promotionLotConstants';
export * from './promotionOptions/promotionOptionConstants';
export * from './promotions/promotionConstants';
export * from './properties/propertyConstants';
export * from './tasks/taskConstants';
export * from './users/userConstants';
export * from './wuest/wuestConstants';
export * from './security/constants';

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
};
