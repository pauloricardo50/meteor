import { Match } from 'meteor/check';

// import LoanService from 'core/api/loans/server/LoanService';
import { makeLoanAnonymizer as makePromotionLoanAnonymizer } from '../../promotions/server/promotionServerHelpers';
import { proLoans } from '../../fragments';
import SecurityService from '../../security';
import LoanService from '../server/LoanService';
import query from './proLoans';

const anonymizeLoans = ({ loans = [], userId, propertyId, promotionId }) => {
  let anonymizedLoans = [];
  if (promotionId) {
    anonymizedLoans = [
      ...anonymizedLoans,
      ...loans
        .filter(({ hasPromotion }) => hasPromotion)
        .map(makePromotionLoanAnonymizer({ userId, promotionId })),
    ];
  }
  if (propertyId) {
    // TODO: Make proProperty loan anonymizer
    anonymizedLoans = [
      ...anonymizedLoans,
      ...loans.filter(({ hasProProperty }) => hasProProperty),
    ];
  }
  return anonymizedLoans;
};

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
    }
    if (propertyId) {
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
  let loans = [];
  if (promotionId) {
    const promotionLoans = LoanService.fetch({
      $filters: { 'promotionLinks._id': promotionId },
      ...proLoans(),
    });

    loans = [...loans, ...promotionLoans];
  }
  if (propertyId) {
    const proPropertyLoans = LoanService.fetch({
      $filters: { propertyIds: propertyId },
      ...proLoans(),
    });

    loans = [...loans, ...proPropertyLoans];
  }

  try {
    SecurityService.checkUserIsAdmin(userId);
    return loans;
  } catch (error) {
    return anonymizeLoans({ loans, userId, propertyId, promotionId });
  }
});
