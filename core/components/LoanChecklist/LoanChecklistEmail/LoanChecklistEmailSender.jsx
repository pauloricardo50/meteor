// @flow
import React from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

import { LOANS_COLLECTION } from 'core/api/constants';
import { sendLoanChecklist, taskInsert } from '../../../api';
import { AutoFormDialog } from '../../AutoForm2';

type LoanChecklistEmailSenderProps = {
  loan: Object,
};

const schema = new SimpleSchema({
  to: Array,
  'to.$': Object,
  'to.$.bcc': {
    type: Boolean,
    defaultValue: true,
    condition: ({ to = [] }) => to.length > 1,
  },
  'to.$.email': { type: String, optional: false },
  customMessage: {
    type: String,
    optional: true,
    uniforms: { multiline: true, rows: 15, rowsMax: 15 },
  },
  addTask: {
    type: Boolean,
    defaultValue: false,
    uniforms: { label: 'Ajouter tâche de suivi pour dans 3 jours' },
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
      description={`Cet email partira depuis "${assigneeAddress}"`}
      schema={schema}
      onSubmit={onSubmit}
      buttonProps={{
        raised: true,
        primary: true,
        label: 'Envoyer la checklist au client',
        style: { marginLeft: '8px' },
      }}
      model={{ to: [{ email }] }}
    />
  );
};

export default withProps(
  ({
    loan,
    currentUser: { name: assigneeName, email: assigneeAddress } = {},
  }) => ({
    onSubmit: ({ to, customMessage, addTask }) => {
      const [mainRecipient, ...otherRecipients] = to;
      const bccAddresses = otherRecipients
        .filter(({ bcc }) => bcc)
        .map(({ email }) => email);
      const ccAddresses = otherRecipients
        .filter(({ bcc }) => !bcc)
        .map(({ email }) => email);

      return sendLoanChecklist
        .run({
          address: mainRecipient.email,
          emailParams: {
            loan,
            assigneeName,
            assigneeAddress,
            customMessage: customMessage.replace(/(?:\r\n|\r|\n)/g, '<br>'),
            bccAddresses,
            ccAddresses,
            mainRecipientIsBcc: mainRecipient.bcc,
          },
        })
        .then(() => {
          if (addTask) {
            return taskInsert.run({
              object: {
                collection: LOANS_COLLECTION,
                dueAt: moment()
                  .add(3, 'd')
                  .toDate(),
                docId: loan._id,
                title: "Suivi de l'envoi de la checklist",
              },
            });
          }
        });
    },
  }),
)(LoanChecklistEmailSender);
