import PropertyCalculator from 'core/utils/Calculator/PropertyCalculator';
import BorrowerCalculator from 'core/utils/Calculator/BorrowerCalculator';
import { createRoute } from 'core/utils/routerUtils';
import { VALUATION_STATUS } from '../../../../core/api/constants';
import {
  FINANCING_PAGE,
  PROPERTIES_PAGE,
  PROPERTY_PAGE,
  BORROWERS_PAGE,
} from '../../../../startup/client/appRoutes';

const createFinancingLink = ({ _id: loanId }) =>
  createRoute(FINANCING_PAGE, { ':loanId': loanId });

const createSinglePropertyLink = ({ _id: loanId, structure: { propertyId } }) =>
  createRoute(PROPERTY_PAGE, {
    ':loanId': loanId,
    ':propertyId': propertyId,
  });

export const dashboardTodosArray = [
  {
    id: 'createStructure',
    condition: ({ structures }) => structures.length === 0,
    link: createFinancingLink,
  },
  {
    id: 'addProperty',
    condition: ({ properties }) => properties.length === 0,
    link: ({ _id: loanId }) =>
      createRoute(PROPERTIES_PAGE, { ':loanId': loanId }),
  },
  {
    id: 'completeProperty',
    condition: (loan) => {
      const {
        structure: { property },
      } = loan;

      if (!property) {
        return false;
      }

      const percent = PropertyCalculator.propertyPercent({ loan, property });

      if (percent < 1) {
        return true;
      }

      return false;
    },
    link: createSinglePropertyLink,
  },
  {
    id: 'doAnExpertise',
    condition: ({ structure: { property } }) =>
      property && property.valuation.status === VALUATION_STATUS.NONE,
    link: createSinglePropertyLink,
  },
  {
    id: 'completeBorrowers',
    condition: ({ borrowers }) => {
      const percentages = borrowers.map(borrower =>
        BorrowerCalculator.personalInfoPercent({ borrowers: borrower }));

      if (percentages.some(percent => percent < 1)) {
        return true;
      }

      return false;
    },
    link: ({ _id: loanId }) =>
      createRoute(BORROWERS_PAGE, { ':loanId': loanId, ':tabId': 'personal' }),
  },
  {
    id: 'chooseOffer',
    condition: ({ offers, structure: { offer } }) =>
      offers.length > 0 && !offer,
    hide: ({ offers }) => offers.length === 0,
    link: createFinancingLink,
  },
  {
    id: 'createSecondStructure',
    condition: ({ structures }) => structures.length === 1,
    hide: ({ structures }) => structures.length === 0,
    link: createFinancingLink,
  },
  {
    id: 'callEpotek',
    hide: params =>
      dashboardTodosArray
        .filter(({ id }) => id !== 'callEpotek')
        .some(({ condition }) => condition(params)),
    condition: () => true,
  },
];

export const dashboardTodosObject = dashboardTodosArray.reduce(
  (acc, todo) => ({ ...acc, [todo.id]: todo }),
  {},
);
