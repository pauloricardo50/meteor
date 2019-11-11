import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { adminNotifications } from '../queries';

exposeQuery({
  query: adminNotifications,
  overrides: {
    embody: body => {
      body.$filter = ({
        filters,
        params: { _userId, userId, read, unread },
      }) => {
        if (!read && !unread) {
          throw new Meteor.Error('You have to provide either read or unread');
        }

        if (unread) {
          filters.recipientLinks = {
            $elemMatch: {
              _id: _userId || userId,
              read: false,
              $or: [
                { snoozeDate: { $exists: false } },
                { snoozeDate: { $lte: new Date() } },
              ],
            },
          };
        }

        if (read) {
          filters.recipientLinks = {
            $elemMatch: { _id: userId || _userId, read: true },
          };
        }
      };
    },
    validateParams: {
      userId: Match.Maybe(String),
      read: Match.Maybe(Boolean),
      unread: Match.Maybe(Boolean),
    },
  },
});
