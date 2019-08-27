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
import { MORTGAGE_NOTES_COLLECTION } from './mortgageNotes/mortgageNoteConstants';
import { CONTACTS_COLLECTION } from './contacts/contactsConstants';
import { LENDERS_COLLECTION } from './lenders/lenderConstants';
import { LENDER_RULES_COLLECTION } from './lenderRules/lenderRulesConstants';
import { REVENUES_COLLECTION } from './revenues/revenueConstants';

export * from './borrowers/borrowerConstants';
export * from './contacts/contactsConstants';
export * from './email/emailConstants';
export * from './files/fileConstants';
export * from './helpers/sharedSchemaConstants';
export * from './interestRates/interestRatesConstants';
export * from './irs10y/irs10yConstants';
export * from './lenderRules/lenderRulesConstants';
export * from './lenders/lenderConstants';
export * from './loans/loanConstants';
export * from './lots/lotConstants';
export * from './mortgageNotes/mortgageNoteConstants';
export * from './offers/offerConstants';
export * from './organisations/organisationConstants';
export * from './pdf/pdfConstants';
export * from './promotionLots/promotionLotConstants';
export * from './promotionOptions/promotionOptionConstants';
export * from './promotions/promotionConstants';
export * from './properties/propertyConstants';
export * from './revenues/revenueConstants';
export * from './security/constants';
export * from './tasks/taskConstants';
export * from './updateWatchers/updateWatcherConstants';
export * from './users/userConstants';

export const SUCCESS = 'SUCCESS';
export const WARNING = 'WARNING';
export const ERROR = 'ERROR';

// Preserve order, as we sometimes loop over these, and the most common
// collections should come first
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
  MORTGAGE_NOTES_COLLECTION,
  CONTACTS_COLLECTION,
  LENDERS_COLLECTION,
  LENDER_RULES_COLLECTION,
  REVENUES_COLLECTION,
};
