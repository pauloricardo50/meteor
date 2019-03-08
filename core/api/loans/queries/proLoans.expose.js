// import LoanService from 'core/api/loans/server/LoanService';
import { makeLoanAnonymizer } from '../../promotions/server/promotionServerHelpers';
import { proLoans } from '../../fragments';
import SecurityService from '../../security';
import LoanService from '../server/LoanService';
import query from './proLoans';

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
    return loans.map(makeLoanAnonymizer({ userId, promotionId }));
  }
});
