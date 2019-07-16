// @flow
import Calculator from '../../../utils/Calculator';
import {
  PROPERTIES_COLLECTION,
  PROPERTY_CATEGORY,
  RESIDENCE_TYPE,
  PROPERTY_SOLVENCY,
} from '../../properties/propertyConstants';
import { PROMOTIONS_COLLECTION } from '../../promotions/promotionConstants';
import UserService from '../../users/server/UserService';
import { makeLoanAnonymizer as makePromotionLoanAnonymizer } from '../../promotions/server/promotionServerHelpers';
import { proLoans, revenue } from '../../fragments';
import SecurityService from '../../security';
import { makeProPropertyLoanAnonymizer } from '../../properties/server/propertyServerHelpers';
import OrganisationService from '../../organisations/server/OrganisationService';
import LoanService from './LoanService';

const isSolventForProProperty = ({
  isAdmin,
  property,
  maxPropertyValue,
  residenceType,
  shareSolvency,
}) => {
  if (!maxPropertyValue) {
    return PROPERTY_SOLVENCY.UNDETERMINED;
  }

  if (!shareSolvency && !isAdmin) {
    return PROPERTY_SOLVENCY.NOT_SHARED;
  }

  const {
    main: {
      max: { propertyValue: mainMaxValue },
    },
    second: {
      max: { propertyValue: secondMaxValue },
    },
  } = maxPropertyValue;
  const { totalValue } = property;

  switch (residenceType) {
  case RESIDENCE_TYPE.MAIN_RESIDENCE: {
    return totalValue <= mainMaxValue
      ? PROPERTY_SOLVENCY.SOLVENT
      : PROPERTY_SOLVENCY.INSOLVENT;
  }
  case RESIDENCE_TYPE.SECOND_RESIDENCE: {
    return totalValue <= secondMaxValue
      ? PROPERTY_SOLVENCY.SOLVENT
      : PROPERTY_SOLVENCY.INSOLVENT;
  }
  default:
    return null;
  }
};

const handleLoanSolvencySharing = ({ isAdmin = false }) => (loanObject) => {
  const { maxPropertyValue, shareSolvency, ...loan } = loanObject;

  const propertiesWithSolvency = loan.properties.map(property => ({
    ...property,
    solvent: isSolventForProProperty({
      isAdmin,
      property,
      maxPropertyValue,
      residenceType: loan.residenceType,
      shareSolvency,
    }),
  }));

  return {
    ...loan,
    properties: propertiesWithSolvency,
  };
};

const anonymizePromotionLoans = ({ loans = [], userId }) =>
  loans.map((loan) => {
    const { promotions } = loan;
    const promotionId = promotions[0]._id;

    const promotionLoanAnonymizer = makePromotionLoanAnonymizer({
      userId,
      promotionId,
    });

    return promotionLoanAnonymizer(loan);
  });

const anonymizePropertyLoans = ({ loans = [], userId }) =>
  loans.map((loan) => {
    const { properties } = loan;
    const proPropertyIds = properties
      .filter(({ category }) => category === PROPERTY_CATEGORY.PRO)
      .map(({ _id }) => _id);
    return makeProPropertyLoanAnonymizer({
      userId,
      propertyIds: proPropertyIds,
    })(loan);
  });

const anonymizeReferredByLoans = ({ loans = [], userId }) => [
  ...loans,
  // Don't anonymize referred loans
  // ...anonymizePromotionLoans({
  //   loans: loans.filter(({ hasPromotion }) => hasPromotion),
  //   userId,
  // }),

  // ...anonymizePropertyLoans({
  //   loans: loans.filter(({ hasProProperty }) => hasProProperty),
  //   userId,
  // }),
  // ...loans.filter(({ hasPromotion, hasProProperty }) => !hasPromotion && !hasProProperty),
];

const doesUserShareCustomers = (user) => {
  const {
    $metadata: { shareCustomers },
  } = user;
  return shareCustomers;
};

export const proReferredByLoansResolver = ({ userId, calledByUserId }) => {
  const mainOrganisationId = UserService.getUserMainOrganisationId(userId);
  const { users: mainOrganisationUsers = [] } = OrganisationService.fetchOne({
    $filters: { _id: mainOrganisationId },
    users: { _id: 1 },
  });
  const mainOrganisationsUserIds = mainOrganisationUsers
    .filter(({ _id }) => _id !== userId)
    .filter(doesUserShareCustomers)
    .map(({ _id }) => _id);

  const users = UserService.fetch({
    $filters: {
      referredByUserLink: {
        $in: [userId, ...mainOrganisationsUserIds],
      },
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
    return loans.map(handleLoanSolvencySharing({ isAdmin: true }));
  } catch (error) {
    return anonymizePropertyLoans({
      loans: loans.map(handleLoanSolvencySharing({ isAdmin: false })),
      userId: calledByUserId,
    });
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

const getRelatedProPropertiesOfUser = ({ loan, userId }) => {
  const { properties = [] } = loan;
  return properties
    .filter(property => property.category === PROPERTY_CATEGORY.PRO)
    .filter(({ users = [] }) => users.some(({ _id }) => _id === userId))
    .map(property => ({ ...property, collection: PROPERTIES_COLLECTION }));
};

const getRelatedPromotionsOfUser = ({ loan, userId }) => {
  const { promotions = [] } = loan;
  return promotions
    .filter(({ users = [] }) => users.some(({ _id }) => _id === userId))
    .map(promotion => ({
      ...promotion,
      collection: PROMOTIONS_COLLECTION,
    }));
};

const organisationLoans = organisationId =>
  LoanService.fetch({
    $filters: { 'userCache.referredByOrganisationLink': organisationId },
    ...proLoans(),
    revenues: revenue(),
    user: { organisationLink: 1 },
  });

export const proLoansResolver = ({
  userId,
  calledByUserId,
  promotionId,
  propertyId,
  showAnonymizedPromotionLoans = false,
  fetchOrganisationLoans,
  organisationId,
}) => {
  let loans = [];

  if (fetchOrganisationLoans) {
    return organisationLoans(organisationId);
  }

  if (promotionId) {
    const promotionLoans = proPromotionLoansResolver({
      calledByUserId,
      promotionId,
    })
      .filter(shouldShowPromotionLoan({ showAnonymizedPromotionLoans, userId }))
      .map(loan => ({
        ...loan,
        relatedTo: getRelatedPromotionsOfUser({ loan, userId }),
      }));
    loans = promotionLoans;
  }

  if (propertyId) {
    const propertyLoans = proPropertyLoansResolver({
      calledByUserId,
      propertyId,
    }).map(loan => ({
      ...loan,
      relatedTo: getRelatedProPropertiesOfUser({ loan, userId }),
    }));
    loans = [...loans, ...propertyLoans];
  }

  const referredByLoans = proReferredByLoansResolver({
    userId,
    calledByUserId,
  }).map(loan => ({
    ...loan,
    relatedTo: [
      ...getRelatedProPropertiesOfUser({ loan, userId }),
      ...getRelatedPromotionsOfUser({ loan, userId }),
    ],
  }));
  loans = [...loans, ...referredByLoans];

  return filterLoans(loans);
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
