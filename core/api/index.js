// @flow
import { Meteor } from 'meteor/meteor';

import * as _constants from './constants';
import LoanSchema from './loans/schemas/LoanSchema';
import PromotionOptionSchema from './promotionOptions/schemas/PromotionOptionSchema';
import BorrowerSchema from './borrowers/schemas/BorrowerSchema';
import PropertySchema from './properties/schemas/PropertySchema';
import { TasksSchema } from './tasks/tasks';
import PromotionSchema from './promotions/schemas/PromotionSchema';
import LotSchema from './lots/schemas/LotSchema';
import { OfferSchema } from './offers/offers';
import PromotionLotSchema from './promotionLots/schemas/PromotionLotSchema';
import { OrganisationSchema } from './organisations/organisations';
import { UserSchema } from './users/users';
import InterestRatesSchema from './interestRates/schemas/interestRatesSchema';
import Irs10ySchema from './irs10y/schemas/irs10ySchema';
import MortgageNoteSchema from './mortgageNotes/schemas/MortgageNoteSchema';

export { default as Borrowers } from './borrowers';
export { default as Loans } from './loans';
export { default as Lots } from './lots';
export { default as Offers } from './offers';
export { default as Organisations } from './organisations';
export { default as PromotionLots } from './promotionLots';
export { default as PromotionOptions } from './promotionOptions';
export { default as Promotions } from './promotions';
export { default as Properties } from './properties';
export { default as Tasks } from './tasks';
export { default as Users } from './users';
export { default as InterestRates } from './interestRates';
export { default as Irs10y } from './irs10y';
export { default as MortgageNotes } from './mortgageNotes';

export { default as SecurityService } from './security';
export * from './methods';
export * from './helpers';
export * from './containerToolkit';
export * from './types';

// Do this for autocompletion...
export const constants = _constants;
export const schemas = {
  [constants.BORROWERS_COLLECTION]: BorrowerSchema,
  [constants.LOANS_COLLECTION]: LoanSchema,
  [constants.LOTS_COLLECTION]: LotSchema,
  [constants.OFFERS_COLLECTION]: OfferSchema,
  [constants.PROMOTION_LOTS_COLLECTION]: PromotionLotSchema,
  [constants.PROMOTION_OPTIONS_COLLECTION]: PromotionOptionSchema,
  [constants.PROMOTIONS_COLLECTION]: PromotionSchema,
  [constants.PROPERTIES_COLLECTION]: PropertySchema,
  [constants.TASKS_COLLECTION]: TasksSchema,
  [constants.ORGANISATIONS_COLLECTION]: OrganisationSchema,
  [constants.USERS_COLLECTION]: UserSchema,
  [constants.INTEREST_RATES_COLLECTION]: InterestRatesSchema,
  [constants.IRS10Y_COLLECTION]: Irs10ySchema,
  [constants.MORTGAGE_NOTES_COLLECTION]: MortgageNoteSchema,
};

Meteor.isStaging = Meteor.settings.public.environment === 'staging';
