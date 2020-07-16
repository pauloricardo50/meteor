import { withRouter } from 'react-router-dom';
import {
  compose,
  shouldUpdate,
  withProps,
  withReducer,
  withState,
} from 'recompose';

import { withFileViewer } from 'core/containers/FileViewerContext';
import useCurrentUser from 'core/hooks/useCurrentUser';

import { AdminsProvider } from '../../components/AdminsContext/AdminsContext';
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
  AdminsProvider,
  shouldUpdate(() => false),
  withState('openSearch', 'setOpenSearch', false),
  withProps(() => {
    // It is needed for "getInitialOptions"
    const currentUser = useCurrentUser();
    return { currentUser };
  }),
  loanBoardContainer,
  withRouter, // history is not properly reactive if we don't add this HOC here, but depend on the props being passed from above
);
