import merge from 'lodash/merge';

import filesReducer from '../../reducers/filesReducer';
import Calculator from '../../../utils/Calculator';
import deepOmit from '../../../utils/deepOmit';
import { userLoanFragment } from '../queries/loanFragments';
import Loans from '../loans';

const body = merge({}, userLoanFragment, {
  documents: 1,
  borrowers: {
    documents: 1,
  },
  properties: {
    documents: 1,
  },
});

// // Do this because the fragments come with $options objects, which causes
// // problems with reducers: https://github.com/cult-of-coders/grapher/issues/304
// const bodyWithoutOptions = deepOmit(body, ['$options']);

Loans.addReducers({
  ...filesReducer,
  promotionProgress: {
    body,
    reduce: loan => ({
      info: Calculator.personalInfoPercent({ loan }),
      documents: Calculator.filesProgress({ loan }).percent,
      verificationStatus: loan.verificationStatus,
    }),
  },
});
