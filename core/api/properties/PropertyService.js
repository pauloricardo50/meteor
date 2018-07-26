import Properties from './properties';
import LoanService from '../loans/LoanService';

export default class {
  static insert = ({ property, userId, loanId }) => {
    const propertyId = Properties.insert({ ...property, userId });
    if (loanId) {
      LoanService.addPropertyToLoan({ loanId, propertyId });
    }

    return propertyId;
  };

  static update = ({ propertyId, object }) => Properties.update(propertyId, { $set: object });

  static remove = ({ propertyId }) => Properties.remove(propertyId);

  static pushValue = ({ propertyId, object }) => Properties.update(propertyId, { $push: object });

  static popValue = ({ propertyId, object }) => Properties.update(propertyId, { $pop: object });
}
