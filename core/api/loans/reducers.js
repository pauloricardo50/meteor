import omit from 'lodash/omit';
import Loans from '.';
import {
  formatLoanWithStructure,
  nextDueTaskReducer,
} from '../../utils/loanFunctions';
import { STEPS, STEP_ORDER } from './loanConstants';
import { fullOffer, userProperty, loanPromotionOption } from '../fragments';
import {
  PROPERTY_CATEGORY,
  PROPERTIES_COLLECTION,
} from '../properties/propertyConstants';
import { PROMOTIONS_COLLECTION } from '../promotions/promotionConstants';

Loans.addReducers({
  structure: {
    body: {
      selectedStructure: 1,
      structures: 1,
      properties: omit(userProperty(), ['loans', '$options', 'user']),
      offers: 1,
      promotionOptions: loanPromotionOption(),
    },
    reduce: formatLoanWithStructure,
  },
  offers: {
    body: { lenders: { offers: omit(fullOffer(), ['user']) } },
    reduce: ({ lenders = [] }) =>
      lenders.reduce(
        (allOffers, { offers = [] }) => [...allOffers, ...offers],
        [],
      ),
  },
  hasPromotion: {
    body: { promotions: { _id: 1 } },
    reduce: ({ promotions }) => !!(promotions && promotions.length > 0),
  },
  enableOffers: {
    body: { step: 1 },
    reduce: ({ step }) =>
      step && STEP_ORDER.indexOf(step) >= STEP_ORDER.indexOf(STEPS.OFFERS),
  },
  hasProProperty: {
    body: { properties: { category: 1 } },
    reduce: ({ properties = [] }) =>
      properties.some(({ category }) => category === PROPERTY_CATEGORY.PRO),
  },
  maxPropertyValueExists: {
    body: { maxPropertyValue: { date: 1 }, user: { _id: 1 } },
    reduce: ({ maxPropertyValue, user }) =>
      !!(!user && maxPropertyValue && maxPropertyValue.date),
  },
  nextDueTask: {
    body: { tasksCache: 1 },
    reduce: nextDueTaskReducer,
  },
  relatedTo: {
    body: {
      properties: { address1: 1, city: 1, zipCode: 1, category: 1 },
      promotions: { name: 1 },
    },
    reduce: ({ properties = [], promotions = [] }) => [
      ...properties
        .filter(({ category }) => category === PROPERTY_CATEGORY.PRO)
        .map(p => ({ ...p, collection: PROPERTIES_COLLECTION })),
      ...promotions.map(p => ({ ...p, collection: PROMOTIONS_COLLECTION })),
    ],
  },
});
