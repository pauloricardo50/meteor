import merge from 'lodash/merge';
import omit from 'lodash/omit';

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
    'borrowers.mortgageNotes',
    'borrowers.loans',
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
  ...assigneeReducer(),
  loanProgress: {
    body,
    reduce: loan => ({
      info: Calculator.getValidFieldsRatio({ loan }),
      documents: Calculator.getValidDocumentsRatio({ loan }),
    }),
  },
});
