import React from 'react';
import PropTypes from 'prop-types';

import { T, IntlDate } from 'core/components/Translation';

import DashboardItem from './DashboardItem';

const getDate = (loan) => {
  const { firstPaymentDate, paymentSchedule } = loan.logic;

  const today = new Date();
  const date = new Date(firstPaymentDate);
  let lastDate;

  while (today > date) {
    lastDate = new Date(date);
    switch (paymentSchedule) {
    case 'monthly': {
      date.setMonth(date.getMonth() + 1);
      break;
    }
    case 'yearly': {
      date.setFullYear(date.getFullYear() + 1);
      break;
    }
    case 'semester': {
      date.setMonth(date.getMonth() + 6);
      break;
    }
    default:
      break;
    }
  }
  return { date, lastDate };
};

const DashboardPayments = (props) => {
  const { date, lastDate } = getDate(props.loan);

  return (
    <DashboardItem title={<T id="DashboardPayments.title" />}>
      <h3 className="text-center">
        <IntlDate
          value={date}
          month="long"
          year="numeric"
          weekday="long"
          day="2-digit"
        />
      </h3>

      {!!lastDate && (
        <div>
          <h4 style={{ marginTop: 16 }}>
            <T id="DashboardPayments.lastDate" />
          </h4>
          <h3 className="text-center">
            <IntlDate
              value={lastDate}
              month="long"
              year="numeric"
              weekday="long"
              day="2-digit"
            />
          </h3>
        </div>
      )}
    </DashboardItem>
  );
};

DashboardPayments.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DashboardPayments;
