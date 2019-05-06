import LoanService from '../../loans/server/LoanService';
import Properties from '..';
import SecurityService from '../../security';
import { additionalDocumentsHook } from '../../helpers/sharedHooks';
import { PROPERTIES_COLLECTION } from '../propertyConstants';
import {
  initialDocuments,
  conditionalDocuments,
} from '../propertiesAdditionalDocuments';
import UpdateWatcherService from '../../updateWatchers/server/UpdateWatcherService';
import { ROLES } from '../../constants';
import FileService from '../../files/server/FileService';
import { PropertySchemaAdmin } from '../schemas/PropertySchema';
import { removePropertyFromLoan } from './propertyServerHelpers';

Properties.before.remove((userId, { _id: propertyId }) => {
  // Remove all references to this property on the loan
  const loans = LoanService.find({ propertyIds: propertyId }).fetch();

  loans.forEach((loan) => {
    removePropertyFromLoan({ loan, propertyId });
  });
});

Properties.after.insert(additionalDocumentsHook({
  collection: PROPERTIES_COLLECTION,
  initialDocuments,
  conditionalDocuments,
}));

Properties.after.update(additionalDocumentsHook({
  collection: PROPERTIES_COLLECTION,
  initialDocuments,
  conditionalDocuments,
}));

UpdateWatcherService.addUpdateWatching({
  collection: Properties,
  fields: PropertySchemaAdmin._schemaKeys,
  shouldWatch: ({ userId }) =>
    SecurityService.hasRole(userId, ROLES.USER)
    || SecurityService.hasRole(userId, ROLES.PRO),
});

Properties.after.remove((userId, { _id }) =>
  FileService.deleteAllFilesForDoc(_id));
