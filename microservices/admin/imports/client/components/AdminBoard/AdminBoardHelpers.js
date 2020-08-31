import { Meteor } from 'meteor/meteor';

import { ACTIONS, GROUP_BY, SORT_BY, SORT_ORDER } from './AdminBoardConstants';

export const makeFilterReducer = ({ getInitialOptions }) => (
  state,
  { type, payload },
) => {
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

    case ACTIONS.SET_DOC_ID:
      return { ...state, docId: payload };

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
