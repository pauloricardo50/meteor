import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import saveStartForm from 'core/utils/saveStartForm';
import { addUserTracking } from 'core/utils/analytics';

Meteor.methods({
  createUserAndRequest({ email, formState }) {
    console.log('creating user and request...', email, formState);
    // Create the new user without a password
    let newUserId;
    try {
      newUserId = Accounts.createUser({ email });
    } catch (e) {
      throw new Meteor.Error(e);
    }

    // Send an enrollment email
    Accounts.sendEnrollmentEmail(newUserId);

    // Insert the formdata to loanRequest and borrower(s)
    return saveStartForm(formState, newUserId);
  },
});
