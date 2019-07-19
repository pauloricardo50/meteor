import React from 'react';
import { compose, withStateHandlers, withProps } from 'recompose';
import { LOAN_STATUS } from 'core/api/constants';
import T from 'core/components/Translation';
import UnsuccessfulDialogContent from './UnsuccessfulDialogContent';
import RealRevenuesDialogContent from './RealRevenuesDialogContent';

const requiresRevenueStatus = status =>
  [LOAN_STATUS.CLOSING, LOAN_STATUS.BILLING, LOAN_STATUS.FINALIZED].includes(status);

const makeAdditionalActions = ({ loan, setState }) => (status, prevStatus) => {
  setState({
    title: (
      <span>
        Passage du dossier à&nbsp;&quot;
        <T id={`Forms.status.${status}`} />
        &quot;
      </span>
    ),
  });
  switch (status) {
  case LOAN_STATUS.UNSUCCESSFUL: {
    return new Promise((resolve, reject) => {
      setState({
        dialogContent: (
          <UnsuccessfulDialogContent
            loan={loan}
            setOpenDialog={open => setState({ openDialog: open })}
            promise={{ resolve, reject }}
          />
        ),
        openDialog: true,
      });
    });
  }
  default:
    break;
  }

  if (requiresRevenueStatus(prevStatus) && requiresRevenueStatus(status)) {
    return new Promise((resolve, reject) => {
      setState({
        dialogContent: (
          <RealRevenuesDialogContent
            loan={loan}
            promise={{ resolve, reject }}
            setOpenDialog={open => setState({ openDialog: open })}
          />
        ),
        openDialog: true,
        withConfirmButton: true,
        promise: { resolve, reject },
      });
    });
  }

  return Promise.resolve();
};

export default compose(
  withStateHandlers(
    {
      openDialog: false,
      dialogContent: null,
      title: '',
      withConfirmButton: false,
      promise: {},
    },
    { setState: () => newState => newState },
  ),

  withProps(({ loan, setState }) => ({
    additionalActions: makeAdditionalActions({
      loan,
      setState,
    }),
    setOpenDialog: open => setState({ openDialog: open }),
  })),
);
