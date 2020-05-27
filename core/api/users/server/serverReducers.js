import MailchimpService from '../../email/server/MailchimpService';
import { getEmailsForAddress } from '../../email/server/mandrill';
import { createMeteorAsyncFunction } from '../../helpers';
import assigneeReducer from '../../reducers/assigneeReducer';
import UserService from './UserService';
import Users from '..';

Users.addReducers({
  ...assigneeReducer(),
  sentEmails: {
    body: { emails: 1 },
    reduce: user =>
      // Simplify this to use email reducer once feature/pro is merged with grapher fixes
      createMeteorAsyncFunction(getEmailsForAddress)(user.emails[0].address),
  },
  mainOrganisation: {
    body: { _id: 1 },
    reduce: ({ _id }, { mainOrganisationFragment }) =>
      UserService.getUserMainOrganisation(_id, mainOrganisationFragment),
  },
  newsletterStatus: {
    body: { email: 1 },
    reduce: ({ email }) =>
      createMeteorAsyncFunction(
        MailchimpService.getMember.bind(MailchimpService),
      )({ email }),
  },
});
