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
  to: { type: Array, minCount: 1 },
  'to.$': { type: String, optional: false },
  customMessage: {
    type: String,
    optional: true,
    uniforms: { multiline: true, rows: 15, rowsMax: 15 },
  },
});

const LoanChecklistEmailSender = (props: LoanChecklistEmailSenderProps) => {
  const {
    loan,
    onSubmit,
    currentUser: { email: assigneeAddress } = {},
  } = props;
  const { _id: loanId, user: { email } = {} } = loan;

  return (
    <AutoFormDialog
      title="Envoyer la checklist au client"
      description={`Cet email partira depuis "${assigneeAddress}". Tous les destinataires recevront l'email en BCC.`}
      schema={schema}
      onSubmit={onSubmit}
      buttonProps={{
        raised: true,
        primary: true,
        label: 'Envoyer la checklist au client',
        style: { marginLeft: '8px' },
      }}
      model={{ to: [email] }}
    />
  );
};

export default withProps(({
  loan,
  currentUser: { name: assigneeName, email: assigneeAddress } = {},
}) => ({
  onSubmit: ({ to, customMessage }) => {
    const [mainAddress, ...bccAddresses] = to;

    return sendEmailToAddress.run({
      address: mainAddress,
      emailId: EMAIL_IDS.LOAN_CHECKLIST,
      params: {
        loan,
        assigneeName,
        assigneeAddress,
        customMessage: customMessage.replace(/(?:\r\n|\r|\n)/g, '<br>'),
        bccAddresses,
      },
    });
  },
}))(LoanChecklistEmailSender);
