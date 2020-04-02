import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';

import {
  adminLoanInsert,
  loanLinkPromotion,
  loanUnlinkPromotion,
} from '../../../../api/loans/methodDefinitions';

export default compose(
  withRouter,
  withProps(({ promotion, history }) => ({
    linkPromotionLoan: ({ loanId }) => {
      const confirm = window.confirm(
        'Êtes-vous sûr de vouloir lier ce dossier à cette promotion ?',
      );

      return confirm
        ? loanLinkPromotion.run({
            loanId,
            promotionId: promotion._id,
          })
        : Promise.resolve();
    },
    unlinkPromotionLoan: ({ loanId }) => {
      const confirm = window.confirm(
        'Êtes-vous sûr de vouloir délier ce dossier de cette promotion ?',
      );

      return confirm
        ? loanUnlinkPromotion.run({ loanId, promotionId: promotion._id })
        : Promise.resolve();
    },
    insertPromotionLoan: () => {
      const confirm = window.confirm(
        'Êtes-vous sûr de vouloir créer un nouveau dossier pour le lier à cette promotion ?',
      );

      return confirm
        ? adminLoanInsert
            .run({})
            .then(loanId =>
              loanLinkPromotion.run({
                loanId,
                promotionId: promotion._id,
              }),
            )
            .then(loanId => history.push(`/loans/${loanId}`))
        : Promise.resolve();
    },
  })),
);
