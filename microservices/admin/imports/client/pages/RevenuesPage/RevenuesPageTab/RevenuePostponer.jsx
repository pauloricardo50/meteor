import React from 'react';
import moment from 'moment';

import ConfirmMethod from 'core/components/ConfirmMethod';
import { revenueUpdate } from 'core/api/revenues/methodDefinitions';
import IconButton from 'core/components/IconButton';

const RevenuePostponer = props => {
  const {
    revenue: { _id: revenueId, expectedAt },
  } = props;

  const newDate = moment(expectedAt)
    .add(1, 'month')
    .endOf('month');

  return (
    <ConfirmMethod
      type="modal"
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
        tooltip: 'Repousser de un mois',
        label: '',
        primary: true,
        type: 'right',
        size: 'small',
        fab: true,
        raised: true,
      }}
      description={`Repousser le revenu au mois de ${newDate.format(
        'MMM YYYY',
      )} ?`}
    />
  );
};

export default RevenuePostponer;
