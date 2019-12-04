import React, { useState } from 'react';
import { withProps } from 'recompose';

import { setPromotionOptionProgress } from '../../../../../api/methods';
import PromotionOptionSchema from '../../../../../api/promotionOptions/schemas/PromotionOptionSchema';
import { PROMOTION_OPTION_BANK_STATUS } from '../../../../../api/constants';
import T from '../../../../Translation';
import {
  getEmailsToBeSent,
  getEmailsToBeSentWarning,
  preConfirmDialog,
  postConfirmDialog,
} from './statusDateFormDialogHelpers';

export default withProps(
  ({
    promotionOptionId,
    loanId,
    id,
    status,
    date,
    openDialog,
    setOpenDialog,
  }) => {
    const isBankStatus = id === 'bank';
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [confirmDialogActions, setConfirmDialogActions] = useState({
      cancel: () => setOpenConfirmDialog(false),
      ok: () => setOpenConfirmDialog(false),
    });
    const [confirmDialogProps, setConfirmDialogProps] = useState({});
    const [emailsToBeSent, setEmailsToBeSent] = useState(undefined);

    return {
      schema: isBankStatus
        ? PromotionOptionSchema.getObjectSchema(id)
            .omit('status')
            .extend({
              status: {
                type: String,
                allowedValues: Object.values(
                  PROMOTION_OPTION_BANK_STATUS,
                ).filter(s => s !== PROMOTION_OPTION_BANK_STATUS.WAITLIST),
              },
            })
        : PromotionOptionSchema.getObjectSchema(id).pick('status', 'date'),
      title: <T id={`Forms.${id}`} />,
      model: { status, date },
      open: openDialog,
      setOpen: setOpenDialog,
      layout: [
        {
          className: 'grid-col',
          style: { gridTemplateColumns: '1fr 220px', width: '100%' },
          fields: ['status', 'date'],
        },
      ],
      description: (
        <div>
          <p>
            Changement du statut&nbsp;
            <T id={`Forms.${id}`} />
          </p>
          {getEmailsToBeSentWarning(emailsToBeSent)}
        </div>
      ),
      onSubmit: values =>
        preConfirmDialog({
          values,
          id,
          setOpenConfirmDialog,
          setConfirmDialogActions,
          setConfirmDialogProps,
          emailsToBeSent,
        })
          .then(() =>
            setPromotionOptionProgress.run({
              promotionOptionId,
              id,
              object: values,
            }),
          )
          .then(() =>
            postConfirmDialog({
              values,
              id,
              loanId,
              setOpenConfirmDialog,
              setConfirmDialogProps,
              setConfirmDialogActions,
            }),
          )
          .then(() => setOpenDialog(false)),
      openConfirmDialog,
      confirmDialogActions,
      confirmDialogProps,
      onChangeModel: async ({ status: nextStatus }) => {
        const emails = await getEmailsToBeSent({ id, status, nextStatus });
        setEmailsToBeSent(emails);
      },
    };
  },
);
