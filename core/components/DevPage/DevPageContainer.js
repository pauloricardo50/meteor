import { Meteor } from 'meteor/meteor';
import { withProps, compose } from 'recompose';

import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/constants';

const DevPageContainer = compose(withProps(({ currentUser: { _id: userId } }) => ({
  addEmptyLoan: options =>
    Meteor.call('addEmptyLoan', { userId, ...options }),
  addLoanWithSomeData: options =>
    Meteor.call('addLoanWithSomeData', { userId, ...options }),
  addCompleteLoan: options =>
    Meteor.call('addCompleteLoan', { userId, ...options }),
  addAnonymousLoan: options =>
    Meteor.call('addAnonymousLoan', { userId, ...options }, (err, loanId) => {
      if (loanId) {
        localStorage.setItem(LOCAL_STORAGE_ANONYMOUS_LOAN, loanId);
      }
    }),
  purgeAndGenerateDatabase: (currentUserId, currentUserEmail) => {
    Meteor.call('purgeDatabase', currentUserId, (err) => {
      if (err) {
        alert(err.reason);
      } else {
        Meteor.call('generateTestData', currentUserEmail);
      }
    });
  },
})));

export default DevPageContainer;
