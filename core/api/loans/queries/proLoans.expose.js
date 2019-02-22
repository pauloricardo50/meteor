import { Match } from 'meteor/check';

// import LoanService from 'core/api/loans/server/LoanService';
import { makeLoanAnonymizer as makePromotionLoanAnonymizer } from '../../promotions/server/promotionServerHelpers';
import { proLoans } from '../../fragments';
import SecurityService from '../../security';
import LoanService from '../server/LoanService';
import query from './proLoans';

query.expose({
  firewall(userId, params) {
    const { promotionId, propertyId } = params;
    params.userId = userId;
    SecurityService.checkUserIsPro(userId);
    if (promotionId) {
      SecurityService.promotions.isAllowedToView({
        userId,
        promotionId,
      });
    } else if (propertyId) {
      SecurityService.properties.isAllowedToView({ propertyId, userId });
    }
  },
  validateParams: {
    promotionId: Match.Maybe(String),
    propertyId: Match.Maybe(String),
    userId: String,
  },
});

query.resolve(({ userId, promotionId, propertyId }) => {
  const loans = LoanService.fetch({
    ...(propertyId
      ? { $filters: { propertyIds: propertyId } }
      : promotionId
        ? { $filters: { 'promotionLinks._id': promotionId } }
        : {}),
    ...proLoans(),
  });

  try {
    SecurityService.checkUserIsAdmin(userId);
    return loans;
  } catch (error) {
    if (promotionId) {
      return loans.map(makePromotionLoanAnonymizer({ userId, promotionId }));
    }
    if (propertyId) {
      // TODO: Make proProperty loan anonymizer
      return loans;
    }
    return [];
  }
});
