import { withSmartQuery } from 'core/api';
import { adminLoans as query } from 'core/api/loans/queries';

export default withSmartQuery({
  query,
  params: {
    $body: {
      name: 1,
      user: { name: 1 },
      status: 1,
      createdAt: 1,
      updatedAt: 1,
      step: 1,
      structures: {
        id: 1,
        wantedLoan: 1,
        propertyId: 1,
        promotionOptionId: 1,
        propertyValue: 1,
      },
      selectedStructure: 1,
      properties: { totalValue: 1, value: 1 },
      promotionOptions: {
        value: 1,
        promotionLots: { properties: { totalValue: 1, value: 1 } },
      },
    },
  },
  queryOptions: { reactive: false },
  dataName: 'loans',
});
