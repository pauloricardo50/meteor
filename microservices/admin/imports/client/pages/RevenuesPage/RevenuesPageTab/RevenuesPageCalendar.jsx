// @flow

import React, { useState, useMemo } from 'react';
import moment from 'moment';

import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import DateRangePicker from 'core/components/DateInput/DateRangePicker';
import Loading from 'core/components/Loading';
import T from 'core/components/Translation';
import { adminRevenues } from 'core/api/revenues/queries';
import { REVENUE_STATUS, REVENUE_TYPES } from 'core/api/constants';
import Select from 'core/components/Select';
import MongoSelect from 'core/components/Select/MongoSelect';
import employees from 'core/arrays/epotekEmployees';
import RevenuesPageCalendarColumn from './RevenuesPageCalendarColumn';

type RevenuesPageCalendarProps = {};

const getMonths = ({ startDate, endDate }) => {
  const clonedStartDate = moment(startDate);
  const clonedEndDate = moment(endDate);
  const result = [];
  let i = 0;
  if (clonedEndDate.isBefore(clonedStartDate)) {
    throw 'End date must be greater than start date.';
  }

  while (clonedStartDate.isBefore(clonedEndDate)) {
    if (i === 0) {
      result.push(
        moment(clonedStartDate)
          .startOf('month')
          .toDate(),
      );
    } else {
      result.push(
        moment(clonedStartDate)
          .endOf('month')
          .toDate(),
      );
    }
    clonedStartDate.add(1, 'month');
    i += 1;
  }

  return result;
};

const getMonthId = date => moment(date).format('MM/YY');

const groupRevenues = revenues =>
  revenues.reduce((obj, revenue) => {
    const { status, expectedAt, paidAt } = revenue;
    const revenueDate = status === REVENUE_STATUS.CLOSED ? paidAt : expectedAt;
    const id = getMonthId(revenueDate);

    if (obj[id]) {
      return { ...obj, [id]: [...obj[id], revenue] };
    }

    return { ...obj, [id]: [revenue] };
  }, {});

const RevenuesPageCalendar = (props: RevenuesPageCalendarProps) => {
  const [type, setType] = useState();
  const [assignee, setAssignee] = useState(null);
  const [revenueDateRange, setRevenueDateRange] = useState({
    startDate: moment()
      .subtract(1, 'M')
      .startOf('month')
      .toDate(),
    endDate: moment()
      .endOf('month')
      .add(3, 'M')
      .toDate(),
  });

  const months = getMonths(revenueDateRange);

  const { data, loading } = useStaticMeteorData(
    {
      query: adminRevenues,
      params: {
        date: { $gte: months[0], $lte: months[months.length - 1] },
        type,
        $body: {
          status: 1,
          expectedAt: 1,
          paidAt: 1,
          amount: 1,
          type: 1,
          description: 1,
          loan: { name: 1, borrowers: { name: 1 }, userCache: 1 },
        },
      },
    },
    [revenueDateRange.startDate, revenueDateRange.endDate, type],
  );

  const filteredRevenues = useMemo(
    () =>
      assignee
        ? data.filter(({ loan }) => {
            if (
              loan &&
              loan.userCache &&
              loan.userCache.assignedEmployeeCache
            ) {
              return loan.userCache.assignedEmployeeCache._id === assignee;
            }

            return false;
          })
        : data,
    [assignee, data],
  );
  const groupedRevenues = useMemo(
    () => filteredRevenues && groupRevenues(filteredRevenues, months),
    [filteredRevenues],
  );

  return (
    <div>
      <div className="flex mb-16">
        <div className="mr-8">
          <DateRangePicker
            range={revenueDateRange}
            onChange={setRevenueDateRange}
          />
        </div>
        <MongoSelect
          value={type}
          onChange={setType}
          options={REVENUE_TYPES}
          id="type"
          label={<T id="Forms.type" />}
          className="mr-8"
        />
        <Select
          value={assignee}
          onChange={setAssignee}
          options={[
            { id: null, label: 'Tous' },
            ...employees
              .filter(({ _id }) => !!_id)
              .map(({ _id, name }) => ({ id: _id, label: name })),
          ]}
          label="Conseiller"
          displayEmpty
        />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="revenues-calendar">
          {months.map(month => (
            <RevenuesPageCalendarColumn
              key={month}
              month={month}
              revenues={groupedRevenues[getMonthId(month)]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RevenuesPageCalendar;
