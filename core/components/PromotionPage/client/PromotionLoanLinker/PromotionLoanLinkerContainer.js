import { withState, compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import { loanSearch } from 'core/api/loans/queries';
import {
  promotionLinkLoan,
  promotionRemoveLinkLoan,
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
    linkPromotionLoan: ({ loanId }) =>
      promotionLinkLoan.run({ loanId, promotionId: promotion._id }),
    unlinkPromotionLoan: ({ loanId }) =>
      promotionRemoveLinkLoan.run({ loanId, promotionId: promotion._id }),
    insertPromotionLoan: () =>
      adminLoanInsert
        .run({})
        .then(loanId =>
          promotionLinkLoan.run({ loanId, promotionId: promotion._id }))
        .then(loanId => history.push(`/loans/${loanId}`)),
  })),
);
