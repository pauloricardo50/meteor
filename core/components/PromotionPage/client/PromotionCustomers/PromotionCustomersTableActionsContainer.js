import { compose, withProps, withState } from 'recompose';

import {
  editPromotionLoan,
  removeLoanFromPromotion,
} from '../../../../api/promotions/methodDefinitions';

export default compose(
  withState('openDialog', 'setOpenDialog', false),
  withProps(
    ({
      loan: { _id: loanId },
      promotion: { _id: promotionId },
      setOpenDialog,
    }) => ({
      handleRemove: () => {
        const confirmed = window.confirm(
          'Êtes vous sûr de vouloir enlever ce compte Pro de la promotion?',
        );

        if (confirmed) {
          removeLoanFromPromotion.run({ loanId, promotionId });
        }
      },
      handleOpenForm: () => setOpenDialog(true),
      editLots: values =>
        editPromotionLoan
          .run({ ...values, loanId, promotionId })
          .then(() => setOpenDialog(false)),
    }),
  ),
);
