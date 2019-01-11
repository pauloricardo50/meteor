import addressReducer from '../reducers/addressReducer';
import Organisations from './organisations';
import { fullOffer } from '../fragments';

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
});
