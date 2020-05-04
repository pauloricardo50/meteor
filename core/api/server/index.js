import '../initialization';
import '../../utils/server/initialization';
import '../../fixtures/server/fixtureMethods';
import '../users/server/accounts-server-config';
import '../methods/server';
import '../methods';
import '../factories';
import '../files/server/methods';
import '../files/server/meteor-slingshot-server';
import '../email/server';
import '../events/server/registerServerListeners';
import '../links';
import '../reducers/registerReducers';
import './grapher-live';
import './hooks';
import '../queries/server';
import './reducers';
import './mongoIndexes';
import './caches';
import './serverCollections';

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import BorrowerService from '../borrowers/server/BorrowerService';
import CommissionRateService from '../commissionRates/server/CommissionRateService';
import ContactService from '../contacts/server/ContactService';
import ErrorLogger from '../errorLogger/server/ErrorLogger';
import InsuranceProductService from '../insuranceProducts/server/InsuranceProductService';
import InsuranceRequestService from '../insuranceRequests/server/InsuranceRequestService';
import InsuranceService from '../insurances/server/InsuranceService';
import InterestRatesService from '../interestRates/server/InterestRatesService';
import Irs10yService from '../irs10y/server/Irs10yService';
import LenderRulesService from '../lenderRules/server/LenderRulesService';
import LenderService from '../lenders/server/LenderService';
import LoanService from '../loans/server/LoanService';
import LotService from '../lots/server/LotService';
import MortgageNoteService from '../mortgageNotes/server/MortgageNoteService';
import OfferService from '../offers/server/OfferService';
import OrganisationService from '../organisations/server/OrganisationService';
import PromotionLotService from '../promotionLots/server/PromotionLotService';
import PromotionOptionService from '../promotionOptions/server/PromotionOptionService';
import PromotionService from '../promotions/server/PromotionService';
import PropertyService from '../properties/server/PropertyService';
import RevenueService from '../revenues/server/RevenueService';
import TaskService from '../tasks/server/TaskService';
import UserService from '../users/server/UserService';
import { COLLECTIONS } from './serverConstants';

process.on('uncaughtException', error => {
  if (!Meteor.isProduction) {
    console.log('uncaughtException error', JSON.stringify(error, null, 2));
  }
  ErrorLogger.handleError({
    error,
    additionalData: ['Server uncaughtException'],
  });
  process.exit(1);
});

process.on('unhandledRejection', error => {
  if (!Meteor.isProduction) {
    console.log('unhandledRejection error', JSON.stringify(error, null, 2));
  }
  ErrorLogger.handleError({
    error,
    additionalData: ['Server unhandledRejection'],
  });
});

export const Services = {
  [COLLECTIONS.LOANS_COLLECTION]: LoanService,
  [COLLECTIONS.PROPERTIES_COLLECTION]: PropertyService,
  [COLLECTIONS.BORROWERS_COLLECTION]: BorrowerService,
  [COLLECTIONS.LOTS_COLLECTION]: LotService,
  [COLLECTIONS.OFFERS_COLLECTION]: OfferService,
  [COLLECTIONS.ORGANISATIONS_COLLECTION]: OrganisationService,
  [COLLECTIONS.PROMOTION_LOTS_COLLECTION]: PromotionLotService,
  [COLLECTIONS.PROMOTIONS_COLLECTION]: PromotionService,
  [COLLECTIONS.PROMOTION_OPTIONS_COLLECTION]: PromotionOptionService,
  [COLLECTIONS.USERS_COLLECTION]: UserService,
  [COLLECTIONS.TASKS_COLLECTION]: TaskService,
  [COLLECTIONS.INTEREST_RATES_COLLECTION]: InterestRatesService,
  [COLLECTIONS.IRS10Y_COLLECTION]: Irs10yService,
  [COLLECTIONS.MORTGAGE_NOTES_COLLECTION]: MortgageNoteService,
  [COLLECTIONS.CONTACTS_COLLECTION]: ContactService,
  [COLLECTIONS.LENDERS_COLLECTION]: LenderService,
  [COLLECTIONS.LENDER_RULES_COLLECTION]: LenderRulesService,
  [COLLECTIONS.REVENUES_COLLECTION]: RevenueService,
  [COLLECTIONS.INSURANCE_REQUESTS_COLLECTION]: InsuranceRequestService,
  [COLLECTIONS.INSURANCES_COLLECTION]: InsuranceService,
  [COLLECTIONS.INSURANCE_PRODUCTS_COLLECTION]: InsuranceProductService,
  [COLLECTIONS.COMMISSION_RATES_COLLECTION]: CommissionRateService,
};

Meteor.startup(() => {
  Roles._forwardMigrate();
});
