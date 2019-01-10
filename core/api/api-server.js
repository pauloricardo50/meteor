import './initialization';
import SlackService from './slack/SlackService';

import 'core/fixtures/server/fixtureMethods';

import './users/server/accounts-server-config';

import './methods/server';
import './methods';

import './factories';

import './files/server/methods';
import './files/server/meteor-slingshot-server';

import './email/server';

import './events/server/registerServerListeners';

import './links';
import './reducers';

import './server/grapher-live';
import './server/hooks';
import './server/queries';
import './server/reducers';
import './server/mongoIndexes';

import { COLLECTIONS } from './constants';
import BorrowerService from './borrowers/server/BorrowerService';
import ContactService from './contacts/server/ContactService';
import InterestRatesService from './interestRates/server/InterestRatesService';
import Irs10yService from './irs10y/server/Irs10yService';
import LenderService from './lenders/server/LenderService';
import LoanService from './loans/server/LoanService';
import LotService from './lots/server/LotService';
import MortgageNoteService from './mortgageNotes/server/MortgageNoteService';
import OfferService from './offers/server/OfferService';
import PromotionLotService from './promotionLots/server/PromotionLotService';
import PromotionOptionService from './promotionOptions/server/PromotionOptionService';
import PromotionService from './promotions/server/PromotionService';
import PropertyService from './properties/server/PropertyService';
import TaskService from './tasks/server/TaskService';
import UserService from './users/server/UserService';

process.on('uncaughtException', (error) => {
  SlackService.sendError({
    error,
    additionalData: ['Server uncaughtException'],
  });
});
process.on('unhandledRejection', (error) => {
  SlackService.sendError({
    error,
    additionalData: ['Server uncaughtException'],
  });
});

export const Services = {
  [COLLECTIONS.LOANS_COLLECTION]: LoanService,
  [COLLECTIONS.PROPERTIES_COLLECTION]: PropertyService,
  [COLLECTIONS.BORROWERS_COLLECTION]: BorrowerService,
  [COLLECTIONS.LOTS_COLLECTION]: LotService,
  [COLLECTIONS.OFFERS_COLLECTION]: OfferService,
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
};
