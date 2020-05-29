import formatNumbersHook, {
  formatPhoneNumber,
} from '../../../utils/phoneFormatting';
import ActivityService from '../../activities/server/ActivityService';
import FileService from '../../files/server/FileService';
import FrontService from '../../front/server/FrontService';
import {
  additionalDocumentsHook,
  getFieldsToWatch,
} from '../../helpers/sharedHooks';
import {
  conditionalDocuments,
  initialDocuments,
} from '../../properties/propertiesAdditionalDocuments';
import {
  PROPERTIES_COLLECTION,
  PROPERTY_CATEGORY,
} from '../../properties/propertyConstants';
import PropertyService from '../../properties/server/PropertyService';
import SecurityService from '../../security';
import UpdateWatcherService from '../../updateWatchers/server/UpdateWatcherService';
import { ROLES } from '../../users/userConstants';
import Loans from '../loans';
import { cleanupLoanRemoval, setLenderOrganisation } from './hooksHelpers';

// Autoremove borrowers and properties
Loans.before.remove((userId, { borrowerIds, propertyIds }) => {
  cleanupLoanRemoval(borrowerIds, propertyIds);
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
    // 'selectedStructure',
    // 'structures', // The structures notifications are hard to read in slack
  ],
  shouldWatch: ({ userId }) =>
    SecurityService.hasRole(userId, ROLES.USER) ||
    SecurityService.hasRole(userId, ROLES.PRO),
});

Loans.after.remove((userId, { _id }) => FileService.deleteAllFilesForDoc(_id));

Loans.after.insert((userId, doc) => {
  ActivityService.addCreatedAtActivity({
    createdAt: doc.createdAt,
    loanLink: { _id: doc._id },
    title: 'Dossier créé',
  });
  setLenderOrganisation(doc);
});

formatNumbersHook(Loans, 'contacts', (oldContacts = []) =>
  oldContacts.map(({ phoneNumber, ...contact }) => ({
    ...contact,
    phoneNumber: formatPhoneNumber(phoneNumber),
  })),
);

Loans.after.update((userId, loan, fieldNames = []) => {
  const fieldsToWatch = ['structures', 'selectedStructure', 'lendersCache'];
  if (fieldNames.some(fieldName => fieldsToWatch.includes(fieldName))) {
    setLenderOrganisation(loan);
  }
});

Loans.before.remove((userId, { frontTagId }) => {
  if (frontTagId) {
    FrontService.listTagConversations({ tagId: frontTagId, limit: 1 }).then(
      ({ _results }) => {
        // if there are no conversations related to a loan, and it is removed,
        // remove this particular tag, as it is useless
        if (_results?.length === 0) {
          FrontService.deleteTag({ tagId: frontTagId });
        }
      },
    );
  }
});

Loans.after.update(
  (userId, loan, fieldNames = []) => {
    const fieldsToWatch = getFieldsToWatch({
      conditionalDocuments: conditionalDocuments.filter(
        ({ requireOtherCollectionDoc }) => requireOtherCollectionDoc,
      ),
    });

    if (!fieldNames.some(field => fieldsToWatch.includes(field))) {
      return;
    }

    const { propertyIds = [] } = loan;

    const documentsHook = additionalDocumentsHook({
      collection: PROPERTIES_COLLECTION,
      initialDocuments,
      conditionalDocuments,
      otherCollectionDoc: loan,
    });

    if (propertyIds.length) {
      const properties = PropertyService.fetch({
        $filters: {
          _id: { $in: propertyIds },
          category: PROPERTY_CATEGORY.USER,
        },
        additionalDocuments: 1,
      });

      properties.forEach(property => {
        documentsHook(userId, property);
      });
    }
  },
  { fetchPrevious: false },
);
