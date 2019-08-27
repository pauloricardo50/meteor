// @flow
import React from 'react';
import CountUp from 'react-countup';
import { compose, withState } from 'recompose';
import moment from 'moment';

import { newLoans, loanHistogram } from 'core/api/stats/queries';
import { withSmartQuery } from 'core/api/containerToolkit/index';
import { Percent } from 'core/components/Translation';
import Select from 'core/components/Select';
import Histogram from 'core/components/charts/Histogram';
import IconButton from 'core/components/IconButton';
import StatItem from './StatItem';

type NewLoansStatProps = {};

const formatDate = date =>
  moment.utc(moment(date).format('YYYY-MM-DD')).valueOf();

const NewLoansStat = ({
  newLoans,
  setPeriod,
  period,
  showChart,
  setShowChart,
  loanHistogram,
}: NewLoansStatProps) => (
  <StatItem
    value={<CountUp end={newLoans.count} />}
    increment={<Percent showPlus value={newLoans.change} />}
    positive={newLoans.change > 0}
    title="Nouveaux dossiers"
    top={(
      <>
        <Select
          label="Période"
          options={[
            { id: 7, label: '7 derniers jours' },
            { id: 30, label: '30 derniers jours' },
          ]}
          onChange={(_, v) => setPeriod(v)}
          value={period}
        />
        <IconButton
          type={showChart ? 'close' : 'chart'}
          onClick={() => setShowChart(!showChart)}
        />
      </>
    )}
  >
    {showChart && (
      <div className="chart">
        <Histogram
          data={loanHistogram.map(({ _id, count }) => [formatDate(_id), count])}
          legend={{ enabled: false }}
          name="Nouveaux dossiers"
        />
      </div>
    )}
  </StatItem>
);

export default compose(
  withState('period', 'setPeriod', 30),
  withState('showChart', 'setShowChart', false),
  withSmartQuery({
    query: newLoans,
    dataName: 'newLoans',
    params: ({ period }) => ({ period }),
    queryOptions: {
      shouldRefetch: (
        { props: { period } },
        { props: { period: newPeriod } },
      ) => period !== newPeriod,
    },
  }),
  withSmartQuery({
    query: loanHistogram,
    dataName: 'loanHistogram',
    params: ({ period }) => ({ period }),
    queryOptions: {
      shouldRefetch: (
        { props: { period } },
        { props: { period: newPeriod } },
      ) => period !== newPeriod,
    },
  }),
)(NewLoansStat);
