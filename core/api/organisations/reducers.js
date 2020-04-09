import { fullOffer } from '../fragments';
import addressReducer from '../reducers/addressReducer';
import Organisations from './organisations';

Organisations.addReducers({
  ...addressReducer,
  offers: {
    body: {
      lenders: { offers: fullOffer() },
    },
    reduce: ({ lenders = [] }) =>
      lenders.reduce(
        (allOffers, { offers = [] }) => [...allOffers, ...offers],
        [],
      ),
  },
  offerCount: {
    body: {
      lenders: { offers: { _id: 1 } },
    },
    reduce: ({ lenders = [] }) =>
      lenders.reduce((tot, { offers = [] }) => tot + offers.length, 0),
  },
});
