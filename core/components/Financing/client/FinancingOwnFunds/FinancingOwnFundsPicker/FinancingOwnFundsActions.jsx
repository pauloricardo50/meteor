import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';

import Button from '../../../../Button';
import T from '../../../../Translation';

const FinancingOwnFundsActions = ({
  displayWarning,
  loading,
  handleClose,
  handleDelete,
  handleSubmit,
  handleUpdateBorrower,
  handleCancelUpdateBorrower,
  disableSubmit,
  disableDelete,
}) => {
  const defaultActions = [
    <Button disabled={loading} key="cancel" onClick={handleClose}>
      <T id="general.cancel" />
    </Button>,
    !disableDelete && (
      <Button disabled={loading} key="delete" onClick={handleDelete} error>
        <T id="general.delete" />
      </Button>
    ),
    <Button
      primary
      raised
      key="ok"
      onClick={handleSubmit}
      loading={loading}
      disabled={disableSubmit}
    >
      <T id="general.ok" />
    </Button>,
  ];

  const borrowerUpdateActions = [
    <Button disabled={loading} key="no" onClick={handleCancelUpdateBorrower}>
      <T id="general.no" />
    </Button>,
    <Button
      primary
      raised
      loading={loading}
      key="yes"
      onClick={handleUpdateBorrower}
    >
      <T id="FinancingOwnFundsActions.modify" />
    </Button>,
  ];

  return (
    <DialogActions>
      {displayWarning ? borrowerUpdateActions : defaultActions}
    </DialogActions>
  );
};

export default FinancingOwnFundsActions;
