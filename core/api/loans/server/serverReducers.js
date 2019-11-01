import merge from 'lodash/merge';
import omit from 'lodash/omit';

import UserService from 'core/api/users/server/UserService';
import { OrganisationService } from 'core/api/organisations/server/OrganisationService';
import Calculator from '../../../utils/Calculator';
import Loans from '../loans';
import assigneeReducer from '../../reducers/assigneeReducer';
import { userLoan } from '../../fragments';

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
      referredByUser: { name: 1, organisations: { name: 1 } },
      referredByOrganisation: { name: 1 },
    },
    reduce({ anonymous, referralId, referredByUser, referredByOrganisation }) {
      let user = referredByUser;
      let org = referredByOrganisation;

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
          });
        }
      }

      // TODO
    },
  },
});
