import { ACTIONS, SORT_BY, SORT_ORDER, GROUP_BY } from './adminLayoutConstants';

export const getInitialOptions = ({ currentUser }) => ({
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
