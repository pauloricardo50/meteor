import { useState } from 'react';
import { withProps } from 'recompose';

import {
  loanUpdate,
  promotionOptionUpdateObject,
} from '../../../../../api/methods';
import { PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS } from '../../../../../api/constants';
import PromotionOptionSchema from '../../../../../api/promotionOptions/schemas/PromotionOptionSchema';

const handleDialog = ({
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

  return {
    autosave: !isTextField,
    schema: PromotionOptionSchema.getObjectSchema(id).pick(
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
            fields: ['__REST'],
          },
        ],
    submitFieldProps: { showSubmitField: isTextField },
    openDialog,
    dialogProps,
    dialogActions,
    onSubmit: async values => {
      await promotionOptionUpdateObject.run({
        promotionOptionId,
        id,
        object: values,
      });

      handleDialog({
        values,
        id,
        loanId,
        setDialogProps,
        setDialogActions,
        setOpenDialog,
      });
    },
  };
});
