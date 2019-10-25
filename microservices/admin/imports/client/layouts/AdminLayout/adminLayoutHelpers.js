import { LOAN_BOARD_ACTIONS,  LOAN_BOARD_SORT_BY,  LOAN_BOARD_SORT_ORDER,  LOAN_BOARD_GROUP_BY } from './adminLayoutConstants';

export const getInitialOptions = ({ currentUser }) => ({
    groupBy:  LOAN_BOARD_GROUP_BY.STATUS,
    assignedEmployeeId: { $in: [currentUser._id] },
    sortBy:  LOAN_BOARD_SORT_BY.DUE_AT,
    sortOrder:  LOAN_BOARD_SORT_ORDER.ASC,
    step: undefined,
    category: undefined,
    status: undefined,
    promotionId: undefined,
    lenderId: undefined,
    loanId: '',
});

export const filterReducer = (state, { type, payload }) => {
    switch (type) {
        case LOAN_BOARD_ACTIONS.SET_FILTER: {
            const { name, value } = payload;
            return { ...state, [name]: value };
        }

        case LOAN_BOARD_ACTIONS.SET_COLUMN_SORT: {
            const { sortOrder } = state;
            if (state.sortBy === payload) {
                return {
                    ...state,
                    sortOrder:
                        sortOrder ===  LOAN_BOARD_SORT_ORDER.ASC ?  LOAN_BOARD_SORT_ORDER.DESC :  LOAN_BOARD_SORT_ORDER.ASC,
                };
            }
            return { ...state, sortBy: payload, sortOrder:  LOAN_BOARD_SORT_ORDER.ASC };
        }

        case LOAN_BOARD_ACTIONS.SET_GROUP_BY: {
            const newStatus = { ...state, groupBy: payload };

            if (payload ===  LOAN_BOARD_GROUP_BY.STATUS) {
                return { ...newStatus, sortBy:  LOAN_BOARD_SORT_BY.CREATED_AT };
            }
            return {
                ...newStatus,
                sortBy:  LOAN_BOARD_SORT_BY.STATUS,
                sortOrder:  LOAN_BOARD_SORT_ORDER.DESC,
            };
        }

        case LOAN_BOARD_ACTIONS.SET_LOAN_ID:
            return { ...state, loanId: payload };

        case LOAN_BOARD_ACTIONS.RESET: {
            if (payload) {
                return payload;
            }
            return getInitialOptions({ currentUser: Meteor.user() });
        }

        default:
            throw new Error('Unknown action type');
    }
};
