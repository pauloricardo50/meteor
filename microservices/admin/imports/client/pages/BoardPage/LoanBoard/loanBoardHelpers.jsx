// import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import get from 'lodash/get';
import _groupBy from 'lodash/groupBy';
import _orderBy from 'lodash/orderBy';
import moment from 'moment';

import {
  LOAN_CATEGORIES,
  LOAN_STATUS,
  LOAN_STATUS_ORDER,
  PURCHASE_TYPE,
  STEP_ORDER,
} from 'core/api/loans/loanConstants';
import { PROMOTION_STATUS } from 'core/api/promotions/promotionConstants';
import { ROLES, USER_STATUS } from 'core/api/users/userConstants';
import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';

import {
  ACTIONS,
  GROUP_BY,
  SORT_BY,
  SORT_ORDER,
} from '../../../components/AdminBoard/AdminBoardConstants';
import {
  LOAN_BOARD_GROUP_BY,
  LOAN_BOARD_SORT_BY,
  NO_PROMOTION,
} from './loanBoardConstants';

const makeSortColumns = ({ groupBy }, { promotions, admins }) => {
  switch (groupBy) {
    case GROUP_BY.STATUS: {
      const statuses = LOAN_STATUS_ORDER;
      return ({ id: statusA }, { id: statusB }) =>
        statuses.indexOf(statusA) - statuses.indexOf(statusB);
    }
    case LOAN_BOARD_GROUP_BY.PROMOTION: {
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
      if (sortBy === LOAN_BOARD_SORT_BY.DUE_AT) {
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
  if (groupBy === LOAN_BOARD_GROUP_BY.PROMOTION) {
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

const makeFormatColumn = ({ groupedLoans, sortBy, sortOrder, groupBy }) => {
  const formatData = makeFormatData({ groupBy });
  const sortColumnData = makeSortColumnData({ sortBy, sortOrder, groupBy });

  return group => {
    const data = groupedLoans[group];
    const sortedData = sortColumnData(data);
    const formattedData = formatData(sortedData);
    return { id: group, data: formattedData };
  };
};

export const groupData = ({ loans, options, ...props }) => {
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
  sortBy: LOAN_BOARD_SORT_BY.DUE_AT,
  sortOrder: SORT_ORDER.ASC,
  step: undefined,
  category: undefined,
  status: undefined,
  promotionId: undefined,
  lenderId: undefined,
  docId: '',
  promotionStatus: undefined,
  additionalFields: [],
  purchaseType: undefined,
  userStatus: { $in: [USER_STATUS.QUALIFIED, USER_STATUS.LOST] },
});

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

export const makeOptionsSelect = ({
  options,
  dispatch,
  admins,
  promotions,
  lenders,
  makeOnChange,
}) => {
  const {
    assignedEmployeeId,
    step,
    groupBy,
    status,
    promotionId,
    lenderId,
    category,
    promotionStatus,
    additionalFields,
    purchaseType,
    userStatus,
  } = options;
  const assignedEmployeeValue = assignedEmployeeId
    ? assignedEmployeeId.$in
    : [null];
  const statusValue = status ? status.$in : [null];
  const promotionStatusValue = promotionStatus ? promotionStatus.$in : [null];
  const categoryValue = category ? category.$in : [null];
  const stepValue = step ? step.$in : [null];
  const promotionIdValue = promotionId ? promotionId.$in : [null];
  const lenderIdValue = lenderId ? lenderId.$in : [null];
  const purchaseTypeValue = purchaseType ? purchaseType.$in : [null];
  const userStatusValue = userStatus ? userStatus.$in : [null];

  const groupByOptions = [
    { id: GROUP_BY.STATUS, label: 'Par statut' },
    { id: LOAN_BOARD_GROUP_BY.PROMOTION, label: 'Par promo' },
    { id: GROUP_BY.ADMIN, label: 'Par conseiller' },
  ];
  const assignedEmployeeOptions = [
    { id: null, label: 'Tous' },
    { id: undefined, label: 'Personne' },
    ...admins.map(admin => ({
      id: admin._id,
      label: admin.firstName,
      hide: Roles.userIsInRole(admin, ROLES.DEV),
    })),
  ];
  const statusOptions = [
    { id: null, label: 'Tous' },
    ...LOAN_STATUS_ORDER.map(s => ({
      id: s,
      label: <T id={`Forms.status.${s}`} />,
    })),
  ];
  const categoryOptions = [
    { id: null, label: 'Toutes' },
    ...Object.keys(LOAN_CATEGORIES).map(c => ({
      id: c,
      label: <T id={`Forms.category.${c}`} />,
    })),
  ];
  const stepOptions = [
    { id: null, label: 'Tous' },
    ...STEP_ORDER.map(s => ({
      id: s,
      label: <T id={`Forms.step.${s}`} />,
    })),
  ];
  const promotionIdOptions = [
    { id: null, label: 'Tous' },
    { id: NO_PROMOTION, label: "N'a pas de promotion" },
    ...promotions.map(({ _id, name }) => ({ id: _id, label: name })),
  ];
  const lenderOptions = [
    { id: null, label: 'Tous' },
    ...lenders.map(({ _id, name }) => ({ id: _id, label: name })),
  ];
  const promotionStatusOptions = [
    { id: null, label: 'Tous' },
    ...Object.values(PROMOTION_STATUS).map(s => ({
      id: s,
      label: <T id={`Forms.status.${s}`} />,
    })),
  ];
  const additionalFieldOptions = additionalLoanBoardFields.map(
    ({ id, label, labelId }) => ({ id, label: label || <T id={labelId} /> }),
  );

  const purchaseTypeOptions = [
    { id: null, label: 'Tous' },
    ...Object.values(PURCHASE_TYPE).map(s => ({
      id: s,
      label: <T id={`Forms.purchaseType.${s}`} />,
    })),
  ];

  const userStatusOptions = [
    { id: null, label: 'Tous' },
    ...Object.values(USER_STATUS).map(s => ({
      id: s,
      label: <T id={`Forms.status.${s}`} />,
    })),
  ];

  return [
    {
      label: 'Conseiller',
      value: assignedEmployeeValue,
      options: assignedEmployeeOptions,
      onChange: next =>
        makeOnChange('assignedEmployeeId', dispatch)(
          assignedEmployeeValue,
          next,
        ),
    },
    {
      label: 'Statut du dossier',
      value: statusValue,
      options: statusOptions,
      onChange: next => makeOnChange('status', dispatch)(statusValue, next),
    },
    {
      label: 'Statut du compte',
      value: userStatusValue,
      options: userStatusOptions,
      onChange: next =>
        makeOnChange('userStatus', dispatch)(userStatusValue, next),
    },
    {
      label: 'Étape du dossier',
      value: stepValue,
      options: stepOptions,
      onChange: next => makeOnChange('step', dispatch)(stepValue, next),
    },
    {
      label: 'Catégorie',
      value: categoryValue,
      options: categoryOptions,
      onChange: next => makeOnChange('category', dispatch)(categoryValue, next),
    },
    {
      label: 'Type de prêt',
      value: purchaseTypeValue,
      options: purchaseTypeOptions,
      onChange: next =>
        makeOnChange('purchaseType', dispatch)(purchaseTypeValue, next),
    },
    {
      label: 'Prêteurs',
      value: lenderIdValue,
      options: lenderOptions,
      onChange: next => makeOnChange('lenderId', dispatch)(lenderIdValue, next),
    },
    {
      label: 'Promotions',
      value: promotionIdValue,
      options: promotionIdOptions,
      onChange: next =>
        makeOnChange('promotionId', dispatch)(promotionIdValue, next),
    },
    {
      label: 'Statut de la promotion',
      value: promotionStatusValue,
      options: promotionStatusOptions,
      onChange: next =>
        makeOnChange('promotionStatus', dispatch)(promotionStatusValue, next),
    },
    {
      label: 'Infos supplémentaires',
      value: additionalFields,
      options: additionalFieldOptions,
      onChange: next =>
        dispatch({
          type: ACTIONS.SET_FILTER,
          payload: { name: 'additionalFields', value: next },
        }),
    },
    {
      label: 'Affichage',
      value: groupBy,
      options: groupByOptions,
      onChange: newValue =>
        dispatch({ type: ACTIONS.SET_GROUP_BY, payload: newValue }),
      multiple: false,
    },
  ];
};

export const columnHeaderOptions = [
  { id: LOAN_BOARD_SORT_BY.DUE_AT, label: 'Prochain événement' },
  { id: SORT_BY.CREATED_AT, label: "Date d'ajout" },
  { id: SORT_BY.ASSIGNED_EMPLOYEE, label: 'Conseiller' },
  { id: SORT_BY.STATUS, label: 'Statut' },
];
