import { compose, mapProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { userLoans } from '../../api/loans/queries';
import { reuseProperty } from '../../api/loans/methodDefinitions';

export default compose(
  withSmartQuery({
    query: userLoans,
    params: ({ propertyUserId }) => ({
      userId: propertyUserId,
      $body: { properties: { _id: 1, totalValue: 1, address: 1 } },
    }),
    queryOptions: { single: false, shouldRefetch: () => false },
    dataName: 'loans',
    renderMissingDoc: false,
    refetchOnMethodCall: false,
  }),
  mapProps(({ loans, loanId, disabled }) => {
    const currentLoan = loans.find(({ _id }) => _id === loanId);
    const { properties: currentProperties = [] } = currentLoan;
    const allOtherLoans = loans.filter(({ _id }) => _id !== loanId);
    const propertiesToReuse = allOtherLoans
      .reduce((array, { properties = [] }) => [...array, ...properties], [])
      .filter(({ _id: propertyId }) =>
        !currentProperties.find(({ _id }) => _id === propertyId));

    return {
      disabled,
      properties: propertiesToReuse,
      handleSelectProperty: propertyId =>
        reuseProperty.run({ propertyId, loanId }),
    };
  }),
);
