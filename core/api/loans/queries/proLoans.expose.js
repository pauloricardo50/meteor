import { Match } from 'meteor/check';

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
  validateParams: {
    promotionId: Match.Maybe(String),
    propertyId: Match.Maybe(String),
    userId: String,
  },
});

query.resolve(({ userId, promotionId }) => {
  const loans = LoanService.fetch({
    $filter({ filters, params: { promotionId, propertyId } }) {
      if (promotionId) {
        filters['promotionLinks._id'] = promotionId;
      } else if (propertyId) {
        filters.propertyIds = propertyId;
      }
    },
    ...proLoans(),
  });

  try {
    SecurityService.checkUserIsAdmin(userId);
    return loans;
  } catch (error) {
    return loans.map(makeLoanAnonymizer({ userId, promotionId }));
  }
});
