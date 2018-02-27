import Properties from '../properties';

export default class {
  static update = ({ propertyId, object }) =>
    Properties.update(propertyId, { $set: object });

  static insert = ({ object, userId }) =>
    Properties.insert({ ...object, userId });

  static remove = ({ propertyId }) => Properties.remove(propertyId);

  static pushValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $push: object });

  static popValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $pop: object });
}
