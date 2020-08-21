import Calculator from '../../../utils/Calculator';
import LoanService from '../../loans/server/LoanService';
import UserService from '../../users/server/UserService';

const commonFragment = {
  purchaseType: 1,
  hasPromotion: 1,
  hasProProperty: 1,
  anonymous: 1,
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
  } = loan;
  const commonProperties = {
    anonymous,
    purchaseType,
    loanId,
  };

  switch (previousStep) {
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
    assignedEmployee: { intercomId: 1, name: 1 },
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
  };
};

export const getOnboardingStepProperties = ({ context, params }) => {
  const { loanId, activeStep, previousStep } = params;
  const { userId } = context;

  const fragment = { ...commonFragment, ...previousStepFragment[previousStep] };

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
