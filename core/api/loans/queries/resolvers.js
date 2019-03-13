import Calculator from 'core/utils/Calculator';
import UserService from '../../users/server/UserService';
import { makeLoanAnonymizer as makePromotionLoanAnonymizer } from '../../promotions/server/promotionServerHelpers';
import { proLoans } from '../../fragments';
import SecurityService from '../../security';
import LoanService from '../server/LoanService';
import { makeProPropertyLoanAnonymizer } from '../../properties/server/propertyServerHelpers';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { PROPERTIES_COLLECTION } from 'core/api/properties/propertyConstants';

const anonymizePromotionLoans = ({ loans = [], userId }) =>
  loans.map((loan) => {
    const { promotions } = loan;
    const promotionId = promotions[0]._id;
    return makePromotionLoanAnonymizer({ userId, promotionId })(loan);
  });

const anonymizePropertyLoans = ({ loans = [], userId }) =>
  loans.map((loan) => {
    const { properties } = loan;
    const propertyId = properties[0]._id;
    return makeProPropertyLoanAnonymizer({ userId, propertyId })(loan);
  });

const anonymizeReferredByLoans = ({ loans = [], userId }) => [
  ...anonymizePromotionLoans({
    loans: loans.filter(({ hasPromotion }) => hasPromotion),
    userId,
  }),

  ...anonymizePropertyLoans({
    loans: loans.filter(({ hasProProperty }) => hasProProperty),
    userId,
  }),
  ...loans.filter(({ hasPromotion, hasProProperty }) => !hasPromotion && !hasProProperty),
];

export const proReferredByLoansResolver = ({ userId, calledByUserId }) => {
  const { organisations = [] } = UserService.fetch({
    $filters: { _id: userId },
    organisations: { _id: 1 },
  });

  const organisationId = !!organisations.length && organisations[0]._id;

  const users = UserService.fetch({
    $filters: {
      $or: [
        { referredByUserLink: userId },
        organisationId && { referredByOrganisationLink: organisationId },
      ].filter(x => x),
    },
    loans: proLoans(),
  });

  const loans = users.reduce(
    (allLoans, { loans: userLoans = [] }) => [...allLoans, ...userLoans],
    [],
  );

  try {
    SecurityService.checkUserIsAdmin(calledByUserId);
    return loans;
  } catch (error) {
    return anonymizeReferredByLoans({ loans, userId: calledByUserId });
  }
};

export const proPromotionLoansResolver = ({ calledByUserId, promotionId }) => {
  const loans = LoanService.fetch({
    $filters: { 'promotionLinks._id': promotionId },
    ...proLoans(),
  });

  try {
    SecurityService.checkUserIsAdmin(calledByUserId);
    return loans;
  } catch (error) {
    return anonymizePromotionLoans({ loans, userId: calledByUserId });
  }
};

export const proPropertyLoansResolver = ({ calledByUserId, propertyId }) => {
  const loans = LoanService.fetch({
    $filters: { propertyIds: propertyId },
    ...proLoans(),
  });

  try {
    SecurityService.checkUserIsAdmin(calledByUserId);
    return loans;
  } catch (error) {
    return anonymizePropertyLoans({ loans, userId: calledByUserId });
  }
};

const filterLoans = (loans = []) =>
  loans.reduce((filteredLoans, currentLoan) => {
    if (filteredLoans.some(loan => loan._id === currentLoan._id)) {
      return filteredLoans;
    }

    return [...filteredLoans, currentLoan];
  }, []);

const getLoanEstimatedRevenues = (loan) => {
  if (loan.structure) {
    return {
      ...loan,
      estimatedRevenues: Calculator.getEstimatedReferralRevenues({ loan }),
    };
  }
  return loan;
};

const shouldShowPromotionLoan = ({
  showAnonymizedPromotionLoans,
  userId,
}) => (loan) => {
  const { promotions = [] } = loan;
  const {
    $metadata: { invitedBy },
  } = promotions[0];
  return showAnonymizedPromotionLoans || invitedBy === userId;
};

export const proLoansResolver = ({
  userId,
  calledByUserId,
  promotionId,
  propertyId,
  showAnonymizedPromotionLoans = false,
}) => {
  let loans = [];

  if (promotionId) {
    const promotionLoans = proPromotionLoansResolver({
      calledByUserId,
      promotionId,
    })
      .filter(shouldShowPromotionLoan({ showAnonymizedPromotionLoans, userId }))
      .map(loan => ({ ...loan, relatedTo: {...loan.promotions[0], collection: PROMOTIONS_COLLECTION} }));
    loans = promotionLoans;
  }

  if (propertyId) {
    const propertyLoans = proPropertyLoansResolver({
      calledByUserId,
      propertyId,
    }).map(loan => ({ ...loan, relatedTo: {...loan.properties[0], collection: PROPERTIES_COLLECTION} }));
    loans = [...loans, ...propertyLoans];
  }

  const referredByLoans = proReferredByLoansResolver({
    userId,
    calledByUserId,
  });
  loans = [...loans, ...referredByLoans];

  return filterLoans(loans).map(getLoanEstimatedRevenues);
};

export const getLoanIds = ({ withReferredBy = false } = {}) => (params = {}) => {
  const { promotionId, propertyId, userId } = params;
  let loanIds = [];

  if (withReferredBy) {
    const { organisations = [] } = UserService.fetch({
      $filters: { _id: userId },
      organisations: { _id: 1 },
    });

    const organisationId = !!organisations.length && organisations[0]._id;

    const users = UserService.fetch({
      $filters: {
        $or: [
          { referredByUserLink: userId },
          organisationId && { referredByOrganisationLink: organisationId },
        ].filter(x => x),
      },
      loans: { _id: 1 },
    });

    loanIds = users.reduce(
      (allLoans, { loans: userLoans = [] }) => [
        ...allLoans,
        ...userLoans.map(({ _id }) => _id),
      ],
      [],
    );
  }

  if (promotionId) {
    const promotionLoanIds = LoanService.fetch({
      $filters: { 'promotionLinks._id': promotionId },
      _id: 1,
    });
    loanIds = [...loanIds, ...promotionLoanIds.map(({ _id }) => _id)];
  }

  if (propertyId) {
    const propertyLoanIds = LoanService.fetch({
      $filters: { propertyIds: propertyId },
      _id: 1,
    });
    loanIds = [...loanIds, ...propertyLoanIds.map(({ _id }) => _id)];
  }

  return loanIds;
};
