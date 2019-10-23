// @flow
import { compose, shouldUpdate, withState, withReducer } from 'recompose';
import { currentUser } from 'core/api/users/queries';
import { withSmartQuery } from 'core/api/containerToolkit';
import { withFileViewer } from 'core/containers/FileViewerContext';
import { injectCurrentUser } from 'core/containers/CurrentUserContext';
import { withRouter } from 'react-router-dom';

const ACTIONS = {
  SET_FILTER: 'SET_FILTER',
  SET_COLUMN_SORT: 'SET_COLUMN_SORT',
  SET_GROUP_BY: 'SET_GROUP_BY',
  RESET: 'RESET',
  SET_LOAN_ID: 'SET_LOAN_ID',
};

const SORT_BY = {
  DUE_AT: 'item.nextDueTask.dueAt',
  CREATED_AT: 'createdAt',
  ASSIGNED_EMPLOYEE: 'user.assignedEmployeeCache.firstName',
  STATUS: 'status',
};

const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

const GROUP_BY = {
  STATUS: 'status',
  PROMOTION: 'promotions[0]._id',
  ADMIN: 'user.assignedEmployeeCache._id',
};

const getInitialOptions = ({ currentUser }) => ({
  groupBy: GROUP_BY.STATUS,
  assignedEmployeeId: { $in: [currentUser._id] },
  sortBy: SORT_BY.DUE_AT,
  sortOrder: SORT_ORDER.ASC,
  step: undefined,
  category: undefined,
  status: undefined,
  promotionId: undefined,
  lenderId: undefined,
  loanId: '',
});

const filterReducer = (state, { type, payload }) => {
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
    return { ...state, sortBy: payload, sortOrder: SORT_ORDER.ASC };
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

export default compose(
  withFileViewer,
  shouldUpdate(() => false),
  withSmartQuery({
    query: currentUser,
    params: () => ({
      $body: {
        email: 1,
        emails: 1,
        name: 1,
        organisations: { name: 1 },
        roles: 1,
      },
    }),
    queryOptions: { reactive: true, single: true },
    dataName: 'currentUser',
    renderMissingDoc: false,
  }),
  injectCurrentUser,
  withState('openSearch', 'setOpenSearch', false),
  withState('activateSync', 'setActivateSync', false),
  withReducer('loanBoardOptions', 'loanBoardDispatch', filterReducer, getInitialOptions),
  withRouter, // history is not properly reactive if we don't add this HOC here, but depend on the props being passed from above
);
