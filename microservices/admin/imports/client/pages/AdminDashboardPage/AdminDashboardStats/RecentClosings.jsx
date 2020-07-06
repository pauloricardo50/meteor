import React, { useState } from 'react';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import CountUp from 'react-countup';

import { ACTIVITY_EVENT_METADATA } from 'core/api/activities/activityConstants';
import { LOANS_COLLECTION, LOAN_STATUS } from 'core/api/loans/loanConstants';
import DateInput from 'core/components/DateInput';
import DialogSimple from 'core/components/DialogSimple';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import useMeteorData from 'core/hooks/useMeteorData';

import StatItem from './StatItem';

const RecentClosings = () => {
  const [fromDate, setFromDate] = useState(
    moment().subtract(30, 'days').toDate(),
  );
  const { data: loans = [] } = useMeteorData({
    query: LOANS_COLLECTION,
    params: {
      $filters: {
        status: { $in: [LOAN_STATUS.BILLING, LOAN_STATUS.FINALIZED] },
      },
      name: 1,
      borrowers: { name: 1 },
      userCache: 1,
      activities: {
        $filters: {
          'metadata.event': ACTIVITY_EVENT_METADATA.LOAN_CHANGE_STATUS,
          'metadata.details.nextStatus': LOAN_STATUS.BILLING,
        },
        $options: { sort: { date: -1 } },
        createdAt: 1,
      },
    },
  });

  const momentFromDate = moment(fromDate);
  const recentClosings = loans
    .filter(
      ({ activities = [] }) =>
        activities.length && momentFromDate.isBefore(activities[0].createdAt),
    )
    .map(loan => ({
      ...loan,
      month: moment(loan.activities[0].createdAt).format('YYYY-MM'),
    }))
    .sort(({ month: A }, { month: B }) => A.localeCompare(B));
  const days = moment().diff(momentFromDate, 'days');
  const grouped = groupBy(recentClosings, 'month');

  return (
    <StatItem
      value={<CountUp end={recentClosings.length} />}
      positive
      title={
        <div className="text-center">
          <div>Closings récents</div>
          <div>
            <small className="secondary">{days} derniers jours</small>
          </div>
        </div>
      }
      large
      top={
        <DialogSimple
          buttonProps={{ label: 'Détails', raised: false, primary: true }}
          title="Closings récents"
          closeOnly
          PaperProps={{ style: { overflow: 'visible' } }}
          style={{ overflow: 'visible' }}
          contentStyle={{ overflow: 'visible' }}
          bodyStyle={{ overflow: 'visible' }}
        >
          <DateInput
            value={fromDate}
            onChange={newDate => {
              setFromDate(moment(newDate).hours(0).minutes(0).seconds(0));
            }}
            label="Depuis"
            maxDate={new Date()}
          />

          {Object.keys(grouped).map(month => (
            <div key={month}>
              <h3>{month}</h3>
              {grouped[month].map(loan => (
                <CollectionIconLink relatedDoc={loan} key={loan._id} />
              ))}
            </div>
          ))}
        </DialogSimple>
      }
    />
  );
};
export default RecentClosings;
