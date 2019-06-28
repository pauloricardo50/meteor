import { withState, compose, withProps } from 'recompose';
import { loanSearch } from 'core/api/loans/queries';
import { promotionLinkLoan } from 'core/api/methods';
import { promotionRemoveLinkLoan } from 'core/api/methods/index';

export default compose(
  withState('searchQuery', 'setSearchQuery', ''),
  withState('searchResults', 'setSearchResults', []),
  withProps(({ searchQuery, setSearchResults, promotion }) => ({
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
      unlinkPromotionLoan: ({loanId}) => promotionRemoveLinkLoan.run({loanId, promotionId: promotion._id})
  })),
);
