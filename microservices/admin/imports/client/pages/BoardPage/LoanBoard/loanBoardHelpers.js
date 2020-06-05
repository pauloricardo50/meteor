import { Meteor } from 'meteor/meteor';

import React from 'react';
import get from 'lodash/get';
import _groupBy from 'lodash/groupBy';
import _orderBy from 'lodash/orderBy';
import moment from 'moment';

import { LOAN_STATUS, LOAN_STATUS_ORDER } from 'core/api/loans/loanConstants';
import Calculator from 'core/utils/Calculator';

import { ACTIONS, GROUP_BY, SORT_BY, SORT_ORDER } from './loanBoardConstants';

export const makeSortColumns = ({ groupBy }, { promotions, admins }) => {
  switch (groupBy) {
    case GROUP_BY.STATUS: {
      const statuses = LOAN_STATUS_ORDER;
      return ({ id: statusA }, { id: statusB }) =>
        statuses.indexOf(statusA) - statuses.indexOf(statusB);
    }
    case GROUP_BY.PROMOTION: {
      return ({ id: idA }, { id: idB }) => {
        const promotionA = promotions.find(({ _id }) => idA === _id);
        const nameA = promotionA ? promotionA.name : '';
        const promotionB = promotions.find(({ _id }) => idB === _id);
        const nameB = promotionB ? promotionB.name : '';
        return nameA.localeCompare(nameB);
      };
    }
    case GROUP_BY.ADMIN: {
      return ({ id: idA }, { id: idB }) => {
        const adminA = admins.find(({ _id }) => idA === _id);
        const nameA = adminA ? adminA.firstName : '';
        const adminB = admins.find(({ _id }) => idB === _id);
        const nameB = adminB ? adminB.firstName : '';

        return nameA.localeCompare(nameB);
      };
    }

    default:
      return () => true;
  }
};

const getMissingColumns = (groupBy, groups) => {
  switch (groupBy) {
    case GROUP_BY.STATUS: {
      return LOAN_STATUS_ORDER.filter(
        status =>
          status !== LOAN_STATUS.UNSUCCESSFUL &&
          status !== LOAN_STATUS.TEST &&
          status !== LOAN_STATUS.FINALIZED &&
          !groups.includes(status),
      );
    }

    default:
      return [];
  }
};

// A more helpful sorting order when viewing lots of loans
const loanBoardStatusOrder = [
  LOAN_STATUS.UNSUCCESSFUL,
  LOAN_STATUS.PENDING,
  LOAN_STATUS.LEAD,
  LOAN_STATUS.QUALIFIED_LEAD,
  LOAN_STATUS.ONGOING,
  LOAN_STATUS.CLOSING,
  LOAN_STATUS.BILLING,
  LOAN_STATUS.FINALIZED,
];

const makeSortColumnData = ({ sortBy, sortOrder, groupBy }) => {
  let sortOrders = [sortOrder];
  let sorters = [
    item => {
      const value = get(item, sortBy);

      if (sortBy === SORT_BY.STATUS) {
        return loanBoardStatusOrder.indexOf(value);
      }
      if (sortBy === SORT_BY.DUE_AT) {
        return item.nextDueTask && new Date(item.nextDueTask.dueAt);
      }

      return value;
    },
    item => get(item, 'user.lastName'),
  ];

  if (groupBy === GROUP_BY.PROMOTION) {
    // Keep the promotionLoan at the top of the column
    sorters = [
      item => {
        if (item.financedPromotion && item.financedPromotion._id) {
          return 1;
        }

        return 0;
      },
      ...sorters,
    ];
    sortOrders = ['desc', ...sortOrders];
  }

  return data => _orderBy(data, sorters, sortOrders);
};

export const groupByFunc = groupBy => {
  if (groupBy === GROUP_BY.PROMOTION) {
    // When grouping by promotion, also group promotionLoan
    return loan =>
      get(loan, groupBy) ||
      (loan.financedPromotion && loan.financedPromotion._id);
  }

  return groupBy;
};

export const makeFormatData = ({ groupBy }) => data => {
  if (groupBy === GROUP_BY.PROMOTION) {
    return data.map(item => {
      if (item.financedPromotion && item.financedPromotion._id) {
        return {
          ...item,
          boardItemOptions: {
            titleTop: (
              <h4 className="board-column-subtitle">
                Financement de la promotion
              </h4>
            ),
            titleBottom: <h4 className="board-column-subtitle">Clients</h4>,
          },
        };
      }

      return item;
    });
  }

  return data;
};

