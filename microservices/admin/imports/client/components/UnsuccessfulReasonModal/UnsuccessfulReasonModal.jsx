import React, { useState } from 'react';
import {
  ACTIVITIES_COLLECTION,
  ACTIVITY_TYPES,
} from 'imports/core/api/activities/activityConstants';
import { useStaticMeteorData } from 'imports/core/hooks/useMeteorData';

import { LOAN_STATUS } from 'core/api/loans/loanConstants';
import { loanUpdate } from 'core/api/loans/methodDefinitions';
import LoanSchema from 'core/api/loans/schemas/LoanSchema';
import { employeesByEmail } from 'core/arrays/epotekEmployees';
import { AutoFormDialog } from 'core/components/AutoForm2';
import useCurrentUser from 'core/hooks/useCurrentUser';

const NoReasonDescription = ({ unsuccessfulActivity }) => (
  <div className="flex-col">
    <span>
      Ce dossier est en sans suite, mais aucune raison d'archivage n'a été
      entrée, ou il en possède une ancienne. Merci d'en renseigner une avant de
      continuer.
    </span>
    {unsuccessfulActivity && (
      <div className="flex-col mt-8">
        <span>Ancienne raison d'archivage:</span>
        <b
          className="font-size-4 text-center mt-8 mb-16"
          style={{ color: 'black' }}
        >
          &quot;{unsuccessfulActivity.description}&quot;
        </b>
        <span className="flex-col">
          Si vous ne trouvez pas de raison dans la liste ci-dessous, vous
          pouvez:
          <a
            className="a flex center-align mt-16"
            href="mailto:corentin@e-potek.ch"
            target="_blank"
            style={{ alignSelf: 'center', marginLeft: '-44px' }}
          >
            <img
              src={employeesByEmail['corentin@e-potek.ch'].src}
              width={40}
              height={40}
              style={{ borderRadius: '50%' }}
              alt="corentin@e-potek.ch"
              className="fa-spin mr-4"
            />
            Écrire à Corentin
          </a>
        </span>
      </div>
    )}
  </div>
);

const UnsuccessfulReasonModal = ({
  loan: { _id: loanId, status, unsuccessfulReason, anonymous, mainAssignee },
}) => {
  const currentUser = useCurrentUser();

  const shouldShowDialog =
    status === LOAN_STATUS.UNSUCCESSFUL &&
    !anonymous &&
    !unsuccessfulReason &&
    mainAssignee?._id === currentUser._id;

  const { data: unsuccessfulActivity, loading } = useStaticMeteorData({
    query: ACTIVITIES_COLLECTION,
    params: {
      $filters: {
        'loanLink._id': loanId,
        type: ACTIVITY_TYPES.EVENT,
        isServerGenerated: true,
        title: 'Sans suite',
      },
      description: 1,
    },
    type: 'single',
  });

  const [openDialog, setOpenDialog] = useState(shouldShowDialog);

  if (!shouldShowDialog || loading) {
    return null;
  }

  return (
    <AutoFormDialog
      schema={LoanSchema.pick('unsuccessfulReason').extend({
        unsuccessfulReason: { optional: false },
      })}
      onSubmit={object => loanUpdate.run({ loanId, object })}
      noButton
      important
      setOpen={setOpenDialog}
      openOnMount={openDialog}
      noCancel
      title="Dossier sans suite sans raison d'archivage"
      description={
        <NoReasonDescription unsuccessfulActivity={unsuccessfulActivity} />
      }
    />
  );
};

export default UnsuccessfulReasonModal;
