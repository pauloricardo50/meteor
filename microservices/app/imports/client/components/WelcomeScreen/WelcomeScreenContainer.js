import { compose, withProps, withState } from 'recompose';
import { withRouter } from 'react-router-dom';

import { loanUpdate } from 'core/api/methods';
import { withContactButtonContext } from 'core/components/ContactButton/ContactButtonContext';
import { createRoute } from 'core/utils/routerUtils';
import { DASHBOARD_PAGE } from 'imports/startup/client/appRoutes';

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
        history.push(createRoute(DASHBOARD_PAGE, { loanId }));
      } else {
        rerender(!rerenderState);
      }

      if (dontShowAgain) {
        loanUpdate.run({ loanId, object: { displayWelcomeScreen: false } });
      }
    },
    handleContact: () => toggleOpenContact(!openContact),
  })),
);
