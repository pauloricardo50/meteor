import { compose, mapProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import userLoans from '../../api/loans/queries/userLoans';

export default compose(
  withSmartQuery({
    query: userLoans,
    params: {
      $body: { properties: { _id: 1, totalValue: 1, address: 1 } },
    },
    queryOptions: { reactive: false, single: false },
    dataName: 'loans',
    renderMissingDoc: false,
  }),
  mapProps(({ loans, loanId }) => {
    const allOtherLoans = loans.filter(({ _id }) => _id !== loanId);
    const propertiesToReuse = allOtherLoans.reduce(
      (array, { properties }) => [...array, ...properties],
      [],
    );

    return {
      properties: propertiesToReuse,
      onSelectProperty: propertyId => reuseProperty.run({ propertyId, loanId }),
    };
  }),
);
