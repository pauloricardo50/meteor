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
} from 'core/api/constants';
import { withSmartQuery } from 'core/api/containerToolkit/index';
import { adminRevenues } from 'core/api/revenues/queries';

const getColumnOptions = displayLoan =>
  [
    displayLoan && { id: 'loan' },
    { id: 'status' },
    { id: 'date' },
    { id: 'type' },
    { id: 'sourceOrganisationLink' },
    { id: 'description' },
    { id: 'organisationsToPay' },
    { id: 'amount' },
  ]
    .filter(x => x)
    .map(({ id }) => ({ id, label: <T id={`Forms.${id}`} /> }));

export const makeMapRevenue = ({
  setOpenModifier,
  setRevenueToModify,
  displayLoan,
}) => (revenue) => {
  const {
    _id: revenueId,
    expectedAt,
    paidAt,
    approximation,
    amount,
    type,
    description,
    status,
    organisations = [],
    sourceOrganisation,
    loan,
  } = revenue;
  const date = paidAt || expectedAt;

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
      description,
      organisations.map(organisation => (
        <CollectionIconLink
          relatedDoc={{ ...organisation, collection: ORGANISATIONS_COLLECTION }}
          key={organisation._id}
        />
      )),
      {
        raw: amount,
        label: (
          <span>
            <Money value={amount} rounded={false} />
            {' '}
            {approximation ? '(Approximé)' : ''}
          </span>
        ),
      },
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
  withProps(({ revenues = [], setOpenModifier, setRevenueToModify, displayLoan }) => ({
    rows: revenues.map(makeMapRevenue({ setOpenModifier, setRevenueToModify, displayLoan })),
    columnOptions: getColumnOptions(displayLoan),
  })),
);
