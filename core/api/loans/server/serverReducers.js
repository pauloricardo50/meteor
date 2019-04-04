import merge from 'lodash/merge';
import omit from 'lodash/omit';

import filesReducer from '../../reducers/filesReducer';
import Calculator from '../../../utils/Calculator';
import Loans from '../loans';
import assigneeReducer from '../../reducers/assigneeReducer';
import { userLoan } from '../../fragments';

const body = merge(
  {},
  omit(userLoan(), [
    'maxPropertyValue',
    'offers',
    'promotions',
    'user',
    'promotionOptions',
  ]),
  {
    documents: 1,
    borrowers: {
      documents: 1,
    },
    properties: {
      documents: 1,
    },
  },
);

Loans.addReducers({
  ...filesReducer,
  ...assigneeReducer(),
  loanProgress: {
    body,
    reduce: loan => ({
      info: Calculator.personalInfoPercent({ loan }),
      documents: Calculator.filesProgress({ loan }).percent,
      verificationStatus: loan.verificationStatus,
    }),
  },
});
