import { Meteor } from 'meteor/meteor';
import '../initialization';

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

import { COLLECTIONS } from '../constants';
import BorrowerService from '../borrowers/server/BorrowerService';
import ContactService from '../contacts/server/ContactService';
import InterestRatesService from '../interestRates/server/InterestRatesService';
import Irs10yService from '../irs10y/server/Irs10yService';
import LenderService from '../lenders/server/LenderService';
import LoanService from '../loans/server/LoanService';
import LotService from '../lots/server/LotService';
import MortgageNoteService from '../mortgageNotes/server/MortgageNoteService';
import OfferService from '../offers/server/OfferService';
import PromotionLotService from '../promotionLots/server/PromotionLotService';
import PromotionOptionService from '../promotionOptions/server/PromotionOptionService';
import PromotionService from '../promotions/server/PromotionService';
import PropertyService from '../properties/server/PropertyService';
import TaskService from '../tasks/server/TaskService';
import UserService from '../users/server/UserService';
import SlackService from '../slack/server/SlackService';
import LenderRulesService from '../lenderRules/server/LenderRulesService';
import RevenueService from '../revenues/server/RevenueService';
import OrganisationService from '../organisations/server/OrganisationService';
import '../liveSync';

process.on('uncaughtException', error => {
  if (!Meteor.isProduction) {
    console.log('uncaughtException error', JSON.stringify(error, null, 2));
  }
  SlackService.sendError({
    error,
    additionalData: ['Server uncaughtException'],
  });
  process.exit(1);
});

process.on('unhandledRejection', error => {
  if (!Meteor.isProduction) {
    console.log('unhandledRejection error', JSON.stringify(error, null, 2));
  }
  SlackService.sendError({
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
};
