import LoanService from '../../loans/server/LoanService';
import Properties from '..';

import { additionalDocumentsHook } from '../../helpers/sharedHooks';
import { PROPERTIES_COLLECTION } from '../propertyConstants';
import {
  initialDocuments,
  conditionalDocuments,
} from '../propertiesAdditionalDocuments';

Properties.before.remove((userId, { _id: propertyId }) => {
  // Remove all references to this property on the loan
  const loans = LoanService.find({ propertyIds: propertyId }).fetch();

  loans.forEach((loan) => {
    LoanService.update({
      loanId: loan._id,
      object: {
        structures: loan.structures.map(structure => ({
          ...structure,
          propertyId:
            structure.propertyId === propertyId ? null : structure.propertyId,
        })),
      },
    });
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
