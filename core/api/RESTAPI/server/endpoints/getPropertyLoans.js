import pick from 'lodash/pick';

import proPropertyLoans from '../../../loans/queries/proPropertyLoans';

const getPropertyLoansAPI = ({ user: { _id: userId }, params }) => {
  const { propertyId } = params;

  const loans = proPropertyLoans.clone({ propertyId }).fetch({ userId });

  return loans.map(loan =>
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
    ]));
};

export default getPropertyLoansAPI;
