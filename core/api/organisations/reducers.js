import addressReducer from '../reducers/addressReducer';
import Organisations from './organisations';
import { fullOfferFragment } from '../offers/queries/offerFragments';

Organisations.addReducers({
  ...addressReducer,
  offers: {
    body: {
      lenders: { offers: fullOfferFragment },
    },
    reduce: ({ lenders }) =>
      lenders.reduce(
        (offers, lender) => [...offers, ...lender.offers.map(offer => offer)],
        [],
      ) || [],
  },
});
