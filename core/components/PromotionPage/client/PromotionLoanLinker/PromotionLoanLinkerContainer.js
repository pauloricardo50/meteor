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
        setSearchResults(promotion.promotionLoan && !!promotion.promotionLoan.length
          ? loans.filter(loan => promotion.promotionLoan[0]._id !== loan._id)
          : loans);
      });
    },
    linkPromotionLoan: ({ loanId }) =>
      loanLinkPromotion.run({
        loanId,
        promotionId: promotion._id,
        promotionName: promotion.name,
      }),
    unlinkPromotionLoan: ({ loanId }) =>
      loanUnlinkPromotion.run({ loanId, promotionId: promotion._id }),
    insertPromotionLoan: () =>
      adminLoanInsert
        .run({})
        .then(loanId =>
          loanLinkPromotion.run({
            loanId,
            promotionId: promotion._id,
            promotionName: promotion.name,
          }))
        .then(loanId => history.push(`/loans/${loanId}`)),
  })),
);
