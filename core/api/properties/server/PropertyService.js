import { Meteor } from 'meteor/meteor';
import Properties from '../properties';

export default class {
  static update = ({ id, object }) => Properties.update(id, { $set: object });

  static insert = ({ object, userId }) =>
    Properties.insert({
      ...object,
      // Do this to allow userId to be null
      userId: userId === undefined ? Meteor.userId() : userId,
    });

  static remove = ({ id }) => Properties.remove(id);

  static pushValue = ({ id, object }) =>
    Properties.update(id, { $push: object });

  static popValue = ({ id, object }) => Properties.update(id, { $pop: object });

  static setCustomField = ({ id, key, value }) =>
    this.update(id, { $set: { [`customFields.${key}`]: value } });
}
