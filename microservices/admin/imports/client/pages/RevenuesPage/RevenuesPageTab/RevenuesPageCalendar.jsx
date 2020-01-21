// @flow

import React, { useState, useMemo } from 'react';
import moment from 'moment';

import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import DateRangePicker from 'core/components/DateInput/DateRangePicker';
import Loading from 'core/components/Loading';
import T from 'core/components/Translation';
import { adminRevenues } from 'core/api/revenues/queries';
import {
  REVENUE_STATUS,
  REVENUE_TYPES,
  REVENUE_SECONDARY_TYPES,
} from 'core/api/constants';
import Select from 'core/components/Select';
import MongoSelect from 'core/components/Select/MongoSelect';
import employees from 'core/arrays/epotekEmployees';
import { adminOrganisations } from 'core/api/organisations/queries';
import RevenuesPageCalendarColumn from './RevenuesPageCalendarColumn';
import { revenuesFilter } from './revenuePageHelpers';
import RevenueModifier from '../../../components/RevenuesTable/RevenueModifier';

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
  const [secondaryType, setSecondaryType] = useState();
  const [assignee, setAssignee] = useState(null);
  const [referrer, setReferrer] = useState(null);
  const [sourceOrganisationId, setSourceOrganisationId] = useState();
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
  const [openModifier, setOpenModifier] = useState(false);
  const [revenueToModify, setRevenueToModify] = useState(null);

  const months = getMonths(revenueDateRange);

  const { data: revenues, loading, error, refetch } = useStaticMeteorData(
    {
      query: adminRevenues,
      params: {
        date: { $gte: months[0], $lte: months[months.length - 1] },
        type,
        secondaryType,
        sourceOrganisationId,
        $body: {
          status: 1,
          expectedAt: 1,
          paidAt: 1,
          amount: 1,
          type: 1,
          secondaryType: 1,
          description: 1,
          loan: { name: 1, borrowers: { name: 1 }, userCache: 1 },
          sourceOrganisationLink: 1,
          sourceOrganisation: { name: 1 },
          organisationLinks: { _id: 1, commissionRate: 1 },
        },
      },
    },
    [
      revenueDateRange.startDate,
      revenueDateRange.endDate,
      type,
      secondaryType,
      sourceOrganisationId,
    ],
  );

  const filteredRevenues = useMemo(
    () => revenues && revenuesFilter({ assignee, revenues, referrer }),
    [assignee, revenues, referrer],
  );

  const groupedRevenues = useMemo(
    () => filteredRevenues && groupRevenues(filteredRevenues, months),
    [filteredRevenues],
  );

  const {
    data: referringOrganisations,
    loading: orgLoading,
  } = useStaticMeteorData({
    query: adminOrganisations,
    params: { hasReferredUsers: true, $body: { name: 1 } },
  });

  const {
    data: sourceOrganisations,
    loading: sourceOrgLoading,
  } = useStaticMeteorData({
    query: adminOrganisations,
    params: { $body: { name: 1 } },
  });

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
        {type && type.$in && type.$in.includes(REVENUE_TYPES.INSURANCE) && (
          <MongoSelect
            value={secondaryType}
            onChange={setSecondaryType}
            options={REVENUE_SECONDARY_TYPES}
            id="secondaryType"
            label={<T id="Forms.secondaryType" />}
            className="mr-8"
          />
        )}
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
          className="mr-8"
          style={{ minWidth: 160 }}
        />
        {!orgLoading && (
          <Select
            value={referrer}
            onChange={setReferrer}
            options={[
              { id: null, label: 'Tous' },
              ...referringOrganisations
                .filter(({ _id }) => !!_id)
                .map(({ _id, name }) => ({ id: _id, label: name })),
            ]}
            label="Organisation référante"
            displayEmpty
            style={{ minWidth: 240 }}
            className="mr-8"
          />
        )}
        {!sourceOrgLoading && (
          <MongoSelect
            value={sourceOrganisationId}
            onChange={setSourceOrganisationId}
            options={sourceOrganisations
              .filter(({ _id }) => !!_id)
              .map(({ _id, name }) => ({ id: _id, label: name }))}
            id="sourceOrganisation"
            label={<T id="Forms.sourceOrganisation" />}
            className="mr-8"
            style={{ minWidth: 240 }}
          />
        )}
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="revenues-calendar">
          <RevenueModifier
            loan={revenueToModify && revenueToModify.loan}
            revenue={revenueToModify}
            open={openModifier}
            setOpen={setOpenModifier}
            onSubmitted={refetch}
          />
          {months.map(month => (
            <RevenuesPageCalendarColumn
              key={month}
              month={month}
              revenues={groupedRevenues[getMonthId(month)]}
              setRevenueToModify={setRevenueToModify}
              setOpenModifier={setOpenModifier}
              refetch={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RevenuesPageCalendar;
