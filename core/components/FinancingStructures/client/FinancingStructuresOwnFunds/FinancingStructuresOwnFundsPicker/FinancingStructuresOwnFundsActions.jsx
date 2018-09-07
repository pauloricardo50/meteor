// @flow
import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '../../../../Button';
import T from '../../../../Translation';

type FinancingStructuresOwnFundsActionsProps = {};

const FinancingStructuresOwnFundsActions = ({
  shouldUpdateBorrowers,
  loading,
  handleClose,
  handleDelete,
  handleSubmit,
  handleUpdateBorrower,
  handleCancelUpdateBorrower,
}: FinancingStructuresOwnFundsActionsProps) => {
  const defaultActions = [
    <Button disabled={loading} key="cancel" onClick={handleClose}>
      <T id="general.cancel" />
    </Button>,
    <Button disabled={loading} key="delete" onClick={handleDelete}>
      <T id="general.delete" />
    </Button>,
    <Button primary raised key="ok" onClick={handleSubmit} loading={loading}>
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
      <T id="general.yes" />
    </Button>,
  ];

  return (
    <DialogActions>
      {shouldUpdateBorrowers ? borrowerUpdateActions : defaultActions}
    </DialogActions>
  );
};

export default FinancingStructuresOwnFundsActions;
