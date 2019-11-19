// @flow
import { useContext } from 'react';
import {
  compose,
  shouldUpdate,
  withState,
  withReducer,
  withProps,
} from 'recompose';
import { withRouter } from 'react-router-dom';

import { withFileViewer } from 'core/containers/FileViewerContext';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import { filterReducer, getInitialOptions } from './adminLayoutHelpers';

export default compose(
  withFileViewer,
  shouldUpdate(() => false),
  withState('openSearch', 'setOpenSearch', false),
  withState('activateLoanBoardSync', 'setActivateLoanBoardSync', false),
  withProps(() => {
    // It is needed for "getInitialOptions"
    const currentUser = useContext(CurrentUserContext);
    return { currentUser };
  }),
  withReducer(
    'loanBoardOptions',
    'loanBoardDispatch',
    filterReducer,
    getInitialOptions,
  ),
  withRouter, // history is not properly reactive if we don't add this HOC here, but depend on the props being passed from above
);
