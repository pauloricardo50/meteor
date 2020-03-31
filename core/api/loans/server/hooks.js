import LenderService from 'core/api/lenders/server/LenderService';
import FileService from '../../files/server/FileService';
import BorrowerService from '../../borrowers/server/BorrowerService';
import PropertyService from '../../properties/server/PropertyService';
import UpdateWatcherService from '../../updateWatchers/server/UpdateWatcherService';
import ActivityService from '../../activities/server/ActivityService';
import SecurityService from '../../security';
import { ROLES, PROPERTY_CATEGORY } from '../../constants';
import Loans from '../loans';
import formatNumbersHook, {
  formatPhoneNumber,
} from '../../../utils/phoneFormatting';
import LoanService from './LoanService';
import FrontService from '../../front/server/FrontService';

// Autoremove borrowers and properties
Loans.before.remove((userId, { borrowerIds, propertyIds }) => {
  borrowerIds.forEach(borrowerId => {
    const { insuranceRequests = [], loans = [] } = BorrowerService.get(
      borrowerId,
      {
        loans: { _id: 1 },
        insuranceRequests: { _id: 1 },
      },
    );
    const hasOneLoan = loans.length === 1;
    const hasOneInsuranceRequest = insuranceRequests.length === 1;

    if (hasOneLoan ? !hasOneInsuranceRequest : hasOneInsuranceRequest) {
      BorrowerService.remove({ borrowerId });
    }
  });
  propertyIds.forEach(propertyId => {
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
    // 'selectedStructure',
    // 'structures', // The structures notifications are hard to read in slack
  ],
  shouldWatch: ({ userId }) =>
    SecurityService.hasRole(userId, ROLES.USER) ||
    SecurityService.hasRole(userId, ROLES.PRO),
});

Loans.after.remove((userId, { _id }) => FileService.deleteAllFilesForDoc(_id));

Loans.after.insert((userId, doc) =>
  ActivityService.addCreatedAtActivity({
    createdAt: doc.createdAt,
    loanLink: { _id: doc._id },
    title: 'Dossier créé',
  }),
);

formatNumbersHook(Loans, 'contacts', (oldContacts = []) =>
  oldContacts.map(({ phoneNumber, ...contact }) => ({
    ...contact,
    phoneNumber: formatPhoneNumber(phoneNumber),
  })),
);

Loans.after.update(
  (
    userId,
    {
      _id: loanId,
      structures = [],
      selectedStructure,
      lendersCache = [],
      selectedLenderOrganisationLink = {},
    },
    fieldNames = [],
  ) => {
    const fieldsToWatch = ['structures', 'selectedStructure'];
    if (fieldNames.some(fieldName => fieldsToWatch.includes(fieldName))) {
      if (selectedStructure) {
        const { offerId } = structures.find(
          ({ id }) => id === selectedStructure,
        );

        // Selected structure has no selected offer
        if (!offerId && selectedLenderOrganisationLink._id) {
          return LoanService.removeLink({
            id: loanId,
            linkName: 'selectedLenderOrganisation',
            linkId: selectedLenderOrganisationLink._id,
          });
        }
        if (!offerId) {
          return;
        }

        const selectedLenderOrganisation =
          lendersCache.find(({ _id: lenderId }) => {
            const { offers = [] } = LenderService.get(
              { _id: lenderId, 'loanLink._id': loanId },
              { offers: { _id: 1 } },
            );
            return offers.some(({ _id }) => _id === offerId);
          }) || {};

        const {
          organisationLink: { _id: selectedLenderOrganisationId } = {},
        } = selectedLenderOrganisation;

        if (selectedLenderOrganisationId) {
          const {
            _id: currentselectedLenderOrganisationId,
          } = selectedLenderOrganisationLink;

          if (
            selectedLenderOrganisationId !== currentselectedLenderOrganisationId
          ) {
            LoanService.addLink({
              id: loanId,
              linkName: 'selectedLenderOrganisation',
              linkId: selectedLenderOrganisationId,
            });
          }
        }
      }
    }
  },
);

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
