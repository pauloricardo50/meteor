import React from 'react';
import moment from 'moment';

import Tooltip from 'core/components/Material/Tooltip';
import { toMoney } from 'core/utils/conversionFunctions';
import { REVENUE_STATUS } from 'core/api/constants';
import RevenueCard from './RevenueCard';

const RevenuesPageCalendarColumn = ({
  month,
  revenues = [],
  setRevenueToModify,
  setOpenModifier,
  refetch,
}) => {
  const { openAmount, closedAmount, totalAmount } = revenues.reduce(
    (obj, { status, amount }) => {
      if (status === REVENUE_STATUS.CLOSED) {
        return {
          ...obj,
          totalAmount: obj.totalAmount + amount,
          closedAmount: obj.closedAmount + amount,
        };
      }
      return {
        ...obj,
        totalAmount: obj.totalAmount + amount,
        openAmount: obj.openAmount + amount,
      };
    },
    { openAmount: 0, closedAmount: 0, totalAmount: 0 },
  );

  return (
    <div className="revenues-calendar-column">
      <div className="revenues-calendar-column-header">
        <div className="flex-col">
          <h4>{moment(month).format('MMMM YYYY')}</h4>
          <div>{revenues.length} revenus</div>
        </div>
        <div className="revenues-calendar-column-header-amount">
          <Tooltip title="À encaisser" placement="left">
            <div>{toMoney(openAmount)}</div>
          </Tooltip>
          <Tooltip title="Encaissé" placement="left">
            <div>{toMoney(closedAmount)}</div>
          </Tooltip>
          <hr />
          <Tooltip title="Total pour le mois si tout va bien" placement="left">
            <b>{toMoney(totalAmount)}</b>
          </Tooltip>
        </div>
      </div>

      {revenues.map(revenue => (
        <RevenueCard
          key={revenue._id}
          revenue={revenue}
          setRevenueToModify={setRevenueToModify}
          setOpenModifier={setOpenModifier}
          refetch={refetch}
        />
      ))}
    </div>
  );
};

export default RevenuesPageCalendarColumn;
