//
import React from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

import { LOANS_COLLECTION } from 'core/api/constants';
import { sendLoanChecklist, taskInsert } from '../../../api';
import { AutoFormDialog } from '../../AutoForm2';

const schema = new SimpleSchema({
  to: Array,
  'to.$': Object,
  'to.$.bcc': {
    type: Boolean,
    defaultValue: true,
    condition: ({ to = [] }) => to.length > 1,
  },
  'to.$.email': { type: String, optional: false },
  basicDocumentsOnly: { type: Boolean, optional: true, defaultValue: false },
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

const LoanChecklistEmailSender = props => {
  const {
    loan,
    onSubmit,
    currentUser: { email: assigneeAddress } = {},
  } = props;
  const { user: { email } = {} } = loan;

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

export default withProps(({ loan: { _id: loanId } }) => ({
  onSubmit: ({ to, customMessage, addTask, basicDocumentsOnly }) => {
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
        loanId,
        basicDocumentsOnly,
        emailParams: {
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
              docId: loanId,
              title: "Suivi de l'envoi de la checklist",
            },
          });
        }
      });
  },
}))(LoanChecklistEmailSender);
