import { withRouter } from 'react-router-dom';
import { compose, withProps, withState } from 'recompose';

import { loanUpdate } from 'core/api/loans/methodDefinitions';
import { createRoute } from 'core/utils/routerUtils';

import APP_ROUTES from '../../../startup/client/appRoutes';

export default compose(
  withState(
    'dontShowAgain',
    'setDontShowAgain',
    ({ loan: { displayWelcomeScreen } }) => !displayWelcomeScreen,
  ),
  withRouter,
  withProps(
    ({ dontShowAgain, rerender, loan: { _id: loanId }, page, history }) => ({
      handleClick: () => {
        window.hideWelcomeScreen = true;

        if (page) {
          // If this is the welcome page, simply route to the dashboard
          history.push(createRoute(APP_ROUTES.DASHBOARD_PAGE.path, { loanId }));
        } else {
          // Else, this is shown instead of the dashboard, so hide it using the
          // `window` object, but react does not re-render when you change window
          // So toggling this boolean state does the trick
          rerender(s => !s);
        }

        if (dontShowAgain) {
          loanUpdate.run({ loanId, object: { displayWelcomeScreen: false } });
        }
      },
    }),
  ),
);
