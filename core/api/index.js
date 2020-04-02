import './initialization';
import { Meteor } from 'meteor/meteor';

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
export { default as Contacts } from './contacts';
export { default as Lenders } from './lenders';
export { default as LenderRules } from './lenderRules';
export { default as Revenues } from './revenues';
export { default as Activities } from './activities';
export { default as Sessions } from './sessions';
export { default as InsuranceRequests } from './insuranceRequests';
export { default as Insurances } from './insurances';
export { default as InsuranceProducts } from './insuranceProducts';
export { default as CommissionRates } from './commissionRates';
export { default as Notifications } from './notifications';

export * from './helpers';
export * from './methods';

Meteor.isStaging = Meteor.settings.public.environment === 'staging';
Meteor.isDevEnvironment =
  Meteor.settings.public.environment === 'dev-production';
