import LoanService from 'core/api/loans/server/LoanService';
import { proLoans } from 'core/api/fragments';
import query from './proLoans';
import SecurityService from '../../security';
import { handleLoansAnonymization } from '../../promotions/server/promotionServerHelpers';

query.expose({
  firewall(userId, params) {
    const { promotionId } = params;
    params.userId = userId;
    SecurityService.checkUserIsPro(userId);
    SecurityService.promotions.isAllowedToView({
      userId,
      promotionId,
    });
  },
  validateParams: { promotionId: String, userId: String },
});

query.resolve(({ userId, promotionId }) => {
  const loans = LoanService.fetch({
    $filters: { 'promotionLinks._id': promotionId },
    ...proLoans(),
  });

  try {
    SecurityService.checkUserIsAdmin(userId);
    return loans;
  } catch (error) {
    return handleLoansAnonymization({ loans, userId, promotionId });
  }
});
