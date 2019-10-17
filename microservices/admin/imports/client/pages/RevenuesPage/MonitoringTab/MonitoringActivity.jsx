// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import moment from 'moment';
import HighchartsMore from 'highcharts-more';
import Sankey from 'highcharts/modules/sankey';
import { injectIntl } from 'react-intl';

import DateRangePicker from 'core/components/DateInput/DateRangePicker';
import Chart from 'core/components/charts/Chart';
import { withSmartQuery } from 'core/api/containerToolkit/index';
import { loanStatusChanges } from 'core/api/monitoring/queries';
import {
  LOANS_COLLECTION,
  LOAN_STATUS_ORDER,
  LOAN_STATUS,
} from 'core/api/constants';
import { getStatuses } from 'core/components/StatusLabel/StatusLabel';

type MonitoringActivityProps = {};

const isBadStatus = status =>
  [LOAN_STATUS.PENDING, LOAN_STATUS.UNSUCCESSFUL].includes(status);

const sharedConfig = {
  dataLabels: {
    formatter() {
      const { weight: count } = this.point;
      return count > 1 ? count : null;
    },
  },
  opacity: 0.5,
};

const colors = getStatuses(LOANS_COLLECTION);
const makeNode = formatMessage => (status, index) => ({
  id: status,
  color: colors[status],
  column: index,
  name: formatMessage({ id: `Forms.status.${status}` }),
});
const mapData = ({ _id: { prevStatus, nextStatus }, count }) => ({
  from: prevStatus,
  to: nextStatus,
  weight: count,
});

const MonitoringActivity = ({
  range,
  setRange,
  data = [],
  intl: { formatMessage },
}: MonitoringActivityProps) => {
  const goodData = data
    .filter(({ _id }) => !isBadStatus(_id.prevStatus))
    .filter(({ _id }) => !isBadStatus(_id.nextStatus));
  const badData = data
    .filter(({ _id }) => _id.prevStatus !== LOAN_STATUS.UNSUCCESSFUL)
    .filter(({ _id }) => isBadStatus(_id.nextStatus));
  const resurrectData = data
    .filter(({ _id }) => isBadStatus(_id.prevStatus))
    .filter(({ _id }) => _id.nextStatus !== LOAN_STATUS.UNSUCCESSFUL); // Avoid pending -> unsuccessful

  const getNode = makeNode(formatMessage);
  return (
    <div className="monitoring-activity">
      <DateRangePicker
        range={range}
        onChange={setRange}
        numberOfMonths={3}
        enableOutsideDays
        isDayBlocked={() => false}
        isOutsideRange={() => false}
      />
      <div className="charts">
        <Chart
          title="Changements de statuts positifs"
          config={{ chart: { type: 'sankey', width: 1000, height: 500 } }}
          id="yooo"
          series={[
            {
              data: goodData.map(({ _id: { prevStatus, nextStatus }, count }) => {
                const isOutgoing = isBadStatus(nextStatus)
                    || LOAN_STATUS_ORDER.indexOf(nextStatus)
                      < LOAN_STATUS_ORDER.indexOf(prevStatus);
                return {
                  from: prevStatus,
                  to: nextStatus,
                  weight: count,
                  outgoing: isOutgoing,
                };
              }),
              name: 'Changement de statut',
              nodes: LOAN_STATUS_ORDER.filter(s => !isBadStatus(s)).map(getNode),
              ...sharedConfig,
            },
          ]}
          highchartsWrappers={{ HighchartsMore, Sankey }}
        />
        <Chart
          title="Changements de statuts négatifs"
          config={{ chart: { type: 'sankey', width: 400, height: 500 } }}
          id="yooo2"
          series={[
            {
              data: badData.map(mapData),
              name: 'Changement de statut',
              nodes: LOAN_STATUS_ORDER.map(status => ({
                ...getNode(status),
                column: isBadStatus(status) ? 1 : 0,
              })),
              ...sharedConfig,
            },
          ]}
          highchartsWrappers={{ HighchartsMore, Sankey }}
        />
        <Chart
          title="Résurrections"
          config={{ chart: { type: 'sankey', width: 400, height: 500 } }}
          id="yooo3"
          series={[
            {
              data: resurrectData.map(mapData),
              name: 'Changement de statut',
              nodes: LOAN_STATUS_ORDER.map(status => ({
                ...getNode(status),
                column: isBadStatus(status) ? 0 : 1,
              })),
              ...sharedConfig,
            },
          ]}
          highchartsWrappers={{ HighchartsMore, Sankey }}
        />
      </div>
    </div>
  );
};

export default compose(
  withState('range', 'setRange', {
    startDate: moment()
      .subtract(30, 'd')
      .toDate(),
    endDate: moment()
      .endOf('day')
      .toDate(),
  }),
  withSmartQuery({
    query: loanStatusChanges,
    params: ({ range: { startDate, endDate } }) => ({
      fromDate: startDate,
      toDate: endDate,
    }),
    dataName: 'data',
  }),
  injectIntl,
)(MonitoringActivity);
