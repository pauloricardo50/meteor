import { PROMOTIONS_COLLECTION } from '../promotions/promotionConstants';
import {
  PROPERTIES_COLLECTION,
  PROPERTY_CATEGORY,
} from '../properties/propertyConstants';
import mainAssigneeReducer from '../reducers/mainAssigneeReducer';
import nextDueTaskReducer from '../reducers/nextDueTaskReducer';
import proNotesReducer from '../reducers/proNotesReducer';
import { STEPS, STEP_ORDER } from './loanConstants';
import Loans from '.';

Loans.addReducers({
  structure: {
    body: { structureCache: 1 },
    reduce: ({ structureCache }) => structureCache,
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
        .map(p => ({ ...p, _collection: PROPERTIES_COLLECTION })),
      ...promotions.map(p => ({ ...p, _collection: PROMOTIONS_COLLECTION })),
    ],
  },
  proNotes: proNotesReducer,
  mainAssignee: mainAssigneeReducer,
  mainAssigneeLink: {
    body: { assigneeLinks: 1 },
    reduce: ({ assigneeLinks = [] }) =>
      assigneeLinks.find(({ isMain }) => isMain),
  },
  promotionInvitedBy: {
    body: { promotionLinks: 1 },
    reduce: ({ promotionLinks }) => promotionLinks?.[0]?.invitedBy,
  },
});
