import React from 'react';
import moment from 'moment';

import {
  loanUpdate,
  getEmailsToBeSentBySetPromotionOptionProgress,
} from '../../../../../api/methods';
import { PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS } from '../../../../../api/constants';
import T from '../../../../Translation';

export const getEmailsToBeSent = async ({ id, status, nextStatus }) => {
  if (status === nextStatus) {
    return null;
  }
  const emails = await getEmailsToBeSentBySetPromotionOptionProgress.run({
    id,
    nextStatus,
  });

  if (emails.length > 0) {
    return emails.reduce(
      (mails, description) =>
        description.length
          ? [...mails, ...description]
          : [...mails, description],
      [],
    );
  }
};

export const getEmailsToBeSentWarning = emailsToBeSent =>
  emailsToBeSent && (
    <p style={{ padding: '16px', border: '1px solid red' }}>
      <b>Attention!</b>
      <br />
      Enverra les emails suivants:
      <br />
      <ul>
        {emailsToBeSent.map((email, index) => (
          <li key={index}>{email}</li>
        ))}
      </ul>
    </p>
  );

export const preConfirmDialog = async ({
  values,
  id,
  setOpenConfirmDialog,
  setConfirmDialogActions,
  setConfirmDialogProps,
  emailsToBeSent,
}) => {
  const { status, date } = values;
  setConfirmDialogProps({
    title: (
      <span>
        Changement du statut&nbsp;
        <T id={`Forms.${id}`} />
      </span>
    ),
    important: true,
    text: (
      <>
        <p>
          Passer le status&nbsp;
          <T id={`Forms.${id}`} />
          &nbsp;à&nbsp;
          <T id={`Forms.status.${status}`} />
          &nbsp;au&nbsp;{moment(date).format('D MMM YYYY')}&nbsp;?
        </p>
        {getEmailsToBeSentWarning(emailsToBeSent)}
      </>
    ),
  });

  return new Promise((resolve, reject) => {
    setConfirmDialogActions({
      cancel: event => {
        event.preventDefault();
        event.stopPropagation();
        setOpenConfirmDialog(false);
        reject();
      },
      ok: event => {
        event.preventDefault();
        event.stopPropagation();
        setOpenConfirmDialog(false);
        resolve();
      },
    });
    setOpenConfirmDialog(true);
  });
};

export const postConfirmDialog = ({
  values,
  id,
  loanId,
  setOpenConfirmDialog,
  setConfirmDialogProps,
  setConfirmDialogActions,
}) => {
  const isSimpleVerification = id === 'simpleVerification';

  if (isSimpleVerification) {
    const { status } = values;

    if (status === PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED) {
      setConfirmDialogProps({
        title: 'Vérouiller les formulaires',
        important: true,
        text:
          'Vérouiller tous les formulaires pour que le client ne puisse plus modifier ses informations ?',
      });
      setConfirmDialogActions({
        cancel: event => {
          event.preventDefault();
          event.stopPropagation();
          setOpenConfirmDialog(false);
        },
        ok: event => {
          event.preventDefault();
          event.stopPropagation();
          return loanUpdate
            .run({ loanId, object: { userFormsEnabled: false } })
            .then(() => setOpenConfirmDialog(false));
        },
      });
      setOpenConfirmDialog(true);
    }
  }
};
