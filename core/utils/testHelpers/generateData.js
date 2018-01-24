import { Factory } from 'meteor/dburles:factory';

export const generateData = (overrides = {}) => {
  const user = Factory.create('user', { ...overrides.user });
  const borrower = Factory.create('borrower', {
    userId: user._id,
    ...overrides.borrowers,
  });
  const property = Factory.create('property', {
    userId: user._id,
    ...overrides.property,
  });
  const loanRequest = Factory.create('loanRequest', {
    userId: user._id,
    property: property._id,
    borrowers: [borrower._id],
    ...overrides.loanRequest,
  });
  const offer = Factory.create('offer', {
    requestId: loanRequest._id,
    ...overrides.offers,
  });

  return {
    loanRequest,
    user,
    borrowers: [borrower],
    property,
    offers: [offer],
  };
};
