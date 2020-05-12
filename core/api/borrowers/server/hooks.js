import FileService from '../../files/server/FileService';
import {
  additionalDocumentsHook,
  getFieldsToWatch,
} from '../../helpers/sharedHooks';
import SecurityService from '../../security';
import UpdateWatcherService from '../../updateWatchers/server/UpdateWatcherService';
import { ROLES } from '../../users/userConstants';
import { BORROWERS_COLLECTION } from '../borrowerConstants';
import Borrowers from '../borrowers';
import {
  conditionalDocuments,
  initialDocuments,
} from '../borrowersAdditionalDocuments';
import { BorrowerSchemaAdmin } from '../schemas/BorrowerSchema';
import BorrowerService from './BorrowerService';

Borrowers.after.insert(
  additionalDocumentsHook({
    collection: BORROWERS_COLLECTION,
    initialDocuments,
    conditionalDocuments,
  }),
);

Borrowers.after.update(
  (userId, borrower, fieldNames = []) => {
    const fieldsToWatch = getFieldsToWatch({
      conditionalDocuments: conditionalDocuments.filter(
        ({ requireOtherCollectionDoc }) => !requireOtherCollectionDoc,
      ),
    });

    if (!fieldNames.some(field => fieldsToWatch.includes(field))) {
      return;
    }
    additionalDocumentsHook({
      collection: BORROWERS_COLLECTION,
      initialDocuments,
      conditionalDocuments,
    })(userId, borrower);
  },
  { fetchPrevious: false },
);

// Clean up mortgagenotes from all structures that come from this borrower
Borrowers.before.remove((userId, { _id: borrowerId }) => {
  BorrowerService.cleanUpMortgageNotes({ borrowerId });
});

UpdateWatcherService.addUpdateWatching({
  collection: Borrowers,
  fields: BorrowerSchemaAdmin._schemaKeys,
  shouldWatch: ({ userId }) =>
    SecurityService.hasRole(userId, ROLES.USER) ||
    SecurityService.hasRole(userId, ROLES.PRO),
});

Borrowers.after.remove((userId, { _id }) =>
  FileService.deleteAllFilesForDoc(_id),
);
