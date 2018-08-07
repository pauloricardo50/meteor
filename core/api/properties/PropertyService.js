import LoanService from '../loans/LoanService';
import Properties from '.';
import WuestService from '../wuest/server/WuestService';
import { EXPERTISE_STATUS } from './propertyConstants';

export class PropertyService {
  insert = ({ property, userId, loanId }) => {
    const propertyId = Properties.insert({ ...property, userId });
    if (loanId) {
      LoanService.addPropertyToLoan({ loanId, propertyId });
    }

    return propertyId;
  };

  update = ({ propertyId, object }) =>
    Properties.update(propertyId, { $set: object });

  remove = ({ propertyId }) => Properties.remove(propertyId);

  pushValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $push: object });

  popValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $pop: object });

  getPropertyById = propertyId => Properties.findOne(propertyId);

  evaluateProperty = propertyId =>
    WuestService.evaluateById(propertyId)
      .then((valuation) => {
        this.update({
          propertyId,
          object: {
            valuation: {
              status: EXPERTISE_STATUS.DONE,
              date: new Date(),
              error: '',
              ...valuation,
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

  propertyDataIsInvalid = (propertyId) => {
    try {
      WuestService.createPropertyFromCollection(propertyId);
    } catch (error) {
      return error.message;
    }
    return false;
  };
}

export default new PropertyService();
