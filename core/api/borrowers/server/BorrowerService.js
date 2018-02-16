import { Meteor } from 'meteor/meteor';
import Borrowers from '../borrowers';

export default class {
  static update = ({ id, object }) => Borrowers.update(id, { $set: object });

  static insert = ({ object, userId }) =>
    Borrowers.insert({
      ...object,
      // Do this to allow userId to be null
      userId: userId === undefined ? Meteor.userId() : userId,
    });

  static remove = ({ id }) => Borrowers.remove(id);

  static pushValue = ({ id, object }) =>
    Borrowers.update(id, { $push: object });

  static popValue = ({ id, object }) => Borrowers.update(id, { $pop: object });
}
