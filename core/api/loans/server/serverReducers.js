import merge from 'lodash/merge';

import filesReducer from '../../reducers/filesReducer';
import Calculator from '../../../utils/Calculator';
import { userLoanFragment } from '../queries/loanFragments';
import Loans from '../loans';
import assigneeReducer from '../../reducers/assigneeReducer';

const body = merge({}, userLoanFragment, {
  documents: 1,
  borrowers: {
    documents: 1,
  },
  properties: {
    documents: 1,
  },
});

Loans.addReducers({
  ...filesReducer,
  ...assigneeReducer(),
  promotionProgress: {
    body,
    reduce: loan => ({
      info: Calculator.personalInfoPercent({ loan }),
      documents: Calculator.filesProgress({ loan }).percent,
      verificationStatus: loan.verificationStatus,
    }),
  },
});
