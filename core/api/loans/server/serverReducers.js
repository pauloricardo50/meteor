import { Meteor } from 'meteor/meteor';

import merge from 'lodash/merge';
import omit from 'lodash/omit';

import OrganisationService from '../../organisations/server/OrganisationService';
import UserService from '../../users/server/UserService';
import assigneeReducer from '../../reducers/assigneeReducer';
import { userLoan } from '../../fragments';
import { isMeteorMethod } from '../../methods/methodHelpers';
import Loans from '../loans';
import { getLoanProgress } from '../helpers';

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
    reduce: getLoanProgress,
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
        user = UserService.get(referralId, {
          name: 1,
          organisations: { name: 1 },
        });
        if (!user) {
          org = OrganisationService.get(referralId, { name: 1, userLinks: 1 });
        }
      } else {
        if (userCache.referredByUserLink) {
          user = UserService.get(userCache.referredByUserLink, {
            name: 1,
            organisations: { name: 1 },
          });
        }

        if (userCache.referredByOrganisationLink) {
          org = OrganisationService.get(userCache.referredByOrganisationLink, {
            name: 1,
            userLinks: 1,
          });
        }
      }

      if (!user && !org) {
        return 'Déjà référé';
      }

      if (
        (user && user._id === currentUserId) ||
        (org && org.userLinks.find(({ _id }) => _id === currentUserId))
      ) {
        const organisationName = org && org.name;
        const userName = user && user.name;
        return [
          userName &&
            `${userName}${organisationName ? ` (${organisationName})` : ''}`,
          organisationName,
        ].filter(x => x)[0];
      }
      return 'Déjà référé';
    },
  },
});
