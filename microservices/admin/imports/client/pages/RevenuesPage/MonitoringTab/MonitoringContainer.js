import { compose, withStateHandlers, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import { loanMonitoring } from 'core/api/monitoring/queries';
import { LOAN_STATUS_ORDER } from 'core/api/constants';

export default compose(
  withStateHandlers(
    { groupBy: 'status', value: 'count' },
    { setState: () => newState => newState },
  ),
  withProps(({ setState }) => ({
    makeSetState: key => value => setState({ [key]: value }),
  })),
  withSmartQuery({
    query: loanMonitoring,
    params: ({ groupBy, value, category, status }) => ({
      groupBy,
      value,
      filters: { category, status },
    }),
    dataName: 'data',
  }),
  withProps(({ data, groupBy }) => {
    if (groupBy === 'status') {
      return {
        data: data.sort(({ _id: statusA }, { _id: statusB }) =>
          LOAN_STATUS_ORDER.indexOf(statusA)
            - LOAN_STATUS_ORDER.indexOf(statusB)),
      };
    }
  }),
);
