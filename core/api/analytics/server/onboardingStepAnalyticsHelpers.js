import merge from 'lodash/merge';

import Calculator from '../../../utils/Calculator';
import LoanService from '../../loans/server/LoanService';
import UserService from '../../users/server/UserService';

const commonFragment = {
  name: 1,
  purchaseType: 1,
  anonymous: 1,
  properties: { _id: 1 },
  promotions: { name: 1 },
};

const previousStepFragment = {
  acquisitionStatus: { acquisitionStatus: 1 },
  residenceType: { residenceType: 1 },
  canton: { properties: { canton: 1 } },
  propertyValue: { properties: { value: 1 } },
  refinancing: {
    previousLoanTranches: { value: 1 },
  },
  borrowerCount: {
    borrowers: { _id: 1 },
  },
  birthDate: {
    borrowers: { birthDate: 1 },
  },
  income: {
    borrowers: { salary: 1 },
  },
  ownFunds: {
    borrowers: { bankFortune: 1 },
  },
  result: {},
};

const getLoanProperties = ({ loan, previousStep }) => {
  const {
    anonymous,
    purchaseType,
    acquisitionStatus,
    residenceType,
    properties = [],
    borrowers = [],
    _id: loanId,
    name: loanName,
    promotions = [],
  } = loan;

  const propertyId = properties?.[0]?._id;
  const promotionId = promotions?.[0]?._id;
  const promotionName = promotions?.[0]?.name;

  const commonProperties = {
    anonymous,
    purchaseType,
    loanId,
    propertyId,
    promotionId,
    promotionName,
    loanName,
  };

  switch (previousStep) {
    case 'purchaseType':
      return commonProperties;
    case 'acquisitionStatus':
      return { ...commonProperties, acquisitionStatus };
    case 'residenceType':
      return { ...commonProperties, residenceType };
    case 'canton':
      return { ...commonProperties, canton: properties?.[0]?.canton };
    case 'propertyValue':
      return { ...commonProperties, propertyValue: properties?.[0]?.value };
    case 'refinancing':
      return {
        ...commonProperties,
        previousLoanValue: Calculator.getPreviousLoanValue({ loan }),
      };
    case 'borrowerCount':
      return { ...commonProperties, borrowerCount: borrowers.length };
    case 'birthDate': {
      const [
        { birthDate: borrower1BirthDate },
        { birthDate: borrower2BirthDate } = {},
      ] = borrowers;

      return {
        ...commonProperties,
        borrower1BirthDate,
        borrower2BirthDate,
      };
    }
    case 'income':
      return {
        ...commonProperties,
        borrowersSalary: Calculator.getSalary({ borrowers }),
      };
    case 'ownFunds':
      return {
        ...commonProperties,
        borrowersFortune: Calculator.getFortune({ borrowers }),
      };

    default:
      return commonProperties;
  }
};

const getUserProperties = userId => {
  if (!userId) {
    return {};
  }

  const user = UserService.get(userId, {
    name: 1,
    email: 1,
    referredByUser: { name: 1 },
    referredByOrganisation: { name: 1 },
    assignedEmployee: { name: 1 },
    acquisitionChannel: 1,
  });

  return {
    userId,
    userName: user?.name,
    userEmail: user?.email,
    referringUserId: user?.referredByUser?._id,
    referringUserName: user?.referredByUser?.name,
    referringOrganisationId: user?.referredByOrganisation?._id,
    referringOrganisationName: user?.referredByOrganisation?.name,
    assigneeId: user?.assignedEmployee?._id,
    assigneeName: user?.assignedEmployee?.name,
    acquisitionChannel: 1,
  };
};

export const getOnboardingStepProperties = ({ context, params }) => {
  const { loanId, activeStep, previousStep } = params;
  const { userId } = context;

  const fragment = merge(
    {},
    commonFragment,
    previousStepFragment[previousStep],
  );

  const loan = LoanService.get(loanId, fragment);

  const loanProperties = getLoanProperties({ loan, previousStep });
  const userProperties = getUserProperties(userId);

  const properties = {
    completedStep: previousStep,
    currentStep: activeStep,
    ...loanProperties,
    ...userProperties,
  };

  return properties;
};
