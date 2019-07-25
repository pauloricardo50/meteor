import React from 'react';
import { withProps, compose, withState } from 'recompose';
import moment from 'moment';

import T, { Money } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import {
  ORGANISATIONS_COLLECTION,
  REVENUES_COLLECTION,
} from 'core/api/constants';
import { withSmartQuery } from 'core/api/containerToolkit/index';
import { adminRevenues } from 'core/api/revenues/queries';

const columnOptions = [
  { id: 'status' },
  { id: 'date' },
  { id: 'type' },
  { id: 'sourceOrganisation' },
  { id: 'description' },
  { id: 'organisations' },
  { id: 'amount' },
].map(({ id }) => ({ id, label: <T id={`Forms.${id}`} /> }));

const makeMapRevenue = ({ setOpenModifier, setRevenueToModify }) => (revenue) => {
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
  } = revenue;
  const date = paidAt || expectedAt;

  return {
    id: revenueId,
    columns: [
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
      sourceOrganisation && sourceOrganisation.name,
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
    ],
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
    params: ({ loan: { _id: loanId } }) => ({ loanId }),
    dataName: 'revenues',
  }),
  withProps(({ revenues = [], setOpenModifier, setRevenueToModify }) => ({
    rows: revenues.map(makeMapRevenue({ setOpenModifier, setRevenueToModify })),
    columnOptions,
  })),
);
