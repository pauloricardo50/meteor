import React from 'react';

import LoanSchema from 'core/api/loans/schemas/LoanSchema';
import Button from 'core/components/Button';
import T from 'core/components/Translation';

import { CancelButton } from '../../../../components/StatusModifier/StatusModifier';
import UnsuccessfulReasonDialogForm from '../../../../components/UnsuccessfulReasonDialogForm';
import UnsuccessfulFeedback from './UnsuccessfulFeedback';
import UnsuccessfulLoanRevenuesAndTasks from './UnsuccessfulLoanRevenuesAndTasks';
import UnsuccessfulNewLoan from './UnsuccessfulNewLoan';

const unsuccessfulReasonSchema = LoanSchema.pick('unsuccessfulReason').extend({
  unsuccessfulReason: { optional: false },
});

const UnsuccessfulDialogPipeline = ({ resolve, reject, doc: loan }) => ({
  modals: [
    <UnsuccessfulReasonDialogForm
      schema={unsuccessfulReasonSchema}
      doc={loan}
      key="reason"
    />,

    {
      content: ({ closeModal, returnValue }) => (
        <UnsuccessfulFeedback
          loan={loan}
          closeModal={closeModal}
          returnValue={returnValue}
        />
      ),
      important: true,
    },
    {
      description:
        'Attention: ce dossier a des tâches actives et/ou des revenus !',
      content: ({ closeModal, returnValue }) => (
        <UnsuccessfulLoanRevenuesAndTasks
          loan={loan}
          closeModal={closeModal}
          returnValue={returnValue}
        />
      ),
      actions: ({ closeAll, closeModal, returnValue }) => [
        <CancelButton closeAll={closeAll} reject={reject} key="cancel" />,
        <Button
          key="ok"
          primary
          raised
          label={<T id="general.ok" />}
          onClick={() => closeModal({ ...returnValue })}
        />,
      ],
      important: true,
      maxWidth: 'xl',
      fullWidth: true,
    },
    {
      content: ({ closeModal, returnValue }) => (
        <UnsuccessfulNewLoan
          loan={loan}
          closeModal={closeModal}
          returnValue={returnValue}
          confirmNewStatus={() => resolve()}
          cancelNewStatus={reject}
        />
      ),
      actions: () => [],
      important: true,
    },
  ],
});

export default UnsuccessfulDialogPipeline;
