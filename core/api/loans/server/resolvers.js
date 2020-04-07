import intersectDeep from 'meteor/cultofcoders:grapher/lib/query/lib/intersectDeep';

import merge from 'lodash/merge';

import { proLoans } from '../../fragments';
import { makeLoanAnonymizer as makePromotionLoanAnonymizer } from '../../promotions/server/promotionServerHelpers';
import {
  PROPERTY_CATEGORY,
  PROPERTY_SOLVENCY,
  RESIDENCE_TYPE,
} from '../../properties/propertyConstants';
import { makeProPropertyLoanAnonymizer } from '../../properties/server/propertyServerHelpers';
import SecurityService from '../../security';
import UserService from '../../users/server/UserService';
import LoanService from './LoanService';

const proLoansFragment = proLoans();
// These fields are required to get the solvency right
const requiredData = {
  residenceType: 1,
  shareSolvency: 1,
  maxPropertyValue: 1,
  property: { totalValue: 1 },
};

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
      return PROPERTY_SOLVENCY.PICK_RESIDENCE_TYPE;
  }
};

const handleLoanSolvencySharing = ({ isAdmin = false }) => loanObject => {
  // Remove these 2 properties from the loan
  const { maxPropertyValue, shareSolvency, properties, ...loan } = loanObject;

  const propertiesWithSolvency = properties.map(property => ({
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
  const currentUser = UserService.get(userId, {
    promotions: { _id: 1 },
    organisations: { users: { _id: 1 } },
  });

  const promotionLoanAnonymizer = makePromotionLoanAnonymizer({
    currentUser,
  });

  return loans.map(loan => promotionLoanAnonymizer(loan));
};

const anonymizePropertyLoans = ({ loans = [], userId }) => {
  const currentUser = UserService.get(userId, {
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
  $body,
}) => {
  const fragment = $body
    ? intersectDeep(proLoansFragment, $body)
    : proLoansFragment;
  const loans = LoanService.fetch({
    $filters: {
      propertyIds: propertyId,
      status,
      anonymous,
      'userCache.referredByUserLink': referredByUserId,
    },
    ...merge({}, fragment, requiredData),
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
      ...anonymizePropertyLoans({ loans: commonLoans, userId: calledByUserId }),
    ];
  }
};
