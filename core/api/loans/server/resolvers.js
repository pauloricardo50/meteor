// @flow
import { getPromotionCustomerOwnerType } from 'core/api/promotions/promotionClientHelpers';
import {
  PROPERTY_CATEGORY,
  RESIDENCE_TYPE,
  PROPERTY_SOLVENCY,
} from '../../properties/propertyConstants';
import UserService from '../../users/server/UserService';
import { makeLoanAnonymizer as makePromotionLoanAnonymizer } from '../../promotions/server/promotionServerHelpers';
import { proLoans } from '../../fragments';
import SecurityService from '../../security';
import { makeProPropertyLoanAnonymizer } from '../../properties/server/propertyServerHelpers';
import OrganisationService from '../../organisations/server/OrganisationService';
import LoanService from './LoanService';
import { LOAN_STATUS } from '../loanConstants';

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

const handleLoanSolvencySharing = ({ isAdmin = false }) => loanObject => {
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

const anonymizePromotionLoans = ({ loans = [], userId }) => {
  const currentUser = UserService.fetchOne({
    $filters: { _id: userId },
    promotions: { _id: 1 },
    organisations: { users: { _id: 1 } },
  });

  return loans.map(loan => {
    const promotionLoanAnonymizer = makePromotionLoanAnonymizer({
      currentUser,
    });

    return promotionLoanAnonymizer(loan);
  });
};

const anonymizePropertyLoans = ({ loans = [], userId }) => {
  const currentUser = UserService.fetchOne({
    $filters: { _id: userId },
    organisations: { users: { _id: 1 } },
    proProperties: { _id: 1 },
  });
  return loans.map(loan => {
    const { properties } = loan;
    const proProperties = properties.filter(
      ({ category }) => category === PROPERTY_CATEGORY.PRO,
    );
    return makeProPropertyLoanAnonymizer({
      proProperties,
      currentUser,
    })(loan);
  });
};

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
  referredByUserId,
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
    loans: {
      ...proLoansFragment,
      $filters: {
        status,
        anonymous,
        'userCache.referredByUserLink': referredByUserId,
      },
    },
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
  referredByUserId,
}) => {
  const loans = LoanService.fetch({
    $filters: {
      'promotionLinks._id': promotionId,
      status,
      anonymous,
      'userCache.referredByUserLink': referredByUserId,
    },
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
  referredByUserId,
}) => {
  const loans = LoanService.fetch({
    $filters: {
      propertyIds: propertyId,
      status,
      anonymous,
      'userCache.referredByUserLink': referredByUserId,
    },
    ...proLoansFragment,
    loanProgress: 0,
  });

  try {
    SecurityService.checkUserIsAdmin(calledByUserId);
    return loans.map(handleLoanSolvencySharing({ isAdmin: true }));
  } catch (error) {
    const anonymousLoans = loans
      .filter(({ anonymous: isAnonymous }) => isAnonymous)
      .map(handleLoanSolvencySharing({ isAdmin: false }));
    const commonLoans = loans
      .filter(({ anonymous: isAnonymous }) => !isAnonymous)
      .map(handleLoanSolvencySharing({ isAdmin: false }));

    return [
      ...anonymousLoans,
      ...anonymizePropertyLoans({
        loans: commonLoans.map(handleLoanSolvencySharing({ isAdmin: false })),
        userId: calledByUserId,
      }),
    ];
  }
};
