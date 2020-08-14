import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { withProps } from 'recompose';

import { loanUpdate } from 'core/api/loans/methodDefinitions';
import { createRoute } from 'core/utils/routerUtils';

import APP_ROUTES from '../../../startup/client/appRoutes';

export default withProps(
  ({ rerender, loan: { _id: loanId, displayWelcomeScreen }, page }) => {
    const [dontShowAgain, setDontShowAgain] = useState(!displayWelcomeScreen);
    const history = useHistory();

    return {
      dontShowAgain,
      setDontShowAgain,
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
    };
  },
);
