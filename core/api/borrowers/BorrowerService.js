import { Meteor } from 'meteor/meteor';
import Borrowers from '../borrowers';

export default class {
  static update = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $set: object });

  static insert = ({ object, userId }) =>
    Borrowers.insert({
      ...object,
      // Do this to allow userId to be null
      userId: userId === undefined ? Meteor.userId() : userId,
    });

  static remove = ({ borrowerId }) => Borrowers.remove(borrowerId);

  static pushValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $push: object });
}
