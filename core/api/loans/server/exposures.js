import { Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import { formatLoanWithDocuments } from '../../../utils/loanFunctions';
import UserService from '../../users/server/UserService';
import { createSearchFilters } from '../../helpers/mongoHelpers';
import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';

import {
  adminLoans,
  anonymousLoan,
  fullLoan,
  loanSearch,
  proLoans,
  proPromotionLoans,
  proPropertyLoans,
  proReferredByLoans,
  userLoans,
} from '../queries';
import { LOAN_STATUS } from '../loanConstants';
import {
  proLoansResolver,
  getLoanIds,
  proPromotionLoansResolver,
  proPropertyLoansResolver,
  proReferredByLoansResolver,
} from './resolvers';

exposeQuery({
  query: adminLoans,
  overrides: {
    embody: (body, params) => {
      body.$filter = ({
        filters,
        params: { _id, owned, name, _userId, assignedEmployeeId, relevantOnly },
      }) => {
        if (_id) {
          filters._id = _id;
        }

        if (name) {
          filters.name = name;
        }

        if (owned) {
          filters.userId = { $exists: true };
        }

        if (assignedEmployeeId) {
          filters['userCache.assignedEmployeeId'] = assignedEmployeeId;
        }

        if (relevantOnly) {
          filters.status = {
            $nin: [LOAN_STATUS.TEST, LOAN_STATUS.UNSUCCESSFUL],
          };
          filters.anonymous = { $ne: true };
        }
      };
    },
    validateParams: {
      name: Match.Maybe(String),
      owned: Match.Maybe(Boolean),
      assignedEmployeeId: Match.Maybe(String),
      relevantOnly: Match.Maybe(Boolean),
      _id: Match.Maybe(String),
    },
  },
});

exposeQuery({
  query: anonymousLoan,
  overrides: {
    firewall(userId, params) {
      SecurityService.loans.checkAnonymousLoan(params._id);
    },
    validateParams: { _id: String },
  },
  options: { allowFilterById: true },
});

exposeQuery({
  query: fullLoan,
  overrides: {
    embody: (body) => {
      body.$postFilter = (loans = []) => loans.map(formatLoanWithDocuments);
    },
  },
  options: { allowFilterById: true },
});

exposeQuery({
  query: loanSearch,
  overrides: {
    firewall(userId) {
      SecurityService.checkUserIsAdmin(userId);
    },
    embody: (body) => {
      body.$filter = ({ filters, params: { searchQuery } }) => {
        Object.assign(
          filters,
          createSearchFilters(['name', '_id', 'customName'], searchQuery),
        );
      };
    },
    validateParams: { searchQuery: Match.Maybe(String) },
  },
});

exposeQuery({
  query: proLoans,
  overrides: {
    firewall(userId, params) {
      const {
        userId: providedUserId,
        fetchOrganisationLoans,
        organisationId,
      } = params;
      params.calledByUserId = userId;

      if (SecurityService.isUserAdmin(userId) && providedUserId) {
        params.userId = providedUserId;
      } else {
        params.userId = userId;
      }

      if (fetchOrganisationLoans) {
        if (organisationId) {
          SecurityService.checkUserIsAdmin(userId);
        } else {
          const { organisations } = UserService.fetchOne({
            $filters: { _id: userId },
            organisations: { _id: 1 },
          });

          if (!organisations || organisations.length === 0) {
            throw new Meteor.Error("Pas d'organisation!");
          }

          params.organisationId = organisations[0]._id;
        }
      }

      SecurityService.checkUserIsPro(userId);
    },
    validateParams: {
      promotionId: Match.Maybe(Match.OneOf(String, Object)),
      propertyId: Match.Maybe(Match.OneOf(String, Object)),
      userId: String,
      calledByUserId: String,
      organisationId: Match.Maybe(String),
      fetchOrganisationLoans: Match.Maybe(Boolean),
    },
  },
  cacher: {
    getDataToHash: getLoanIds({ withReferredBy: true }),
    ttl: 60 * 1000,
  },
  resolver: proLoansResolver,
});

exposeQuery({
  query: proPromotionLoans,
  overrides: {
    firewall(userId, params) {
      const { promotionId } = params;
      params.userId = userId;
      SecurityService.checkUserIsPro(userId);
      SecurityService.promotions.isAllowedToView({ userId, promotionId });
    },
    validateParams: {
      promotionId: String,
      userId: String,
    },
  },
  resolver: ({ userId, promotionId }) =>
    proPromotionLoansResolver({ calledByUserId: userId, promotionId }),
});

exposeQuery({
  query: proPropertyLoans,
  overrides: {
    firewall(userId, params) {
      const { propertyId } = params;
      params.userId = userId;
      SecurityService.checkUserIsPro(userId);
      SecurityService.properties.isAllowedToView({ propertyId, userId });
    },
    validateParams: {
      propertyId: String,
      userId: String,
    },
  },
  resolver: ({ userId, propertyId }) =>
    proPropertyLoansResolver({ calledByUserId: userId, propertyId }),
});

exposeQuery({
  query: proReferredByLoans,
  overrides: {
    firewall(userId, params) {
      const { userId: providedUserId } = params;
      SecurityService.checkUserIsPro(userId);
      if (SecurityService.isUserAdmin(userId)) {
        params.userId = providedUserId;
      } else {
        params.userId = userId;
      }
      params.calledByUserId = userId;
    },
    validateParams: {
      userId: String,
      calledByUserId: String,
    },
  },
  resolver: proReferredByLoansResolver,
});

exposeQuery({
  query: userLoans,
  overrides: {
    firewall(userId, params) {
      try {
        if (params.userId) {
          SecurityService.checkUserIsAdmin(userId);
        } else {
          params.userId = userId;
  
          if (!userId) {
            SecurityService.loans.checkAnonymousLoan(params.loanId);
          }
        }
      } catch (error) {
        console.log('firewall bug!', error);
        
        throw error;
      }

    },
    embody: (body) => {
      body.$filter = ({ filters, params }) => {
        filters.userId = params.userId;
        if (params.loanId) {
          filters._id = params.loanId;
        }
      };
    },
    validateParams: {
      loanId: Match.Maybe(String),
      userId: Match.Maybe(String),
    },
  },
});
