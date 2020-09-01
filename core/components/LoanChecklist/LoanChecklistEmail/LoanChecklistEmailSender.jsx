import React from 'react';
import moment from 'moment';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { LOANS_COLLECTION } from '../../../api/loans/loanConstants';
import { sendLoanChecklist } from '../../../api/loans/methodDefinitions';
import { taskInsert } from '../../../api/tasks/methodDefinitions';
import { AutoFormDialog } from '../../AutoForm2';
import { CUSTOM_AUTOFIELD_TYPES } from '../../AutoForm2/autoFormConstants';

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
    uniforms: { multiline: true, rows: 5, rowsMax: 15 },
  },
  addTask: {
    type: Boolean,
    defaultValue: false,
    uniforms: { label: 'Ajouter tâche de suivi pour dans 3 jours' },
  },
  attachmentKeys: {
    type: Array,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.FILE_UPLOAD },
    defaultValue: [],
  },
  'attachmentKeys.$': String,
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
  onSubmit: ({
    to,
    customMessage,
    addTask,
    basicDocumentsOnly,
    attachmentKeys,
  }) => {
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
        attachmentKeys,
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
              dueAt: moment().add(3, 'd').toDate(),
              docId: loanId,
              title: "Suivi de l'envoi de la checklist",
            },
          });
        }
      });
  },
}))(LoanChecklistEmailSender);
