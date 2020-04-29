import { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import {
  compose,
  shouldUpdate,
  withProps,
  withReducer,
  withState,
} from 'recompose';

import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import { withFileViewer } from 'core/containers/FileViewerContext';

import {
  filterReducer as insuranceRequestsFilterReducer,
  getInitialOptions as insuranceRequestsGetInitialOptions,
} from '../../pages/BoardPage/InsuranceRequestBoard/insuranceRequestBoardHelpers';
import {
  filterReducer as loansFilterReducer,
  getInitialOptions as loansGetInitialOptions,
} from '../../pages/BoardPage/LoanBoard/loanBoardHelpers';

const loanBoardContainer = compose(
  withState('activateLoanBoardSync', 'setActivateLoanBoardSync', false),
  withReducer(
    'loanBoardOptions',
    'loanBoardDispatch',
    loansFilterReducer,
    loansGetInitialOptions,
  ),
  withReducer(
    'insuranceRequestBoardOptions',
    'insuranceRequestBoardDispatch',
    insuranceRequestsFilterReducer,
    insuranceRequestsGetInitialOptions,
  ),
);

export default compose(
  withFileViewer,
  shouldUpdate(() => false),
  withState('openSearch', 'setOpenSearch', false),
  withProps(() => {
    // It is needed for "getInitialOptions"
    const currentUser = useContext(CurrentUserContext);
    return { currentUser };
  }),
  loanBoardContainer,
  withRouter, // history is not properly reactive if we don't add this HOC here, but depend on the props being passed from above
);
