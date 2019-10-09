import LoanService from '../../loans/server/LoanService';
import PromotionReservationService from '../../promotionReservations/server/PromotionReservationService';
import PromotionOptions from '..';

PromotionOptions.before.remove((userId, { _id: promotionOptionId }) => {
  // Remove all references to this promotionOption on the loan
  const loans = LoanService.find({
    'promotionOptionLinks._id': promotionOptionId,
  }).fetch();

  loans.forEach((loan) => {
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

PromotionOptions.after.update(function (userId, doc, fieldNames) {
  if (fieldNames.includes('solvency')) {
    const { solvency } = doc;
    const { solvency: prevSolvency } = this.previous;
    if (solvency !== prevSolvency) {
      PromotionReservationService.baseUpdate(
        { 'promotionOptionLink._id': doc._id },
        {
          $set: {
            mortgageCertification: { status: solvency, date: new Date() },
          },
        },
      );
    }
  }
});
