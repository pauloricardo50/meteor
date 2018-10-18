import Loans from '../loans';
import filesReducer from '../../reducers/filesReducer';

Loans.addReducers({
  ...filesReducer,
  promotionProgress: {
    body: {},
    reduce: () => ({ info: 0, documents: 0, verified: false }),
  },
});
