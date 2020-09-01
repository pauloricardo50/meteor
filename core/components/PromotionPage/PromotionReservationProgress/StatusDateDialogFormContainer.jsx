import React, { useMemo, useState } from 'react';
import { withProps } from 'recompose';

import { setPromotionOptionProgress } from '../../../api/promotionOptions/methodDefinitions';
import { PROMOTION_OPTION_BANK_STATUS } from '../../../api/promotionOptions/promotionOptionConstants';
import PromotionOptionSchema from '../../../api/promotionOptions/schemas/PromotionOptionSchema';
import T from '../../Translation';
import {
  getEmailsToBeSent,
  getEmailsToBeSentWarning,
  openPostConfirmDialog,
  openPreConfirmDialog,
} from './statusDateFormDialogHelpers';

export default withProps(
  ({
    promotionOptionId,
    loanId,
    id,
    status,
    conditions,
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

    const schema = useMemo(
      () =>
        isBankStatus
          ? PromotionOptionSchema.getObjectSchema(id)
              .omit('status')
              .extend({
                status: {
                  type: String,
                  allowedValues: Object.values(
                    PROMOTION_OPTION_BANK_STATUS,
                  ).filter(s => s !== PROMOTION_OPTION_BANK_STATUS.WAITLIST),
                },
                date: { type: Date, optional: false },
                conditions: {
                  type: String,
                  condition: ({ status: s }) =>
                    s ===
                    PROMOTION_OPTION_BANK_STATUS.VALIDATED_WITH_CONDITIONS,
                  uniforms: {
                    helperText: "Visible d'e-Potek et des Pros uniquement",
                  },
                },
              })
          : PromotionOptionSchema.getObjectSchema(id)
              .pick('date', 'status')
              .extend({ date: { type: Date, optional: false } }),
      [id],
    );

    return {
      schema,
      title: <T id={`Forms.${id}`} />,
      model: { status, conditions },
      open: openDialog,
      setOpen: setOpenDialog,
      layout: [
        {
          className: 'grid-col',
          style: { gridTemplateColumns: '1fr 220px', width: '100%' },
          fields: ['status', 'date'],
        },
        'conditions',
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
      onSubmit(values) {
        if ('date' in values && values.date instanceof Date) {
          // Uniforms is given the date string without a timezone so it is parsed in
          // the UTC timezone, even though it was in the local time zone
          // https://github.com/vazco/uniforms/issues/532

          // timezone offset is in minutes
          const offsetInMilliseconds =
            values.date.getTimezoneOffset() * 60 * 1000;
          values.date = new Date(values.date.getTime() + offsetInMilliseconds);
        }

        return openPreConfirmDialog({
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
            openPostConfirmDialog({
              values,
              id,
              loanId,
              setOpenConfirmDialog,
              setConfirmDialogProps,
              setConfirmDialogActions,
            }),
          );
      },
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
