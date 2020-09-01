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

import { makeFilterReducer } from '../../components/AdminBoard/AdminBoardHelpers';
import { AdminsProvider } from '../../components/AdminsContext/AdminsContext';
import { getInitialOptions as insuranceRequestsGetInitialOptions } from '../../pages/BoardPage/InsuranceRequestBoard/insuranceRequestBoardHelpers';
import { getInitialOptions as loansGetInitialOptions } from '../../pages/BoardPage/LoanBoard/loanBoardHelpers';

const loanBoardContainer = compose(
  withState('activateLoanBoardSync', 'setActivateLoanBoardSync', false),
  withReducer(
    'loanBoardOptions',
    'loanBoardDispatch',
    makeFilterReducer(loansGetInitialOptions),
    loansGetInitialOptions,
  ),
  withReducer(
    'insuranceRequestBoardOptions',
    'insuranceRequestBoardDispatch',
    makeFilterReducer(insuranceRequestsGetInitialOptions),
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
