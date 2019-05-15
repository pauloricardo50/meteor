import { compose, withProps, withState } from 'recompose';
import { withRouter } from 'react-router-dom';

import { loanUpdate } from 'core/api/methods';
import { withContactButtonContext } from 'core/components/ContactButton/ContactButtonContext';
import { createRoute } from 'core/utils/routerUtils';
import ROUTES from 'imports/startup/client/appRoutes';

export default compose(
  withState(
    'dontShowAgain',
    'setDontShowAgain',
    ({ loan: { displayWelcomeScreen } }) => !displayWelcomeScreen,
  ),
  withContactButtonContext,
  withRouter,
  withProps(({
    dontShowAgain,
    rerender,
    rerenderState,
    loan: { _id: loanId },
    toggleOpenContact,
    openContact,
    page,
    history,
  }) => ({
    handleClick: () => {
      window.hideWelcomeScreen = true;

      if (page) {
        // If this is the welcome page, simply route to the dashboard
        history.push(createRoute(ROUTES.DASHBOARD_PAGE.path, { loanId }));
      } else {
        // Else, this is shown instead of the dashboard, so hide it using the
        // `window` object, but react does not re-render when you change window
        // So toggling this boolean state does the trick
        rerender(!rerenderState);
      }

      if (dontShowAgain) {
        loanUpdate.run({ loanId, object: { displayWelcomeScreen: false } });
      }
    },
    handleContact: () => toggleOpenContact(!openContact),
  })),
);
