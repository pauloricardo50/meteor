import React from 'react';
import get from 'lodash/get';
import _groupBy from 'lodash/groupBy';
import _orderBy from 'lodash/orderBy';

import {
  INSURANCE_REQUEST_STATUS,
  INSURANCE_REQUEST_STATUS_ORDER,
} from 'core/api/insuranceRequests/insuranceRequestConstants';
import { ROLES, USER_STATUS } from 'core/api/users/userConstants';
import T from 'core/components/Translation';

import {
  ACTIONS,
  GROUP_BY,
  SORT_BY,
  SORT_ORDER,
} from '../../../components/AdminBoard/AdminBoardConstants';

const insuranceRequestBoardStatusOrder = [
  INSURANCE_REQUEST_STATUS.UNSUCCESSFUL,
  INSURANCE_REQUEST_STATUS.PENDING,
  INSURANCE_REQUEST_STATUS.LEAD,
  INSURANCE_REQUEST_STATUS.QUALIFIED_LEAD,
  INSURANCE_REQUEST_STATUS.ONGOING,
  INSURANCE_REQUEST_STATUS.CLOSING,
  INSURANCE_REQUEST_STATUS.BILLING,
  INSURANCE_REQUEST_STATUS.FINALIZED,
];

export const getInitialOptions = ({ currentUser }) => ({
  groupBy: GROUP_BY.STATUS,
  assignedEmployeeId: currentUser && { $in: [currentUser._id] },
  sortBy: SORT_BY.DUE_AT,
  sortOrder: SORT_ORDER.ASC,
  status: undefined,
  insuranceRequestId: '',
  additionalFields: [],
  userStatus: { $in: [USER_STATUS.QUALIFIED, USER_STATUS.LOST] },
});

const getMissingColumns = (groupBy, groups) => {
  switch (groupBy) {
    case GROUP_BY.STATUS: {
      return INSURANCE_REQUEST_STATUS_ORDER.filter(
        status =>
          status !== INSURANCE_REQUEST_STATUS.UNSUCCESSFUL &&
          status !== INSURANCE_REQUEST_STATUS.TEST &&
          status !== INSURANCE_REQUEST_STATUS.FINALIZED &&
          !groups.includes(status),
      );
    }

    default:
      return [];
  }
};

const makeSortColumnData = ({ sortBy, sortOrder }) => {
  const sortOrders = [sortOrder];
  const sorters = [
    item => {
      const value = get(item, sortBy);

      if (sortBy === SORT_BY.STATUS) {
        return insuranceRequestBoardStatusOrder.indexOf(value);
      }

      return value;
    },
    item => get(item, 'user.lastName'),
  ];

  return data => _orderBy(data, sorters, sortOrders);
};

const makeFormatColumn = ({
  groupedInsuranceRequests,
  sortBy,
  sortOrder,
  groupBy,
}) => {
  const formatData = data => data;
  const sortColumnData = makeSortColumnData({ sortBy, sortOrder, groupBy });

  return group => {
    const data = groupedInsuranceRequests[group];
    const sortedData = sortColumnData(data);
    const formattedData = formatData(sortedData);
    return { id: group, data: formattedData };
  };
};

const makeSortColumns = ({ groupBy }, { admins }) => {
  switch (groupBy) {
    case GROUP_BY.STATUS: {
      const statuses = INSURANCE_REQUEST_STATUS_ORDER;
      return ({ id: statusA }, { id: statusB }) =>
        statuses.indexOf(statusA) - statuses.indexOf(statusB);
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

export const groupData = ({ insuranceRequests, options, ...props }) => {
  const { groupBy, sortBy, sortOrder } = options;
  const groupedInsuranceRequests = _groupBy(insuranceRequests, groupBy);
  const groups = Object.keys(groupedInsuranceRequests);

  const formattedColumns = [
    ...groups,
    ...getMissingColumns(groupBy, groups),
  ].map(
    makeFormatColumn({ groupedInsuranceRequests, sortBy, sortOrder, groupBy }),
  );

  return formattedColumns.sort(makeSortColumns(options, props));
};

export const makeOptionsSelect = ({
  options,
  dispatch,
  admins,
  organisations,
  makeOnChange,
}) => {
  const {
    assignedEmployeeId,
    groupBy,
    status,
    organisationId,
    userStatus,
  } = options;
  const assignedEmployeeValue = assignedEmployeeId
    ? assignedEmployeeId.$in
    : [null];
  const statusValue = status ? status.$in : [null];
  const organisationIdValue = organisationId ? organisationId.$in : [null];
  const userStatusValue = userStatus ? userStatus.$in : [null];

  const groupByOptions = [
    { id: GROUP_BY.STATUS, label: 'Par statut' },
    { id: GROUP_BY.ADMIN, label: 'Par conseiller' },
  ];
  const assignedEmployeeOptions = [
    { id: null, label: 'Tous' },
    { id: undefined, label: 'Personne' },
    ...admins.map(admin => ({
      id: admin._id,
      label: admin.firstName,
      hide: admin.roles.includes(ROLES.DEV),
    })),
  ];
  const statusOptions = [
    { id: null, label: 'Tous' },
    ...INSURANCE_REQUEST_STATUS_ORDER.map(s => ({
      id: s,
      label: <T id={`Forms.status.${s}`} />,
    })),
  ];

  const organisationOptions = [
    { id: null, label: 'Tous' },
    ...organisations.map(({ _id, name }) => ({ id: _id, label: name })),
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
      label: 'Assureurs',
      value: organisationIdValue,
      options: organisationOptions,
      onChange: next =>
        makeOnChange('organisationId', dispatch)(organisationIdValue, next),
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
  { id: SORT_BY.CREATED_AT, label: "Date d'ajout" },
  { id: SORT_BY.ASSIGNED_EMPLOYEE, label: 'Conseiller' },
  { id: SORT_BY.STATUS, label: 'Statut' },
];
