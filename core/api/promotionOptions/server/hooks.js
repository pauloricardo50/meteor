import LoanService from '../../loans/server/LoanService';
import PromotionOptions from '..';

PromotionOptions.before.remove((userId, { _id: promotionOptionId }) => {
  // Remove all references to this promotionOption on the loan
  const loans = LoanService.find({
    'promotionOptionLinks._id': promotionOptionId,
  }).fetch();

  loans.forEach(loan => {
    LoanService.update({
      loanId: loan._id,
      object: {
        structures: loan.structures.map(structure => ({
          ...structure,
          promotionOptionId:
            structure.promotionOptionId === promotionOptionId
              ? null
              : structure.promotionOptionId,
        })),
      },
    });
  });
});
