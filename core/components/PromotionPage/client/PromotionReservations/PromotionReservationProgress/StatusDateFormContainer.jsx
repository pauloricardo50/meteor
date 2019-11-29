import React, { useState } from 'react';
import { withProps } from 'recompose';

import {
  loanUpdate,
  setPromotionOptionProgress,
} from '../../../../../api/methods';
import {
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
} from '../../../../../api/constants';
import PromotionOptionSchema from '../../../../../api/promotionOptions/schemas/PromotionOptionSchema';
import T from '../../../../Translation';

const confirmDialog = ({
  values,
  id,
  setDialogProps,
  setDialogActions,
  setOpenDialog,
}) => {
  const { status } = values;
  setDialogProps({
    title: (
      <span>
        Changement du statut&nbsp;
        <T id={`Forms.${id}`} />
      </span>
    ),
    important: true,
    text: (
      <span>
        Passer le status&nbsp;
        <T id={`Forms.${id}`} />
        &nbsp;à&nbsp;
        <T id={`Forms.status.${status}`} />
        &nbsp;?
      </span>
    ),
  });

  return new Promise((resolve, reject) => {
    setDialogActions({
      cancel: () => {
        setOpenDialog(false);
        reject();
      },
      ok: () => {
        setOpenDialog(false);
        resolve();
      },
    });
    setOpenDialog(true);
  });
};

const additionalActionsDialog = ({
  values,
  id,
  loanId,
  setDialogProps,
  setDialogActions,
  setOpenDialog,
}) => {
  const isSimpleVerification = id === 'simpleVerification';

  if (isSimpleVerification) {
    const { status } = values;

    if (status === PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED) {
      setDialogProps({
        title: 'Vérouiller les formulaires',
        important: true,
        text:
          'Vérouiller tous les formulaires pour que le client ne puisse plus modifier ses informations ?',
      });
      setDialogActions({
        cancel: () => setOpenDialog(false),
        ok: () =>
          loanUpdate
            .run({ loanId, object: { userFormsEnabled: false } })
            .then(() => setOpenDialog(false)),
      });
      setOpenDialog(true);
    }
  }
};

export default withProps(({ id, loanId, promotionOptionId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [dialogActions, setDialogActions] = useState({
    cancel: () => setOpenDialog(false),
    ok: () => setOpenDialog(false),
  });

  const isTextField = id === 'adminNote';
  const isBankStatus = id === 'bank';

  return {
    autosave: !isTextField,
    schema: isBankStatus
      ? PromotionOptionSchema.getObjectSchema(id)
          .omit('status')
          .extend({
            status: {
              type: String,
              allowedValues: Object.values(PROMOTION_OPTION_BANK_STATUS).filter(
                s => s !== PROMOTION_OPTION_BANK_STATUS.WAITLIST,
              ),
            },
          })
      : PromotionOptionSchema.getObjectSchema(id).pick(
          'date',
          'status',
          'note',
        ),
    layout: isTextField
      ? [{ fields: ['date'] }, { fields: ['note'] }]
      : [
          {
            className: 'grid-col',
            style: { gridTemplateColumns: '1fr 220px', width: '100%' },
            fields: ['status', 'date'],
          },
        ],
    submitFieldProps: { showSubmitField: isTextField },
    openDialog,
    dialogProps,
    dialogActions,
    onSubmit: values =>
      confirmDialog({
        values,
        id,
        setOpenDialog,
        setDialogActions,
        setDialogProps,
      })
        .then(() =>
          setPromotionOptionProgress.run({
            promotionOptionId,
            id,
            object: values,
          }),
        )
        .then(() =>
          additionalActionsDialog({
            values,
            id,
            loanId,
            setDialogProps,
            setDialogActions,
            setOpenDialog,
          }),
        )
        .catch(Promise.reject),
  };
});
