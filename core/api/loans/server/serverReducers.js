import { Meteor } from 'meteor/meteor';

import merge from 'lodash/merge';
import omit from 'lodash/omit';

import OrganisationService from '../../organisations/server/OrganisationService';
import UserService from '../../users/server/UserService';
import Calculator from '../../../utils/Calculator';
import assigneeReducer from '../../reducers/assigneeReducer';
import { userLoan } from '../../fragments';
import { isMeteorMethod } from '../../methods/server/methodHelpers';
import Loans from '../loans';

const body = merge(
  {},
  omit(userLoan(), [
    'maxPropertyValue',
    'offers',
    'promotions',
    'user',
    'promotionOptions',
    'borrowers.mortgageNotes',
    'borrowers.loans',
  ]),
  {
    documents: 1,
    borrowers: {
      documents: 1,
    },
    properties: {
      documents: 1,
    },
  },
);

Loans.addReducers({
  ...assigneeReducer(),
  loanProgress: {
    body,
    reduce: loan => ({
      info: Calculator.getValidFieldsRatio({ loan }),
      documents: Calculator.getValidDocumentsRatio({ loan }),
    }),
  },
  referredByText: {
    body: {
      anonymous: 1,
      referralId: 1,
      userCache: 1,
    },
    reduce({ anonymous, referralId, userCache = {} }) {
      let user;
      let org;

      const currentUserId = isMeteorMethod() ? Meteor.userId() : null;

      if (anonymous && !referralId) {
        return 'Anonyme';
      }

      if (referralId) {
        user = UserService.fetchOne({
          $filters: { _id: referralId },
          name: 1,
          organisations: { name: 1 },
        });
        if (!user) {
          org = OrganisationService.fetchOne({
            $filters: { _id: referralId },
            name: 1,
            userLinks: 1,
          });
        }
      } else {
        if (userCache.referredByUserLink) {
          user = UserService.fetchOne({
            $filters: { _id: userCache.referredByUserLink },
            name: 1,
            organisations: { name: 1 },
          });
        }

        if (userCache.referredByOrganisationLink) {
          org = OrganisationService.fetchOne({
            $filters: { _id: userCache.referredByOrganisationLink },
            name: 1,
            userLinks: 1,
          });
        }
      }

      if (!user && !org) {
        return 'Déjà référé';
      }

      if (
        (user && user._id === currentUserId)
        || (org && org.userLinks.find(({ _id }) => _id === currentUserId))
      ) {
        const organisationName = org && org.name;
        const userName = user && user.name;
        return [
          userName
            && `${userName}${organisationName ? ` (${organisationName})` : ''}`,
          organisationName,
        ].filter(x => x)[0];
      }
      return 'Déjà référé';
    },
  },
});
