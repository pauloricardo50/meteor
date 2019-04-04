import { compose, withProps, withState } from 'recompose';

import { loanUpdate } from 'core/api/methods';

export default compose(
  withState('dontShowAgain', 'setDontShowAgain', false),
  withProps(({ dontShowAgain, rerender, rerenderState, loan: { _id: loanId } }) => ({
    handleClick: () => {
      window.hideWelcomeScreen = true;
      rerender(!rerenderState);

      if (dontShowAgain) {
        loanUpdate.run({ loanId, object: { displayWelcomeScreen: false } });
      }
    },
  })),
);
