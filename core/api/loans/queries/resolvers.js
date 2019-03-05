import UserService from '../../users/server/UserService';
import { makeLoanAnonymizer as makePromotionLoanAnonymizer } from '../../promotions/server/promotionServerHelpers';
import { proLoans } from '../../fragments';
import SecurityService from '../../security';
import LoanService from '../server/LoanService';

const anonymizePromotionLoans = ({ loans = [], userId }) =>
  loans.map((loan) => {
    const { promotions } = loan;
    const promotionId = promotions[0]._id;
    return makePromotionLoanAnonymizer({ userId, promotionId })(loan);
  });

// TODO: property loans anonymizer
const anonymizePropertyLoans = ({ loans = [], userId }) => loans;

const anonymizeReferredByLoans = ({ loans = [], userId }) => [
  ...anonymizePromotionLoans({
    loans: loans.filter(({ hasPromotion }) => hasPromotion),
    userId,
  }),

  ...anonymizePropertyLoans({
    loans: loans.filter(({ hasProProperty }) => hasProProperty),
    userId,
  }),
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
    }).filter((loan) => {
      const { promotions = [] } = loan;
      const {
        $metadata: { invitedBy },
      } = promotions[0];
      return showAnonymizedPromotionLoans || invitedBy === userId;
    });
    loans = promotionLoans;
  }

  if (propertyId) {
    const propertyLoans = proPropertyLoansResolver({
      calledByUserId,
      propertyId,
    });
    loans = [...loans, ...propertyLoans];
  }

  const referredByLoans = proReferredByLoansResolver({
    userId,
    calledByUserId,
  });
  loans = [...loans, ...referredByLoans];

  return filterLoans(loans);
};
