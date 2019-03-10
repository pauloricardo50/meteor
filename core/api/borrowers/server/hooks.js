import { ROLES } from '../../constants';
import { additionalDocumentsHook } from '../../helpers/sharedHooks';
import Borrowers from '../borrowers';
import { BORROWERS_COLLECTION } from '../borrowerConstants';
import {
  initialDocuments,
  conditionalDocuments,
} from '../borrowersAdditionalDocuments';
import BorrowerService from './BorrowerService';
import UpdateWatcherService from '../../updateWatchers/server/UpdateWatcherService';
import SecurityService from '../../security';
import { BorrowerSchemaAdmin } from '../schemas/BorrowerSchema';

Borrowers.after.insert(additionalDocumentsHook({
  collection: BORROWERS_COLLECTION,
  initialDocuments,
  conditionalDocuments,
}));

Borrowers.after.update(additionalDocumentsHook({
  collection: BORROWERS_COLLECTION,
  initialDocuments,
  conditionalDocuments,
}));

// Clean up mortgagenotes from all structures that come from this borrower
Borrowers.before.remove((userId, { _id: borrowerId }) => {
  BorrowerService.cleanUpMortgageNotes({ borrowerId });
});

UpdateWatcherService.addUpdateWatching({
  collection: Borrowers,
  fields: BorrowerSchemaAdmin._schemaKeys,
  shouldWatch: ({ userId }) =>
    SecurityService.hasRole(userId, ROLES.USER)
    || SecurityService.hasRole(userId, ROLES.PRO),
});
