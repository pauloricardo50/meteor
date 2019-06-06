import { Match } from 'meteor/check';

import SecurityService from 'core/api/security';
import { Meteor } from 'meteor/meteor';
import UserService from '../../users/server/UserService';
import { exposeQuery } from '../../queries/queryHelpers';
import QueryCacher from '../../helpers/server/QueryCacher';

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

exposeQuery(
  adminLoans,
  {
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
    },
  },
  { allowFilterById: true },
);

exposeQuery(
  anonymousLoan,
  {
    firewall(userId, params) {
      SecurityService.loans.checkAnonymousLoan(params._id);
    },
    validateParams: { _id: String, $body: Match.Maybe(Object) },
  },
  { allowFilterById: true },
);

exposeQuery(fullLoan, {}, { allowFilterById: true });

exposeQuery(
  loanSearch,
  {
    firewall(userId) {
      SecurityService.checkUserIsAdmin(userId);
    },
    validateParams: { searchQuery: Match.Maybe(String) },
  },
  {},
);

exposeQuery(proLoans, {
  firewall(userId, params) {
    const { userId: providedUserId, fetchOrganisationLoans } = params;
    params.calledByUserId = userId;

    if (SecurityService.isUserAdmin(userId) && providedUserId) {
      params.userId = providedUserId;
    } else {
      params.userId = userId;
    }

    if (fetchOrganisationLoans) {
      if (params.organisationId) {
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
});

proLoans.resolve(proLoansResolver);
const proLoansCacher = new QueryCacher({
  getDataToHash: getLoanIds({ withReferredBy: true }),
  ttl: 60 * 1000,
});

proLoans.cacheResults(proLoansCacher);

exposeQuery(
  proPromotionLoans,
  {
    firewall(userId, params) {
      const { promotionId } = params;
      params.userId = userId;
      SecurityService.checkUserIsPro(userId);
      SecurityService.promotions.isAllowedToView({
        userId,
        promotionId,
      });
    },
    validateParams: {
      promotionId: String,
      userId: String,
    },
  },
  {},
);

proPromotionLoans.resolve(({ userId, promotionId }) =>
  proPromotionLoansResolver({ calledByUserId: userId, promotionId }));

exposeQuery(
  proPropertyLoans,
  {
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
  {},
);

proPropertyLoans.resolve(({ userId, propertyId }) =>
  proPropertyLoansResolver({ calledByUserId: userId, propertyId }));

exposeQuery(
  proReferredByLoans,
  {
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
  {},
);

proReferredByLoans.resolve(proReferredByLoansResolver);

exposeQuery(
  userLoans,
  {
    firewall(userId, params) {
      if (params.userId) {
        SecurityService.checkUserIsAdmin(userId);
      } else {
        params.userId = userId;

        if (!userId) {
          SecurityService.loans.checkAnonymousLoan(params.loanId);
        }
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
  {},
);
