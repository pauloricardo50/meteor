//
import React from 'react';
import SimpleSchema from 'simpl-schema';
import { withProps } from 'recompose';

import { AutoFormDialog } from 'core/components/AutoForm2';
import IconButton from 'core/components/IconButton';
import { loanUpdate } from 'core/api/methods';

const schema = new SimpleSchema({
  customName: { type: String, optional: true },
});

const LoanRenamer = ({ customName, updateLoanName, ...props }) => (
  <AutoFormDialog
    schema={schema}
    onSubmit={updateLoanName}
    model={{ customName }}
    triggerComponent={handleOpen => (
      <IconButton onClick={handleOpen} type="edit" />
    )}
    {...props}
  />
);

export default withProps(({ loanId }) => ({
  updateLoanName: object => loanUpdate.run({ loanId, object }),
}))(LoanRenamer);
