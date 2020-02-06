import React, { useState } from 'react';
import moment from 'moment';

import { Money, Percent } from 'core/components/Translation';
import { employeesById } from 'core/arrays/epotekEmployees';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { adminRevenues } from 'core/api/revenues/queries';
import IconButton from 'core/components/IconButton';
import Tooltip from 'core/components/Material/Tooltip';

const groupRevenues = revenues =>
  revenues.reduce((obj, { amount, loan: { assigneeLinks = [] } = {} }) => {
    assigneeLinks.forEach(({ _id, percent }) => {
      obj[_id] = (obj[_id] || 0) + (amount * percent) / 100;
    });

    return obj;
  }, {});

const RevenuesDistribution = props => {
  const [dateRange, setDateRange] = useState({
    startDate: moment()
      .quarter(moment().quarter())
      .startOf('quarter')
      .toDate(),
    endDate: moment()
      .quarter(moment().quarter())
      .endOf('quarter')
      .toDate(),
  });

  const { data: revenues = [], loading } = useStaticMeteorData(
    {
      query: adminRevenues,
      params: {
        paidAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
        $body: { amount: 1, loan: { assigneeLinks: 1 } },
      },
    },
    [dateRange],
  );

  const groupedRevenues = !loading && groupRevenues(revenues);
  const total =
    groupedRevenues &&
    Object.keys(groupedRevenues).reduce(
      (tot, key) => tot + groupedRevenues[key],
      0,
    );

  const mapped = Object.keys(groupedRevenues)
    .map(_id => ({
      _id,
      name: employeesById[_id] ? employeesById[_id].name : 'Employé sans nom',
      amount: groupedRevenues[_id],
      ratio: groupedRevenues[_id] / total,
    }))
    .sort(({ amount: amount1 }, { amount: amount2 }) => amount2 - amount1);

  return (
    <div>
      <h2>Répartition entre conseillers</h2>

      <div className="flex center-align">
        <h3 className="mr-16">
          <span className="secondary">Trimestre:</span>{' '}
          <Tooltip
            title={`${moment(dateRange.startDate).format(
              'D MMMM YYYY',
            )} - ${moment(dateRange.endDate).format('D MMMM YYYY')}`}
          >
            <span>{moment(dateRange.startDate).format('Q YYYY')}</span>
          </Tooltip>
        </h3>
        <IconButton
          type="left"
          className="mr-8"
          onClick={() => {
            setDateRange({
              startDate: moment(dateRange.startDate)
                .subtract(1, 'Q')
                .startOf('quarter')
                .toDate(),
              endDate: moment(dateRange.endDate)
                .subtract(1, 'Q')
                .endOf('quarter')
                .toDate(),
            });
          }}
        />
        <IconButton
          type="right"
          onClick={() => {
            setDateRange({
              startDate: moment(dateRange.startDate)
                .add(1, 'Q')
                .startOf('quarter')
                .toDate(),
              endDate: moment(dateRange.endDate)
                .add(1, 'Q')
                .endOf('quarter')
                .toDate(),
            });
          }}
        />
      </div>

      <h4>Total: {!loading && <Money value={total} />}</h4>

      <div className="flex-col">
        {!loading &&
          mapped.map(({ _id, name, amount, ratio }) => (
            <div key={_id}>
              <h4>{name}</h4>
              <div>
                <Money value={amount} className="mr-8" />
                <span>
                  <Percent value={ratio} />
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RevenuesDistribution;
