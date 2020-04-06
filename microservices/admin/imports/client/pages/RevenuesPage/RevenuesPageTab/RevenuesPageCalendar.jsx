import React, { useMemo, useState } from 'react';
import moment from 'moment';

import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import {
  REVENUES_COLLECTION,
  REVENUE_STATUS,
  REVENUE_TYPES,
} from 'core/api/revenues/revenueConstants';
import employees from 'core/arrays/epotekEmployees';
import DateRangePicker from 'core/components/DateInput/DateRangePicker';
import Loading from 'core/components/Loading';
import Select from 'core/components/Select';
import MongoSelect from 'core/components/Select/MongoSelect';
import T from 'core/components/Translation';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import RevenueModifier from '../../../components/RevenuesTable/RevenueModifier';
import InsuranceBillingFilter from './InsuranceBillingFilter';
import { revenuesFilter } from './revenuePageHelpers';
import RevenuesPageCalendarColumn from './RevenuesPageCalendarColumn';

const getMonths = ({ startDate, endDate }) => {
  const clonedStartDate = moment(startDate);
  const clonedEndDate = moment(endDate);
  const result = [];
  let i = 0;
  if (clonedEndDate.isBefore(clonedStartDate)) {
    throw new Error('End date must be greater than start date.');
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

const RevenuesPageCalendar = props => {
  const [type, setType] = useState();
  const [assignee, setAssignee] = useState();
  const [referrer, setReferrer] = useState();
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

  const dateQuery = {
    $gte: months[0],
    $lte:
      months.length === 1
        ? moment(months[0])
            .endOf('month')
            .toDate()
        : months[months.length - 1],
  };
  const $or = [
    { status: REVENUE_STATUS.EXPECTED, expectedAt: dateQuery },
    { status: REVENUE_STATUS.CLOSED, paidAt: dateQuery },
  ];

  const { data: revenues, loading, error, refetch } = useStaticMeteorData(
    {
      query: REVENUES_COLLECTION,
      params: {
        $filters: {
          $or,
          type,
          'sourceOrganisationLink._id': sourceOrganisationId,
          'assigneeLink._id': assignee,
        },
        amount: 1,
        assigneeLink: 1,
        description: 1,
        expectedAt: 1,
        loan: { name: 1, borrowers: { name: 1 }, userCache: 1 },
        organisationLinks: { _id: 1, commissionRate: 1 },
        paidAt: 1,
        sourceOrganisationLink: 1,
        sourceOrganisation: { name: 1 },
        status: 1,
        type: 1,
        insurance: {
          name: 1,
          borrower: { name: 1 },
          insuranceRequest: { user: { name: 1 } },
        },
        insuranceRequest: { name: 1 },
      },
    },
    [
      revenueDateRange.startDate,
      revenueDateRange.endDate,
      type,
      sourceOrganisationId,
      assignee,
    ],
  );

  const filteredRevenues = useMemo(
    () => revenues && revenuesFilter({ revenues, referrer }),
    [revenues, referrer],
  );

  const groupedRevenues = useMemo(
    () => filteredRevenues && groupRevenues(filteredRevenues, months),
    [filteredRevenues],
  );

  const {
    data: referringOrganisations,
    loading: orgLoading,
  } = useStaticMeteorData({
    query: ORGANISATIONS_COLLECTION,
    params: { $filters: { referredUsersCount: { $gte: 1 } }, name: 1 },
  });

  const {
    data: sourceOrganisations,
    loading: sourceOrgLoading,
  } = useStaticMeteorData({
    query: ORGANISATIONS_COLLECTION,
    params: { $filters: { revenuesCount: { $gte: 1 } }, name: 1, features: 1 },
  });

  return (
    <div>
      <div className="flex mb-16 center-align">
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
        {!sourceOrgLoading && (
          <InsuranceBillingFilter
            setRevenueDateRange={setRevenueDateRange}
            sourceOrganisations={sourceOrganisations}
            sourceOrganisationId={sourceOrganisationId}
            setSourceOrganisationId={setSourceOrganisationId}
            setType={setType}
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
