import SlackService from './slack/SlackService';

import 'core/fixtures/fixtureMethods';

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
import BorrowerService from './borrowers/BorrowerService';
import LoanService from './loans/LoanService';
import LotService from './lots/LotService';
import OfferService from './offers/OfferService';
import PromotionLotService from './promotionLots/PromotionLotService';
import PromotionOptionService from './promotionOptions/PromotionOptionService';
import PromotionService from './promotions/PromotionService';
import PropertyService from './properties/PropertyService';
import TaskService from './tasks/TaskService';
import InterestRatesService from './interestRates/InterestRatesService';
import UserService from './users/UserService';
import Irs10yService from './irs10y/Irs10yService';
import PartnerService from './partners/PartnerService';

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
  [COLLECTIONS.PARTNERS_COLLECTION]: PartnerService,
};
