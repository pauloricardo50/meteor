import pick from 'lodash/pick';

import proPropertyLoans from '../../../loans/queries/proPropertyLoans';

const getPropertyLoansAPI = ({ user: { _id: userId }, params }) => {
  const { propertyId } = params;

  const loans = proPropertyLoans.clone({ propertyId }).fetch({ userId });

  const filteredLoans = loans.map(loan =>
    pick(loan, [
      'user.name',
      'user.phoneNumbers',
      'user.email',
      'user.referredByUser.name',
      'user.referredByOrganisation.name',
      'createdAt',
      'name',
      'loanProgress',
      'status',
      'properties',
    ]));

  return filteredLoans.map(({ properties, ...loan }) => {
    const property = properties.find(({ _id }) => _id === propertyId) || {};
    const { solvent } = property;
    return { ...loan, solvent };
  });
};

export default getPropertyLoansAPI;
