import { Factory } from 'meteor/dburles:factory';
import Tasks from '../../api/tasks/tasks';

export const generateData = (overrides = {}) => {
  const user = Factory.create('user', { ...overrides.user });
  const admin = Factory.create('admin', { ...overrides.admin });
  const borrower = Factory.create('borrower', {
    userId: user._id,
    ...overrides.borrowers,
  });
  const property = Factory.create('property', {
    userId: user._id,
    ...overrides.property,
  });
  const loan = Factory.create('loan', {
    userId: user._id,
    propertyIds: [property._id],
    borrowerIds: [borrower._id],
    ...overrides.loan,
  });
  const offer = Factory.create('offer', {
    loanId: loan._id,
    ...overrides.offers,
  });

  return {
    loan,
    user,
    admin,
    borrowers: [borrower],
    property,
    offers: [offer],
  };
};
