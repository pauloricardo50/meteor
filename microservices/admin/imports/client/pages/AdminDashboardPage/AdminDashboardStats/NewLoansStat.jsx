import React from 'react';
import CountUp from 'react-countup';
import { compose, withState } from 'recompose';
import moment from 'moment';

import { newLoans, loanHistogram } from 'core/api/stats/queries';
import { withSmartQuery } from 'core/api/containerToolkit';
import { Percent } from 'core/components/Translation';
import Select from 'core/components/Select';
import Histogram from 'core/components/charts/Histogram';
import IconButton from 'core/components/IconButton';
import DialogSimple from 'core/components/DialogSimple';
import StatItem from './StatItem';

const formatDate = date =>
  moment.utc(moment(date).format('YYYY-MM-DD')).valueOf();

const NewLoansStat = ({
  newLoans,
  setPeriod,
  period,
  showChart,
  setShowChart,
  loanHistogram,
  withAnonymous,
  setWithAnonymous,
}) => (
  <StatItem
    value={<CountUp end={newLoans.count} />}
    increment={<Percent showPlus value={newLoans.change} />}
    positive={newLoans.change > 0}
    title="Nouveaux dossiers"
    large
    top={
      <>
        <DialogSimple
          buttonProps={{ label: 'Options', raised: false, primary: true }}
          title="Options"
          closeOnly
        >
          <Select
            label="Période"
            options={[
              { id: 7, label: '7 derniers jours' },
              { id: 30, label: '30 derniers jours' },
              { id: 90, label: '90 derniers jours' },
            ]}
            onChange={setPeriod}
            value={period}
          />
          <Select
            label="Anonymes"
            options={[
              { id: true, label: 'Avec' },
              { id: false, label: 'Sans' },
            ]}
            onChange={setWithAnonymous}
            value={withAnonymous}
          />
        </DialogSimple>
        <IconButton
          type={showChart ? 'close' : 'chart'}
          onClick={() => setShowChart(!showChart)}
        />
      </>
    }
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
  withState('withAnonymous', 'setWithAnonymous', false),
  withState('showChart', 'setShowChart', false),
  withSmartQuery({
    query: newLoans,
    dataName: 'newLoans',
    params: ({ period, withAnonymous }) => ({ period, withAnonymous }),
    refetchOnMethodCall: false,
  }),
  withSmartQuery({
    query: loanHistogram,
    dataName: 'loanHistogram',
    params: ({ period, withAnonymous }) => ({ period, withAnonymous }),
    refetchOnMethodCall: false,
  }),
)(NewLoansStat);
