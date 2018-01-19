import { Meteor } from 'meteor/meteor';

export function currentUserComposer(props, onData) {
  console.log('currentUserComposer');
  if (Meteor.subscribe('currentUser').ready()) {
    // Get the first element of this array which has only one element
    const currentUser = Meteor.users.find().fetch()[0];
    console.log('onData currentUserComposer()');
    onData(null, { currentUser });
  }
}
