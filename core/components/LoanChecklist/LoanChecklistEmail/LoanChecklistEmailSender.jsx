// @flow
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { sendEmailToAddress } from '../../../api';
import { EMAIL_IDS } from '../../../api/constants';
import { AutoFormDialog } from '../../AutoForm2';

type LoanChecklistEmailSenderProps = {
  loan: Object,
};

const schema = new SimpleSchema({
  email: String,
  customMessage: {
    type: String,
    optional: true,
    uniforms: { multiline: true, rows: 15, rowsMax: 15 },
  },
});

const LoanChecklistEmailSender = (props: LoanChecklistEmailSenderProps) => {
  const { loan, onSubmit } = props;
  const { _id: loanId, user: { email } = {} } = loan;

  return (
    <AutoFormDialog
      title="Envoyer la checklist au client"
      schema={schema}
      onSubmit={onSubmit}
      buttonProps={{
        raised: true,
        primary: true,
        label: 'Envoyer la checklist au client',
        style: { marginLeft: '8px' },
      }}
      model={{ email }}
    />
  );
};

export default withProps(({
  loan,
  currentUser: { name: assigneeName, email: assigneeAddress } = {},
}) => ({
  onSubmit: ({ email, customMessage }) =>
    sendEmailToAddress.run({
      address: email,
      emailId: EMAIL_IDS.LOAN_CHECKLIST,
      params: {
        loan,
        assigneeName,
        assigneeAddress,
        customMessage: customMessage.replace(/(?:\r\n|\r|\n)/g, '<br>'),
      },
    }),
}))(LoanChecklistEmailSender);
