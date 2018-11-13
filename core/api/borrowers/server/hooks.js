import { additionalDocumentsHook } from '../../helpers/sharedHooks';
import Borrowers from '../borrowers';
import { BORROWERS_COLLECTION } from '../borrowerConstants';
import {
  initialDocuments,
  conditionalDocuments,
} from '../borrowersAdditionalDocuments';

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