export const makeFormatColumn = ({
  groupedLoans,
  sortBy,
  sortOrder,
  groupBy,
}) => {
  const formatData = makeFormatData({ groupBy });
  const sortColumnData = makeSortColumnData({ sortBy, sortOrder, groupBy });

  return group => {
    const data = groupedLoans[group];
    const sortedData = sortColumnData(data);
    const formattedData = formatData(sortedData);
    return { id: group, data: formattedData };
  };
};

export const groupLoans = ({ loans, options, ...props }) => {
  const { groupBy, sortBy, sortOrder } = options;
  const groupedLoans = _groupBy(loans, groupByFunc(groupBy));
  const groups = Object.keys(groupedLoans);

  const formattedColumns = [
    ...groups,
    ...getMissingColumns(groupBy, groups),
  ].map(makeFormatColumn({ groupedLoans, sortBy, sortOrder, groupBy }));

  return formattedColumns.sort(makeSortColumns(options, props));
};

export const getInitialOptions = ({ currentUser }) => ({
  groupBy: GROUP_BY.STATUS,
  assignedEmployeeId: currentUser && { $in: [currentUser._id] },
  sortBy: SORT_BY.DUE_AT,
  sortOrder: SORT_ORDER.ASC,
  step: undefined,
  category: undefined,
  status: undefined,
  promotionId: undefined,
  lenderId: undefined,
  loanId: '',
  promotionStatus: undefined,
  additionalFields: [],
  purchaseType: undefined,
});

export const filterReducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.SET_FILTER: {
      const { name, value } = payload;
      return { ...state, [name]: value };
    }

    case ACTIONS.SET_COLUMN_SORT: {
      const { sortOrder } = state;
      if (state.sortBy === payload) {
        return {
          ...state,
          sortOrder:
            sortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC,
        };
      }
      return {
        ...state,
        sortBy: payload,
        sortOrder: SORT_ORDER.ASC,
      };
    }

    case ACTIONS.SET_GROUP_BY: {
      const newStatus = { ...state, groupBy: payload };

      if (payload === GROUP_BY.STATUS) {
        return { ...newStatus, sortBy: SORT_BY.CREATED_AT };
      }
      return {
        ...newStatus,
        sortBy: SORT_BY.STATUS,
        sortOrder: SORT_ORDER.DESC,
      };
    }

    case ACTIONS.SET_LOAN_ID:
      return { ...state, loanId: payload };

    case ACTIONS.RESET: {
      if (payload) {
        return payload;
      }
      return getInitialOptions({ currentUser: Meteor.user() });
    }

    default:
      throw new Error('Unknown action type');
  }
};

// This filter can't easily be done on the server, so we add a filtering layer
// here on the client for convenience
export const makeClientSideFilter = ({ options }) => {
  const { promotionStatus } = options;
  const statuses = promotionStatus ? promotionStatus.$in : [];

  if (!statuses.length) {
    return () => true;
  }

  return loan =>
    (loan.promotions &&
      loan.promotions.length > 0 &&
      statuses.includes(loan.promotions[0].status)) ||
    (loan.financedPromotion &&
      statuses.includes(loan.financedPromotion.status));
};

export const additionalLoanBoardFields = [
  {
    id: 'createdAt',
    fragment: { createdAt: 1 },
    labelId: 'Forms.createdAt',
    format: ({ createdAt }) => moment(createdAt).format('D MMMM YYYY'),
  },
  {
    id: 'lender',
    fragment: {
      structures: { offerId: 1 },
      lenders: { organisation: { name: 1 }, offers: { _id: 1 } },
      structureId: 1,
    },
    label: 'Prêteur',
    format: loan => {
      const { lenders = [] } = loan;
      const { offerId } = Calculator.selectStructure({ loan });
      if (!offerId) {
        return null;
      }
      const lender = lenders.find(({ offers = [] }) =>
        offers.find(({ _id }) => _id === offerId),
      );

      if (!lender) {
        return null;
      }

      return lender.organisation.name;
    },
  },
  {
    id: 'referrer',
    label: 'Apporteur',
    fragment: {
      user: {
        referredByUser: { name: 1 },
        referredByOrganisation: { name: 1 },
      },
    },
    format: ({ user }) => {
      if (!user) {
        return null;
      }

      const { referredByUser, referredByOrganisation } = user;

      if (!referredByUser && !referredByOrganisation) {
        return null;
      }

      return (
        <div className="flex-col">
          {referredByUser && <span>{referredByUser.name}</span>}
          {referredByOrganisation && <span>{referredByOrganisation.name}</span>}
        </div>
      );
    },
  },
];
