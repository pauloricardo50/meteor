import omit from 'lodash/omit';
import Loans from '.';
import { userPropertyFragment } from '../properties/queries/propertyFragments';
import { fullOfferFragment } from '../offers/queries/offerFragments';
import { formatLoanWithStructure } from '../../utils/loanFunctions';
import { STEPS, STEP_ORDER } from './loanConstants';

Loans.addReducers({
  structure: {
    body: {
      selectedStructure: 1,
      structures: 1,
      properties: omit(userPropertyFragment, ['loans', '$options', 'user']),
      offers: omit(fullOfferFragment, ['loans', '$options', 'user']),
    },
    reduce: formatLoanWithStructure,
  },
  hasPromotion: {
    body: { promotions: { _id: 1 } },
    reduce: ({ promotions }) => promotions && promotions.length > 0,
  },
  enableOffers: {
    body: { logic: { step: 1 } },
    reduce: ({ logic: { step } }) =>
      STEP_ORDER.indexOf(step) >= STEP_ORDER.indexOf(STEPS.FIND_LENDER),
  },
});
