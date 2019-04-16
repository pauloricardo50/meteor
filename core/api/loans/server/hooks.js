import Loans from '../loans';
import BorrowerService from '../../borrowers/server/BorrowerService';
import PropertyService from '../../properties/server/PropertyService';
import UpdateWatcherService from '../../updateWatchers/server/UpdateWatcherService';
import SecurityService from '../../security';
import { ROLES, PROPERTY_CATEGORY } from '../../constants';

// Autoremove borrowers and properties
Loans.before.remove((userId, { borrowerIds, propertyIds }) => {
  borrowerIds.forEach((borrowerId) => {
    const { loans } = BorrowerService.createQuery({
      $filters: { _id: borrowerId },
      loans: { _id: 1 },
    }).fetchOne();

    if (loans.length === 1) {
      BorrowerService.remove({ borrowerId });
    }
  });
  propertyIds.forEach((propertyId) => {
    const { loans, category } = PropertyService.createQuery({
      $filters: { _id: propertyId },
      loans: { _id: 1 },
      category: 1,
    }).fetchOne();

    if (loans.length === 1 && category === PROPERTY_CATEGORY.USER) {
      PropertyService.remove({ propertyId });
    }
  });
});

UpdateWatcherService.addUpdateWatching({
  collection: Loans,
  fields: [
    'residenceType',
    // 'structures', // The structures notifications are hard to read in slack
    // 'selectedStructure',
    'purchaseType',
    'verificationStatus',
    'customName',
    'contacts',
    'previousLoanTranches',
  ],
  shouldWatch: ({ userId }) =>
    SecurityService.hasRole(userId, ROLES.USER)
    || SecurityService.hasRole(userId, ROLES.PRO),
});
