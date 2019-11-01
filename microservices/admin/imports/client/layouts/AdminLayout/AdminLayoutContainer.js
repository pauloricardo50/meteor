// @flow
import { compose, shouldUpdate, withState, withReducer } from 'recompose';
import { currentUser } from 'core/api/users/queries';
import { withSmartQuery } from 'core/api/containerToolkit';
import { withFileViewer } from 'core/containers/FileViewerContext';
import { injectCurrentUser } from 'core/containers/CurrentUserContext';
import { withRouter } from 'react-router-dom';
import { filterReducer, getInitialOptions } from './adminLayoutHelpers';


export default compose(
  withFileViewer,
  shouldUpdate(() => false),
  withSmartQuery({
    query: currentUser,
    params: () => ({
      $body: {
        email: 1,
        emails: 1,
        name: 1,
        organisations: { name: 1 },
        roles: 1,
      },
    }),
    queryOptions: { reactive: true, single: true },
    dataName: 'currentUser',
    renderMissingDoc: false,
  }),
  injectCurrentUser,
  withState('openSearch', 'setOpenSearch', false),
  withState('activateLoanBoardSync', 'setActivateLoanBoardSync', false),
  withReducer('loanBoardOptions', 'loanBoardDispatch', filterReducer, getInitialOptions),
  withRouter, // history is not properly reactive if we don't add this HOC here, but depend on the props being passed from above
);
