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
import LoanService from './loans/LoanService';
import PropertyService from './properties/PropertyService';
import BorrowerService from './borrowers/BorrowerService';
import LotService from './lots/LotService';
import OfferService from './offers/OfferService';
import PromotionLotService from './promotionLots/PromotionLotService';
import PromotionService from './promotions/PromotionService';
import UserService from './users/UserService';
import TaskService from './tasks/TaskService';

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
  [COLLECTIONS.USERS_COLLECTION]: UserService,
  [COLLECTIONS.TASKS_COLLECTION]: TaskService,
};
