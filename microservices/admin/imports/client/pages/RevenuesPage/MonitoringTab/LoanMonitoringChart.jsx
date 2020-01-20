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
    admins,
    referringOrganisations,
    assignedEmployeeId,
    referringOrganisationId,
    revenueType,
    additionalFilters,
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
        admins={admins}
        referringOrganisations={referringOrganisations}
        assignedEmployeeId={assignedEmployeeId}
        referringOrganisationId={referringOrganisationId}
        revenueType={revenueType}
        additionalFilters={additionalFilters}
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
      assignedEmployeeId: null,
      referringOrganisationId: null,
      revenueType: null,
    }),
    { setState: () => newState => newState },
  ),
  withProps(({ setState }) => ({
    makeSetState: key => value => setState({ [key]: value }),
  })),
  withSmartQuery({
    query: loanMonitoring,
    params: ({
      groupBy,
      value,
      category,
      status,
      withAnonymous,
      assignedEmployeeId,
      referringOrganisationId,
      revenueType,
    }) => ({
      groupBy,
      value,
      filters: {
        category,
        status,
        anonymous: getAnonymous(withAnonymous),
        'userCache.assignedEmployeeCache._id': assignedEmployeeId || undefined,
        'userCache.referredByOrganisationLink':
          referringOrganisationId || undefined,
      },
      revenueFilters: revenueType
        ? { 'revenues.type': revenueType }
        : undefined,
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
