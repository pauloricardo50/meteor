// @flow
import uniqBy from 'lodash/uniqBy';

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

const proLoansFragment = proLoans();

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

const doesUserShareCustomers = ({ $metadata: { shareCustomers } }) =>
  shareCustomers;

export const proReferredByLoansResolver = ({
  userId,
  calledByUserId,
  status,
  anonymous,
}) => {
  const mainOrganisation = UserService.getUserMainOrganisation(userId);
  let mainOrganisationsUserIds = [];

  if (mainOrganisation) {
    const { _id: mainOrganisationId } = mainOrganisation;

    const { users: mainOrganisationUsers = [] } = OrganisationService.fetchOne({
      $filters: { _id: mainOrganisationId },
      users: { _id: 1 },
    });
    mainOrganisationsUserIds = mainOrganisationUsers
      .filter(({ _id }) => _id !== userId)
      .filter(doesUserShareCustomers)
      .map(({ _id }) => _id);
  }

  const users = UserService.fetch({
    $filters: {
      referredByUserLink: { $in: [userId, ...mainOrganisationsUserIds] },
    },
    loans: { ...proLoansFragment, $filters: { status, anonymous } },
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

export const proPromotionLoansResolver = ({
  calledByUserId,
  promotionId,
  status,
  anonymous,
}) => {
  const loans = LoanService.fetch({
    $filters: { 'promotionLinks._id': promotionId, status, anonymous },
    ...proLoansFragment,
  });

  try {
    SecurityService.checkUserIsAdmin(calledByUserId);
    return loans;
  } catch (error) {
    return anonymizePromotionLoans({ loans, userId: calledByUserId });
  }
};

export const proPropertyLoansResolver = ({
  calledByUserId,
  propertyId,
  status,
  anonymous,
}) => {
  const loans = LoanService.fetch({
    $filters: { propertyIds: propertyId, status, anonymous },
    ...proLoansFragment,
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

const shouldShowPromotionLoan = ({ userId }) => (loan) => {
  const { promotions = [] } = loan;
  const {
    $metadata: { invitedBy },
  } = promotions[0];
  return invitedBy === userId;
};

const getRelatedProPropertiesOfUser = ({ loan, userId }) => {
  const { properties = [] } = loan;
  return properties
    .filter(property => property.category === PROPERTY_CATEGORY.PRO)
    .filter(({ users = [] }) => users.some(({ _id }) => _id === userId))
    .map(property => ({ ...property, collection: PROPERTIES_COLLECTION }));
};

const promotionHasUser = userId => ({ users = [] }) =>
  users.some(({ _id }) => _id === userId);

const getRelatedPromotionsOfUser = ({ loan, userId }) => {
  const { promotions = [] } = loan;
  return promotions
    .filter(promotionHasUser(userId))
    .map(promotion => ({ ...promotion, collection: PROMOTIONS_COLLECTION }));
};

const organisationLoans = ({ organisationId, status, anonymous }) =>
  LoanService.fetch({
    $filters: {
      'userCache.referredByOrganisationLink': organisationId,
      status,
      anonymous,
    },
    ...proLoansFragment,
    revenues: revenue(),
    user: { organisationLink: 1 },
  });

export const proLoansResolver = ({
  anonymous,
  userId,
  calledByUserId,
  promotionId,
  propertyId,
  fetchOrganisationLoans,
  organisationId,
  status,
}) => {
  let loans = [];

  if (fetchOrganisationLoans) {
    return organisationLoans({ organisationId, status, anonymous });
  }

  if (promotionId) {
    const promotionLoans = proPromotionLoansResolver({
      calledByUserId,
      promotionId,
      status,
      anonymous,
    })
      .filter(shouldShowPromotionLoan({ userId }))
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
      status,
      anonymous,
    }).map(loan => ({
      ...loan,
      relatedTo: getRelatedProPropertiesOfUser({ loan, userId }),
    }));
    loans = [...loans, ...propertyLoans];
  }

  const referredByLoans = proReferredByLoansResolver({
    userId,
    calledByUserId,
    status,
    anonymous,
  }).map(loan => ({
    ...loan,
    relatedTo: [
      ...getRelatedProPropertiesOfUser({ loan, userId }),
      ...getRelatedPromotionsOfUser({ loan, userId }),
    ],
  }));
  loans = [...loans, ...referredByLoans];

  return uniqBy(loans, '_id');
};

export const getLoanIds = ({ withReferredBy = false } = {}) => (params = {}) => {
  const { promotionId, propertyId, userId, status, anonymous } = params;
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
      loans: { _id: 1, $filters: { status, anonymous } },
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
      $filters: { 'promotionLinks._id': promotionId, status, anonymous },
      _id: 1,
    });
    loanIds = [...loanIds, ...promotionLoanIds.map(({ _id }) => _id)];
  }

  if (propertyId) {
    const propertyLoanIds = LoanService.fetch({
      $filters: { propertyIds: propertyId, status, anonymous },
      _id: 1,
    });
    loanIds = [...loanIds, ...propertyLoanIds.map(({ _id }) => _id)];
  }

  return loanIds;
};
