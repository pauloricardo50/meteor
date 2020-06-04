import { compose, withState } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';

export default compose(
  withState('assignees', 'setAssignees', []),
  withSmartQuery({
    query: LOANS_COLLECTION,
    params: ({ assignees }) => ({
      $filters: assignees.length
        ? { 'assigneeLinks._id': { $in: assignees } }
        : {},
      createdAt: 1,
      name: 1,
      status: 1,
      step: 1,
      updatedAt: 1,
      user: { name: 1 },
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
      $options: { sort: { createdAt: -1 } },
    }),
    deps: ({ assignees }) => [assignees],
    queryOptions: { reactive: false },
    dataName: 'loans',
  }),
);
