import React from 'react';

import { loanChecklists } from '../../api/checklists/queries';
import { addClosingChecklists } from '../../api/loans/methodDefinitions';
import useMeteorData from '../../hooks/useMeteorData';
import Button from '../Button';
import ConfirmMethod from '../ConfirmMethod';
import LoanClosingChecklist from './LoanClosingChecklist';

const AdminLoanClosingChecklist = ({
  loanId,
  showClosingChecklists,
  buttonProps,
}) => {
  const { data: checklists, loading } = useMeteorData({
    query: loanChecklists,
    params: {
      loanId,
      $body: {
        title: 1,
        description: 1,
        items: 1,
      },
    },
    reactive: true,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loading && checklists.length === 0) {
    return (
      <ConfirmMethod
        buttonProps={{
          label: 'Préparer le closing',
          primary: true,
          ...buttonProps,
        }}
        method={() => addClosingChecklists.run({ loanId })}
      />
    );
  }

  return (
    <LoanClosingChecklist
      checklists={checklists}
      renderTrigger={({ handleOpen }) => (
        <Button onClick={handleOpen} secondary {...buttonProps}>
          Checklist de closing
        </Button>
      )}
      loanId={loanId}
      showClosingChecklists={showClosingChecklists}
    />
  );
};

export default AdminLoanClosingChecklist;
