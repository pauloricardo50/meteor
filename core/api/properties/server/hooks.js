import LoanService from '../../loans/LoanService';
import Properties from '..';

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
