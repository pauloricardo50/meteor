import LoanService from '../../loans/server/LoanService';
import WuestService from '../../wuest/server/WuestService';
import CollectionService from '../../helpers/CollectionService';
import { VALUATION_STATUS } from '../propertyConstants';
import Properties from '../properties';

export class PropertyService extends CollectionService {
  constructor() {
    super(Properties);
  }

  insert = ({ property, userId, loanId }) => {
    const propertyId = Properties.insert({ ...property, userId });
    if (loanId) {
      LoanService.addPropertyToLoan({ loanId, propertyId });
    }

    return propertyId;
  };

  update = ({ propertyId, object }) =>
    Properties.update(propertyId, { $set: object });

  remove = ({ propertyId, loanId }) => {
    const property = this.fetchOne({
      $filters: { _id: propertyId },
      loans: { _id: 1 },
      category: 1,
    });

    if (property && property.loans.length > 1) {
      if (loanId) {
        const loansLink = this.getLink(propertyId, 'loans');
        loansLink.remove(loanId);
      } else {
        // Can't delete a property that has multiple loans without specifying
        // from where you want to remove it
        return false;
      }
    } else {
      Properties.remove(propertyId);
    }
  };

  pushValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $push: object });

  popValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $pop: object });

  pullValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $pull: object });

  evaluateProperty = ({ propertyId, loanResidenceType }) =>
    WuestService.evaluateById({ propertyId, loanResidenceType })
      .then((valuation) => {
        this.update({
          propertyId,
          object: {
            valuation: {
              status: VALUATION_STATUS.DONE,
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
              status: VALUATION_STATUS.ERROR,
              min: null,
              max: null,
              value: null,
              date: new Date(),
              error: error.reason || error.message,
            },
          },
        });
      });

  propertyDataIsInvalid = ({ propertyId, loanResidenceType }) => {
    try {
      WuestService.createPropertyFromCollection({
        propertyId,
        loanResidenceType,
      });
    } catch (error) {
      return error.reason;
    }
    return false;
  };
}

export default new PropertyService();
