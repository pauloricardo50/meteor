import { Factory } from 'meteor/dburles:factory';

export const generateData = (overrides = {}) => {
    const user = Factory.create('user', { ...overrides.user });
    const borrower = Factory.create('borrower', {
        userId: user._id,
        ...overrides.borrowers
    });
    const property = Factory.create('property', {
        userId: user._id,
        ...overrides.property
    });
    const loan = Factory.create('loan', {
        userId: user._id,
        propertyId: property._id,
        borrowerIds: [borrower._id],
        ...overrides.loan
    });
    const offer = Factory.create('offer', {
        loanId: loan._id,
        ...overrides.offers
    });

    return {
        loan,
        user,
        borrowers: [borrower],
        property,
        offers: [offer]
    };
};
