import addressReducer from '../reducers/addressReducer';
import Organisations from './organisations';

Organisations.addReducers({
  ...addressReducer,
  offerCount: {
    body: { lenders: { offers: { _id: 1 } } },
    reduce: ({ lenders = [] }) =>
      lenders.reduce((tot, { offers = [] }) => tot + offers.length, 0),
  },
});
