import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import saveStartForm from 'core/utils/saveStartForm';
import { addUserTracking } from 'core/utils/analytics';

Meteor.methods({
  createUserAndRequest({ email, formState }) {
    // Create the new user without a password
    const newUserId = Accounts.createUser({ email }, (error) => {
      if (error) {
        throw new Meteor.Error('createUserAndRequest: account creation error');
      }
    });

    // Send an enrollment email
    Accounts.sendEnrollmentEmail(newUserId);

    // Add tracking to analytics
    addUserTracking(Meteor.userId(), { email, id: newUserId });

    // Insert the formdata to loanRequest and borrower(s)
    return saveStartForm(formState, newUserId);
  },
});
