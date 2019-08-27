import FileService from '../../files/server/FileService';
import BorrowerService from '../../borrowers/server/BorrowerService';
import PropertyService from '../../properties/server/PropertyService';
import UpdateWatcherService from '../../updateWatchers/server/UpdateWatcherService';
import ActivityService from '../../activities/server/ActivityService';
import SecurityService from '../../security';
import { ROLES, PROPERTY_CATEGORY } from '../../constants';
import Loans from '../loans';

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
    'applicationType',
    'contacts',
    'customName',
    'previousLoanTranches',
    'purchaseType',
    'residenceType',
    'step',
    'verificationStatus',
    // 'selectedStructure',
    // 'structures', // The structures notifications are hard to read in slack
  ],
  shouldWatch: ({ userId }) =>
    SecurityService.hasRole(userId, ROLES.USER)
    || SecurityService.hasRole(userId, ROLES.PRO),
});

Loans.after.remove((userId, { _id }) => FileService.deleteAllFilesForDoc(_id));

Loans.after.insert((userId, doc) =>
  ActivityService.addCreatedAtActivity({
    createdAt: doc.createdAt,
    loanLink: { _id: doc._id },
    title: 'Dossier créé',
  }));
