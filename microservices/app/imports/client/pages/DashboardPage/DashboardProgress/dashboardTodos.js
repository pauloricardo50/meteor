import { PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';
import Calculator from 'core/utils/Calculator';
import { createRoute } from 'core/utils/routerUtils';

import APP_ROUTES from '../../../../startup/client/appRoutes';

const createFinancingLink = ({ _id: loanId }) =>
  createRoute(APP_ROUTES.FINANCING_PAGE.path, { ':loanId': loanId });

const createPropertiesLink = ({ _id: loanId }) =>
  createRoute(APP_ROUTES.PROPERTIES_PAGE.path, { loanId });

const createSinglePropertyLink = ({
  _id: loanId,
  structure: { propertyId } = {},
}) =>
  propertyId
    ? createRoute(APP_ROUTES.PROPERTY_PAGE.path, { loanId, propertyId })
    : createPropertiesLink({ _id: loanId });

export const checkArrayIsDone = (array = [], params) =>
  array
    .filter(({ id }) => id !== 'callEpotek')
    .every(({ isDone, hide }) =>
      hide ? hide(params) || isDone(params) : isDone(params),
    );

export const disablePropertyTodos = ({ structure: { property } = {} }) =>
  !property || property.category === PROPERTY_CATEGORY.PRO;

export const promotionTodoList = {
  completeBorrowers: true,
  solvency: true,
  uploadDocuments: true,
  chooseLots: true,
  callEpotek: true,
};

export const defaultTodoList = {
  addProperty: true,
  completeBorrowers: true,
  solvency: true,
  completeProperty: true,
  completeRefinancing: true,
  doAnExpertise: true,
  completeFirstStructure: true,
  createSecondStructure: true,
  uploadDocuments: true,
  chooseOffer: true,
  callEpotek: true,
};

export const getDashboardTodosArray = list =>
  [
    {
      id: 'completeBorrowers',
      isDone: ({ borrowers }) => {
        const percentages = borrowers.map(borrower =>
          Calculator.personalInfoPercent({ borrowers: borrower }),
        );

        if (percentages.some(percent => percent >= 1)) {
          return true;
        }

        return false;
      },
      link: ({ _id: loanId }) =>
        createRoute(APP_ROUTES.BORROWERS_PAGE.path, {
          loanId,
          tabId: 'personal',
        }),
    },
    {
      id: 'solvency',
      isDone: ({ maxPropertyValue }) =>
        maxPropertyValue && maxPropertyValue.date,
      link: ({ _id: loanId }) =>
        createRoute(APP_ROUTES.SOLVENCY_PAGE.path, {
          loanId,
          tabId: 'personal',
        }),
    },
    {
      id: 'addProperty',
      isDone: loan => {
        const { properties } = loan;
        return properties && properties.length > 0;
      },
      hide: ({ properties = [] }) =>
        properties.some(({ category }) => category === PROPERTY_CATEGORY.PRO),
      link: createSinglePropertyLink,
    },
    {
      id: 'completeProperty',
      isDone: loan => {
        const {
          structure: { property },
        } = loan;

        if (!property) {
          return false;
        }

        const percent = Calculator.propertyPercent({ loan, property });

        if (percent >= 1) {
          return true;
        }

        return false;
      },
      hide: disablePropertyTodos,
      link: createSinglePropertyLink,
    },
    {
      id: 'completeRefinancing',
      isDone: loan => {
        const percent = Calculator.refinancingPercent({ loan });

        if (percent >= 1) {
          return true;
        }

        return false;
      },
      hide: ({ purchaseType }) => purchaseType !== PURCHASE_TYPE.REFINANCING,
      link: ({ _id: loanId }) =>
        createRoute(APP_ROUTES.REFINANCING_PAGE.path, { loanId }),
    },
    {
      id: 'completeFirstStructure',
      isDone: loan => Calculator.hasCompleteStructure({ loan }),
      link: createFinancingLink,
    },
    {
      id: 'createSecondStructure',
      isDone: ({ structures }) => structures && structures.length > 1,
      hide: ({ structures }) => structures && structures.length === 0,
      link: createFinancingLink,
    },
    {
      id: 'chooseLots',
      isDone: loan => loan.promotionOptions && loan.promotionOptions.length > 0,
      link: createPropertiesLink,
    },
    {
      id: 'uploadDocuments',
      isDone: loan => Calculator.filesProgress({ loan }).percent >= 1,
      link: ({ _id: loanId }) =>
        createRoute(APP_ROUTES.FILES_PAGE.path, { ':loanId': loanId }),
    },
    {
      id: 'chooseOffer',
      isDone: ({ offers, structure: { offer } }) =>
        offers.length > 0 && !!offer,
      hide: ({ offers }) => !offers || offers.length === 0,
      link: createFinancingLink,
    },
    {
      id: 'callEpotek',
      hide: params => !checkArrayIsDone(getDashboardTodosArray(list), params),
      isDone: () => false,
    },
  ].filter(({ id }) => (list ? list[id] : true));

export const dashboardTodosObject = getDashboardTodosArray().reduce(
  (acc, todo) => ({ ...acc, [todo.id]: todo }),
  {},
);
