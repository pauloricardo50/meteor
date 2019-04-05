import { compose, withProps, withState } from 'recompose';

import { loanUpdate } from 'core/api/methods';
import { withContactButtonContext } from 'core/components/ContactButton/ContactButtonContext';

export default compose(
  withState('dontShowAgain', 'setDontShowAgain', false),
  withContactButtonContext,
  withProps(({
    dontShowAgain,
    rerender,
    rerenderState,
    loan: { _id: loanId },
    toggleOpenContact,
    openContact,
  }) => ({
    handleClick: () => {
      window.hideWelcomeScreen = true;
      rerender(!rerenderState);

      if (dontShowAgain) {
        loanUpdate.run({ loanId, object: { displayWelcomeScreen: false } });
      }
    },
    handleContact: () => toggleOpenContact(!openContact),
  })),
);
