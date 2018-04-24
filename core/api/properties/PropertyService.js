import Properties from '../properties';

export default class {
  static insert = ({ property, userId }) =>
    Properties.insert({ ...property, userId });

  static update = ({ propertyId, object }) =>
    Properties.update(propertyId, { $set: object });

  static remove = ({ propertyId }) => Properties.remove(propertyId);

  static pushValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $push: object });

  static popValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $pop: object });
}
