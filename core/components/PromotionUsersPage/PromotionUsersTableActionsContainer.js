import { compose, withState, withProps } from 'recompose';

import { removeUserFromPromotion, editPromotionLoan } from '../../api';

export default compose(
  withState('openDialog', 'setOpenDialog', false),
  withState('loading', 'setLoading', false),
  withProps(({
    loan: { _id: loanId },
    promotion: { _id: promotionId },
    setOpenDialog,
    setLoading,
  }) => ({
    handleRemove: () => {
      const confirmed = window.confirm('Êtes vous sûr de vouloir enlever cet utilisateur de la promotion?');

      if (confirmed) {
        removeUserFromPromotion.run({ loanId, promotionId });
      }
    },
    handleOpenForm: () => setOpenDialog(true),
    editLots: (values) => {
      setLoading(true);
      return editPromotionLoan
        .run({ ...values, loanId, promotionId })
        .then(() => setOpenDialog(false))
        .finally(() => setLoading(false));
    },
  })),
);
