import BorrowerService from '../../borrowers/server/BorrowerService';
import LenderService from '../../lenders/server/LenderService';
import { PROPERTY_CATEGORY } from '../../properties/propertyConstants';
import PropertyService from '../../properties/server/PropertyService';
import LoanService from './LoanService';

export const setLenderOrganisation = ({
  structures,
  selectedStructure,
  _id: loanId,
  lendersCache = [],
  selectedLenderOrganisationLink = {},
}) => {
  if (selectedStructure) {
    const { offerId } = structures.find(({ id }) => id === selectedStructure);

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
};

export const cleanupLoanRemoval = ({ borrowerIds, propertyIds }) => {
  borrowerIds.forEach(borrowerId =>
    BorrowerService.cleanUpBorrowers({ borrowerId }),
  );
  propertyIds.forEach(propertyId => {
    const { loans, category } = PropertyService.get(propertyId, {
      loans: { _id: 1 },
      category: 1,
    });

    if (loans.length === 1 && category === PROPERTY_CATEGORY.USER) {
      PropertyService.remove({ propertyId });
    }
  });
};
