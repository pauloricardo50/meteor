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

const getColumnOptions = ({ displayLoan, displayActions }) =>
  [
    displayLoan && { id: 'loan' },
    { id: 'status' },
    { id: 'date' },
    { id: 'type' },
    { id: 'description' },
    { id: 'sourceOrganisationLink' },
    { id: 'organisationsToPay' },
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
}) => (revenue) => {
  const {
    _id: revenueId,
    expectedAt,
    paidAt,
    amount,
    type,
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
        label: date && moment(date).format('DD MMM YYYY'),
      },
      {
        raw: type,
        label: <T id={`Forms.type.${type}`} />,
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
      organisations.map(organisation => (
        <CollectionIconLink
          relatedDoc={{ ...organisation, collection: ORGANISATIONS_COLLECTION }}
          key={organisation._id}
        />
      )),
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
    params: ({ filterRevenues, ...props }) => filterRevenues(props),
    dataName: 'revenues',
  }),
  withProps(({
    revenues = [],
    setOpenModifier,
    setRevenueToModify,
    displayLoan,
    displayActions,
  }) => ({
    rows: revenues.map(makeMapRevenue({
      setOpenModifier,
      setRevenueToModify,
      displayLoan,
      displayActions,
    })),
    columnOptions: getColumnOptions({ displayLoan, displayActions }),
  })),
);
