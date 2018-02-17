import { Meteor } from 'meteor/meteor';
import Properties from '../properties';

export default class {
  static update = ({ propertyId, object }) =>
    Properties.update(propertyId, { $set: object });

  static insert = ({ object, userId }) =>
    Properties.insert({
      ...object,
      // Do this to allow userId to be null
      userId: userId === undefined ? Meteor.userId() : userId,
    });

  static remove = ({ propertyId }) => Properties.remove(propertyId);

  static pushValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $push: object });

  static popValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $pop: object });

  static setCustomField = ({ propertyId, key, value }) =>
    this.update(propertyId, { $set: { [`customFields.${key}`]: value } });
}
