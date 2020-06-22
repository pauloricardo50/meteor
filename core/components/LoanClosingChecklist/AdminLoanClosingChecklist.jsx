import React, { useState } from 'react';

import { loanChecklists } from '../../api/checklists/queries';
import { addClosingChecklists } from '../../api/loans/methodDefinitions';
import useMeteorData from '../../hooks/useMeteorData';
import Button from '../Button';
import ConfirmMethod from '../ConfirmMethod';
import LoanClosingChecklist from './LoanClosingChecklist';

const AdminLoanClosingChecklist = ({ loan, buttonProps }) => {
  const [openOnMount, setOpenOnMount] = useState(false);
  const { data: checklists, loading } = useMeteorData({
    query: loanChecklists,
    params: {
      loanId: loan._id,
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
          secondary: true,
          ...buttonProps,
        }}
        method={() => {
          setOpenOnMount(true);
          return addClosingChecklists.run({ loanId: loan._id });
        }}
      />
    );
  }

  return (
    <LoanClosingChecklist
      checklists={checklists}
      renderTrigger={({ handleOpen, done, total }) => (
        <Button onClick={handleOpen} secondary {...buttonProps}>
          Checklist de closing ({done}/{total})
        </Button>
      )}
      loan={loan}
      openOnMount={openOnMount}
    />
  );
};

export default AdminLoanClosingChecklist;
