//      
import { ACTIVITIES_COLLECTION } from './activities/activityConstants';
import { ANALYSIS_REPORTS_COLLECTION } from './analysisReports/analysisReportConstants';
import { BORROWERS_COLLECTION } from './borrowers/borrowerConstants';
import { CONTACTS_COLLECTION } from './contacts/contactsConstants';
import { INTEREST_RATES_COLLECTION } from './interestRates/interestRatesConstants';
import { IRS10Y_COLLECTION } from './irs10y/irs10yConstants';
import { LENDER_RULES_COLLECTION } from './lenderRules/lenderRulesConstants';
import { LENDERS_COLLECTION } from './lenders/lenderConstants';
import { LOANS_COLLECTION } from './loans/loanConstants';
import { LOTS_COLLECTION } from './lots/lotConstants';
import { MORTGAGE_NOTES_COLLECTION } from './mortgageNotes/mortgageNoteConstants';
import { OFFERS_COLLECTION } from './offers/offerConstants';
import { ORGANISATIONS_COLLECTION } from './organisations/organisationConstants';
import { PROMOTION_LOTS_COLLECTION } from './promotionLots/promotionLotConstants';
import { PROMOTION_OPTIONS_COLLECTION } from './promotionOptions/promotionOptionConstants';
import { PROMOTIONS_COLLECTION } from './promotions/promotionConstants';
import { PROPERTIES_COLLECTION } from './properties/propertyConstants';
import { REVENUES_COLLECTION } from './revenues/revenueConstants';
import { SESSIONS_COLLECTION } from './sessions/sessionConstants';
import { TASKS_COLLECTION } from './tasks/taskConstants';
import { UPDATE_WATCHERS_COLLECTION } from './updateWatchers/updateWatcherConstants';
import { USERS_COLLECTION } from './users/userConstants';

export * from './activities/activityConstants';
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
export * from './sessions/sessionConstants';
export * from './tasks/taskConstants';
export * from './updateWatchers/updateWatcherConstants';
export * from './users/userConstants';

export const SUCCESS = 'SUCCESS';
export const WARNING = 'WARNING';
export const ERROR = 'ERROR';

export const COLLECTIONS = {
  ACTIVITIES_COLLECTION,
  ANALYSIS_REPORTS_COLLECTION,
  BORROWERS_COLLECTION,
  CONTACTS_COLLECTION,
  INTEREST_RATES_COLLECTION,
  IRS10Y_COLLECTION,
  LENDER_RULES_COLLECTION,
  LENDERS_COLLECTION,
  LOANS_COLLECTION,
  LOTS_COLLECTION,
  MORTGAGE_NOTES_COLLECTION,
  OFFERS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  PROMOTION_LOTS_COLLECTION,
  PROMOTION_OPTIONS_COLLECTION,
  PROMOTIONS_COLLECTION,
  PROPERTIES_COLLECTION,
  REVENUES_COLLECTION,
  SESSIONS_COLLECTION,
  TASKS_COLLECTION,
  UPDATE_WATCHERS_COLLECTION,
  USERS_COLLECTION,
};
