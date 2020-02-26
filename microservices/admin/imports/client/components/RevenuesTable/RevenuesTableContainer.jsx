import React from 'react';
import { withProps, compose, withState } from 'recompose';
import moment from 'moment';

import T, { Money } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import {
  ORGANISATIONS_COLLECTION,
  REVENUES_COLLECTION,
  LOANS_COLLECTION,
  REVENUE_STATUS,
} from 'core/api/constants';
import { withSmartQuery } from 'core/api/containerToolkit/index';
import { adminRevenues } from 'core/api/revenues/queries';
import RevenueConsolidator from './RevenueConsolidator';

const now = moment();
const formatDateTime = (date, status) => {
  const momentDate = moment(date);
  const text = date ? momentDate.format("D MMM 'YY") : '-';

  if (momentDate.isBefore(now) && status !== REVENUE_STATUS.CLOSED) {
    return (
      <span className="error-box" style={{ whiteSpace: 'nowrap' }}>
        {text}
      </span>
    );
  }

  return text;
};

const getColumnOptions = ({
  displayLoan,
  displayActions,
  displayOrganisationsToPay,
}) =>
  [
    displayLoan && { id: 'loan' },
    { id: 'revenueStatus' },
    { id: 'date' },
    { id: 'type' },
    { id: 'description' },
    { id: 'sourceOrganisationLink' },
    displayOrganisationsToPay && { id: 'organisationsToPay' },
    { id: 'amount', align: 'right', style: { whiteSpace: 'nowrap' } },
    displayActions && { id: 'actions' },
  ]
    .filter(x => x)
    .map(i => ({ ...i, label: <T id={`Forms.${i.id}`} /> }));

export const makeMapRevenue = ({
  setOpenModifier,
  setRevenueToModify,
  displayLoan,
  displayActions,
  displayOrganisationsToPay,
}) => revenue => {
  const {
    _id: revenueId,
    expectedAt,
    paidAt,
    amount,
    type,
    secondaryType,
    description,
    status,
    organisations = [],
    sourceOrganisation,
    loan,
  } = revenue;
  const date = status === REVENUE_STATUS.CLOSED ? paidAt : expectedAt;

  return {
    id: revenueId,
    organisations,
    amount,
    columns: [
      displayLoan
        ? {
            raw: loan && loan.name,
            label: loan && (
              <CollectionIconLink
                relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
              />
            ),
          }
        : null,
      {
        raw: status,
        label: <StatusLabel status={status} collection={REVENUES_COLLECTION} />,
      },
      {
        raw: date && date.getTime(),
        label: date && formatDateTime(date, status),
      },
      {
        raw: type,
        label: (
          <span>
            <T id={`Forms.type.${type}`} />
            {secondaryType && (
              <span>
                -
                <T id={`Forms.secondaryType.${secondaryType}`} />
              </span>
            )}
          </span>
        ),
      },
      description,
      {
        raw: sourceOrganisation && sourceOrganisation.name,
        label: (
          <CollectionIconLink
            relatedDoc={{
              ...sourceOrganisation,
              collection: ORGANISATIONS_COLLECTION,
            }}
          />
        ),
      },
      displayOrganisationsToPay
        ? organisations.map(organisation => (
            <CollectionIconLink
              relatedDoc={{
                ...organisation,
                collection: ORGANISATIONS_COLLECTION,
              }}
              key={organisation._id}
            />
          ))
        : null,
      {
        raw: amount,
        label: (
          <b>
            <Money value={amount} rounded={false} />
          </b>
        ),
      },
      displayActions ? (
        <RevenueConsolidator revenue={revenue} key="revenue-consolidator" />
      ) : null,
    ].filter(cell => cell !== null),
    handleClick: () => {
      setRevenueToModify(revenue);
      setOpenModifier(true);
    },
  };
};

export default compose(
  withState('openModifier', 'setOpenModifier', false),
  withState('revenueToModify', 'setRevenueToModify', null),
  withSmartQuery({
    query: adminRevenues,
    params: ({ filterRevenues, ...props }) => ({
      ...filterRevenues(props),
      $body: {
        amount: 1,
        assigneeLink: 1,
        description: 1,
        expectedAt: 1,
        loan: {
          name: 1,
          borrowers: { name: 1 },
          user: { name: 1 },
          userCache: 1,
          assigneeLinks: 1,
        },
        paidAt: 1,
        secondaryType: 1,
        sourceOrganisationLink: 1,
        sourceOrganisation: { name: 1 },
        status: 1,
        type: 1,
        organisationLinks: 1,
        organisations: { name: 1 },
      },
    }),
    dataName: 'revenues',
  }),
  withProps(({ revenues, postFilter }) => {
    if (postFilter) {
      return { revenues: postFilter(revenues) };
    }
  }),
  withProps(
    ({
      revenues = [],
      setOpenModifier,
      setRevenueToModify,
      displayLoan,
      displayActions,
      displayOrganisationsToPay,
    }) => ({
      rows: revenues.map(
        makeMapRevenue({
          setOpenModifier,
          setRevenueToModify,
          displayLoan,
          displayActions,
          displayOrganisationsToPay,
        }),
      ),
      columnOptions: getColumnOptions({
        displayLoan,
        displayActions,
        displayOrganisationsToPay,
      }),
    }),
  ),
);
