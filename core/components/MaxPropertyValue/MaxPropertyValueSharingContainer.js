import { withProps, compose, withState } from 'recompose';

import { loanShareSolvency } from 'core/api/methods/index';

export default compose(
  withState('openDialog', 'setOpenDialog', false),
  withState('loading', 'setLoading', false),
  withProps(({ loanId, setOpenDialog, shareSolvency, setLoading }) => ({
    handleToggle: () => {
      if (!shareSolvency) {
        setOpenDialog(true);
      } else {
        loanShareSolvency.run({ loanId, shareSolvency: false });
      }
    },
    handleDisable: () => {
      setLoading(true);
      return loanShareSolvency
        .run({ loanId, shareSolvency: false })
        .finally(() => setLoading(false));
    },
    handleSubmit: () => {
      setLoading(true);
      return loanShareSolvency
        .run({ loanId, shareSolvency: true })
        .then(() => {
          setOpenDialog(false);
        })
        .finally(() => setLoading(false));
    },
  })),
);
