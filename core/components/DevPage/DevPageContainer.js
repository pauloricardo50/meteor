import { Meteor } from 'meteor/meteor';
import { withProps, compose } from 'recompose';

import { migrateToLatest } from '../../api';

const DevPageContainer = compose(withProps(({ currentUser: { _id: userId } }) => ({
  addEmptyLoan: options =>
    Meteor.call('addEmptyLoan', { userId, ...options }),
  addLoanWithSomeData: options =>
    Meteor.call('addLoanWithSomeData', { userId, ...options }),
  addCompleteLoan: options => Meteor.call('addCompleteLoan', { userId, ...options }),
  purgeAndGenerateDatabase: (currentUserId, currentUserEmail) => {
    Meteor.call('purgeDatabase', currentUserId, (err) => {
      if (err) {
        alert(err.reason);
      } else {
        Meteor.call('generateTestData', currentUserEmail);
      }
    });
  },
  migrateToLatest: () => migrateToLatest.run(),
})));

export default DevPageContainer;
