import Users from '..';
import { getEmailsForAddress } from '../../email/server/mandrill';
import { createMeteorAsyncFunction } from '../../helpers';

Users.addReducers({
  sentEmails: {
    body: { emails: 1 },
    reduce: user =>
      // Simplify this to use email reducer once feature/pro is merged with grapher fixes
      createMeteorAsyncFunction(getEmailsForAddress)(user.emails[0].address),
  },
});
