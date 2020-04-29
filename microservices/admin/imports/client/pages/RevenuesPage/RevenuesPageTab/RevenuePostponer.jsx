import React from 'react';
import moment from 'moment';

import { revenueUpdate } from 'core/api/revenues/methodDefinitions';
import ConfirmMethod from 'core/components/ConfirmMethod';
import IconButton from 'core/components/IconButton';

import RevenueCard from './RevenueCard';

const Description = props => {
  const { revenue, newDate } = props;
  const { expectedAt } = revenue;

  return (
    <div className="flex-col">
      <RevenueCard revenue={revenue} withActions={false} />
      <span className="mt-16">
        Repousser le revenu initialement attendu au mois de{' '}
        {moment(expectedAt).format('MMM YYYY')} au mois de{' '}
        {newDate.format('MMM YYYY')} ?
      </span>
    </div>
  );
};

const RevenuePostponer = props => {
  const {
    revenue: { _id: revenueId, expectedAt },
  } = props;

  const newDate = moment(expectedAt)
    .add(1, 'month')
    .endOf('month');

  return (
    <ConfirmMethod
      type="popover"
      method={() =>
        revenueUpdate.run({
          revenueId,
          object: {
            expectedAt: newDate.toDate(),
          },
        })
      }
      TriggerComponent={IconButton}
      buttonProps={{
        tooltip: "Repousser d'un mois",
        label: '',
        primary: true,
        type: 'right',
        size: 'small',
        fab: true,
        raised: true,
      }}
      description={<Description newDate={newDate} {...props} />}
    />
  );
};

export default RevenuePostponer;
