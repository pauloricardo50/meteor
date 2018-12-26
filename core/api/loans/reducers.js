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
      offers: 1,
    },
    reduce: formatLoanWithStructure,
  },
  offers: {
    body: {
      lenders: { offers: omit(fullOfferFragment, ['user']) },
    },
    reduce: ({ lenders = [] }) =>
      lenders.reduce(
        (allOffers, { offers = [] }) => [...allOffers, ...offers],
        [],
      ),
  },
  hasPromotion: {
    body: { promotions: { _id: 1 } },
    reduce: ({ promotions }) => promotions && promotions.length > 0,
  },
  enableOffers: {
    body: { logic: 1 },
    reduce: ({ logic }) => {
      const step = logic && logic.step;
      return (
        step
        && STEP_ORDER.indexOf(step) >= STEP_ORDER.indexOf(STEPS.FIND_LENDER)
      );
    },
  },
});
