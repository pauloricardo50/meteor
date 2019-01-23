import omit from 'lodash/omit';
import Loans from '.';
import { formatLoanWithStructure } from '../../utils/loanFunctions';
import { STEPS, STEP_ORDER } from './loanConstants';
import { fullOffer, userProperty } from '../fragments';

Loans.addReducers({
  structure: {
    body: {
      selectedStructure: 1,
      structures: 1,
      properties: omit(userProperty(), ['loans', '$options', 'user']),
      offers: 1,
    },
    reduce: formatLoanWithStructure,
  },
  offers: {
    body: {
      lenders: { offers: omit(fullOffer(), ['user']) },
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
