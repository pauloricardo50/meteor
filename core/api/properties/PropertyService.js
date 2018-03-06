import Properties from '../properties';

export default class {
  static update = ({ propertyId, property }) =>
    Properties.update(propertyId, { $set: property });

  static insert = ({ property, userId }) =>
    Properties.insert({ ...property, userId });

  static remove = ({ propertyId }) => Properties.remove(propertyId);

  static pushValue = ({ propertyId, property }) =>
    Properties.update(propertyId, { $push: property });

  static popValue = ({ propertyId, property }) =>
    Properties.update(propertyId, { $pop: property });
}
