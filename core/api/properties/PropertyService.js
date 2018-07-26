import Properties from '../properties';
import WuestService from '../wuest/server/WuestService';
import { EXPERTISE_STATUS } from './propertyConstants';

export class PropertyService {
  insert = ({ property, userId }) => Properties.insert({ ...property, userId });

  update = ({ propertyId, object }) =>
    Properties.update(propertyId, { $set: object });

  remove = ({ propertyId }) => Properties.remove(propertyId);

  pushValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $push: object });

  popValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $pop: object });

  evaluateProperty = propertyId =>
    WuestService.evaluateById(propertyId)
      .then(({ value, min, max }) => {
        this.update({
          propertyId,
          object: {
            valuation: {
              status: EXPERTISE_STATUS.DONE,
              min,
              max,
              value,
              date: new Date(),
              error: '',
            },
          },
        });
      })
      .catch((error) => {
        this.update({
          propertyId,
          object: {
            valuation: {
              status: EXPERTISE_STATUS.ERROR,
              min: null,
              max: null,
              value: null,
              date: new Date(),
              error: error.message,
            },
          },
        });
      });

  getPropertyById = propertyId => Properties.findOne(propertyId);
}

export default new PropertyService();
