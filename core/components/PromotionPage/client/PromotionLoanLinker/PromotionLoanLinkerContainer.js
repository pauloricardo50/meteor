import { withState, compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import { loanSearch } from 'core/api/loans/queries';
import {
  loanLinkPromotion,
  loanUnlinkPromotion,
  adminLoanInsert,
} from 'core/api/methods';

export default compose(
  withRouter,
  withState('searchQuery', 'setSearchQuery', ''),
  withState('searchResults', 'setSearchResults', []),
  withProps(({ searchQuery, setSearchResults, promotion, history }) => ({
    onSearch: (event) => {
      event.preventDefault();
      loanSearch.clone({ searchQuery }).fetch((err, loans) => {
        if (err) {
          throw err;
        }
        setSearchResults(promotion.promotionLoan
          ? loans.filter(loan => promotion.promotionLoan._id !== loan._id)
          : loans);
      });
    },
    linkPromotionLoan: ({ loanId }) => {
      const confirm = window.confirm('Êtes-vous sûr de vouloir lier ce dossier à cette promotion ?');

      return confirm
        ? loanLinkPromotion.run({
          loanId,
          promotionId: promotion._id,
          promotionName: promotion.name,
        })
        : Promise.resolve();
    },
    unlinkPromotionLoan: ({ loanId }) => {
      const confirm = window.confirm('Êtes-vous sûr de vouloir délier ce dossier de cette promotion ?');

      return confirm
        ? loanUnlinkPromotion.run({ loanId, promotionId: promotion._id })
        : Promise.resolve();
    },
    insertPromotionLoan: () => {
      const confirm = window.confirm('Êtes-vous sûr de vouloir créer un nouveau dossier pour le lier à cette promotion ?');

      return confirm
        ? adminLoanInsert
          .run({})
          .then(loanId =>
            loanLinkPromotion.run({
              loanId,
              promotionId: promotion._id,
              promotionName: promotion.name,
            }))
          .then(loanId => history.push(`/loans/${loanId}`))
        : Promise.resolve();
    },
  })),
);
