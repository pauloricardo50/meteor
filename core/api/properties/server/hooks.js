import FileService from '../../files/server/FileService';
import { additionalDocumentsHook } from '../../helpers/sharedHooks';
import LoanService from '../../loans/server/LoanService';
import SecurityService from '../../security';
import UpdateWatcherService from '../../updateWatchers/server/UpdateWatcherService';
import { ROLES } from '../../users/userConstants';
import {
  conditionalDocuments,
  initialDocuments,
} from '../propertiesAdditionalDocuments';
import { PROPERTIES_COLLECTION } from '../propertyConstants';
import { PropertySchemaAdmin } from '../schemas/PropertySchema';
import { removePropertyFromLoan } from './propertyServerHelpers';
import Properties from '..';

Properties.before.remove((userId, { _id: propertyId }) => {
  // Remove all references to this property on the loan
  const loans = LoanService.find({ propertyIds: propertyId }).fetch();

  loans.forEach(loan => {
    removePropertyFromLoan({ loan, propertyId });
  });
});

Properties.after.insert(
  additionalDocumentsHook({
    collection: PROPERTIES_COLLECTION,
    initialDocuments,
    conditionalDocuments,
  }),
);

Properties.after.update(
  additionalDocumentsHook({
    collection: PROPERTIES_COLLECTION,
    initialDocuments,
    conditionalDocuments,
  }),
);

UpdateWatcherService.addUpdateWatching({
  collection: Properties,
  fields: PropertySchemaAdmin._schemaKeys,
  shouldWatch: ({ userId }) =>
    SecurityService.hasRole(userId, ROLES.USER) ||
    SecurityService.hasRole(userId, ROLES.PRO),
});

Properties.after.remove((userId, { _id }) =>
  FileService.deleteAllFilesForDoc(_id),
);
