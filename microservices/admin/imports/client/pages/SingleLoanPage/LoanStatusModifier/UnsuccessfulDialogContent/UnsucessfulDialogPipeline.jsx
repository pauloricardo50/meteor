import React from 'react';

import LoanSchema from 'core/api/loans/schemas/LoanSchema';
import Button from 'core/components/Button';
import { CollectionIconLink } from 'core/components/IconLink';
import DialogForm from 'core/components/ModalManager/DialogForm';
import T from 'core/components/Translation';

import { CancelButton } from '../../../../components/StatusModifier/StatusModifier';
import UnsuccessfulFeedback from './UnsuccessfulFeedback';
import UnsuccessfulLoanRevenuesAndTasks from './UnsuccessfulLoanRevenuesAndTasks';
import UnsuccessfulNewLoan from './UnsuccessfulNewLoan';

const unsuccessfulReasonSchema = LoanSchema.pick('unsuccessfulReason').extend({
  unsuccessfulReason: { optional: false },
});

const UnsuccessfulDialogPipeline = ({ resolve, reject, doc: loan }) => ({
  modals: [
    <DialogForm
      key="reason"
      schema={unsuccessfulReasonSchema}
      description="Entrez la raison du passage du dossier en sans suite"
      className="animated fadeIn"
      important
      autosave
    >
      <div className="flex-row center">
        <p>Vous vous apprêtez à passer le dossier&nbsp;</p>
        <CollectionIconLink relatedDoc={loan} />
        <p>&nbsp;en sans suite.</p>
      </div>
    </DialogForm>,

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
