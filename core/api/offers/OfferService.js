import { Meteor } from 'meteor/meteor';
import Offers from '../offers';

export default class {
  static update = ({ offerId, object }) =>
    Offers.update(offerId, { $set: object });

  static insert = ({ object, userId }) =>
    Offers.insert({
      ...object,
      // Do this to allow userId to be null
      userId: userId || Meteor.userId(),
    });

  static remove = ({ offerId }) => Offers.remove(offerId);
}
