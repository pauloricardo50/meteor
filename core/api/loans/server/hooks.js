import Loans from '../loans';
import BorrowerService from '../../borrowers/BorrowerService';
import PropertyService from '../../properties/PropertyService';

// Autoremove borrowers and properties
Loans.before.remove((userId, { borrowerIds, propertyIds }) => {
  borrowerIds.forEach((borrowerId) => {
    const { loans } = BorrowerService.createQuery({
      filters: { _id: borrowerId },
      loans: { _id: 1 },
    }).fetchOne();

    if (loans.length === 1) {
      BorrowerService.remove({ borrowerId });
    }
  });
  propertyIds.forEach((propertyId) => {
    const { loans } = PropertyService.createQuery({
      filters: { _id: propertyId },
      loans: { _id: 1 },
    }).fetchOne();

    if (loans.length === 1) {
      PropertyService.remove({ propertyId });
    }
  });
});
