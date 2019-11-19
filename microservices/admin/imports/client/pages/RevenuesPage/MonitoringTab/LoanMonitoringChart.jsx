// @flow
import React from 'react';
import { compose, withStateHandlers, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import { LOAN_STATUS_ORDER } from 'core/api/constants';
import { loanMonitoring } from 'core/api/monitoring/queries';
import MonitoringFilters from './MonitoringFilters';
import MonitoringChart from './MonitoringChart';

type LoanMonitoringChartProps = {};

const LoanMonitoringChart = (props: LoanMonitoringChartProps) => {
  const {
    category,
    status,
    groupBy,
    withAnonymous,
    makeSetState,
    data,
    value,
    allowedGroupBy,
    filters,
    postProcess = ({ data }) => data,
  } = props;

  return (
    <div>
      <MonitoringFilters
        category={category}
        makeSetState={makeSetState}
        status={status}
        groupBy={groupBy}
        withAnonymous={withAnonymous}
        allowedGroupBy={allowedGroupBy}
        filters={filters}
      />
      <MonitoringChart
        data={postProcess(props)}
        groupBy={groupBy}
        value={value}
      />
    </div>
  );
};

const getAnonymous = withAnonymous =>
  withAnonymous ? undefined : { $in: [null, false] };

export default compose(
  withStateHandlers(
    ({ initialValue, initialGroupBy }) => ({
      groupBy: initialGroupBy,
      value: initialValue,
      withAnonymous: false,
    }),
    { setState: () => newState => newState },
  ),
  withProps(({ setState }) => ({
    makeSetState: key => value => setState({ [key]: value }),
  })),
  withSmartQuery({
    query: loanMonitoring,
    params: ({ groupBy, value, category, status, withAnonymous }) => ({
      groupBy,
      value,
      filters: { category, status, anonymous: getAnonymous(withAnonymous) },
    }),
    dataName: 'data',
  }),
  withProps(({ data, groupBy }) => {
    if (groupBy === 'status') {
      return {
        data: data.sort(
          ({ _id: statusA }, { _id: statusB }) =>
            LOAN_STATUS_ORDER.indexOf(statusA) -
            LOAN_STATUS_ORDER.indexOf(statusB),
        ),
      };
    }
  }),
)(LoanMonitoringChart);
