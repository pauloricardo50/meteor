import Loans from '../loans';
import filesReducer from '../../reducers/filesReducer';

Loans.addReducers({
  ...filesReducer,
  promotionProgress: {
    body: { verificationStatus: 1 },
    reduce: ({ verificationStatus }) => ({
      info: 0,
      documents: 0,
      verificationStatus,
    }),
  },
});
