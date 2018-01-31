import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import saveStartForm from 'core/utils/saveStartForm';
import { addUserTracking } from 'core/utils/analytics';

Meteor.methods({
  createUserAndLoan({ email, formState }) {
    console.log('creating user and loan...', email, formState);
    // Create the new user without a password
    let newUserId;
    try {
      newUserId = Accounts.createUser({ email });
    } catch (e) {
      throw new Meteor.Error("Couldn't create new user", e);
    }

    // Send an enrollment email
    Accounts.sendEnrollmentEmail(newUserId);

    // Insert the formdata to loan and borrower(s)
    return saveStartForm(formState, newUserId);
  },
});
