import React from 'react';
import { withProps, compose, withState } from 'recompose';
import moment from 'moment';

import T, { Money } from 'core/components/Translation';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import { ORGANISATIONS_COLLECTION } from 'core/api/constants';

const columnOptions = [
  { id: 'status' },
  { id: 'createdAt' },
  { id: 'type' },
  { id: 'description' },
  { id: 'organisations' },
  { id: 'amount' },
].map(({ id }) => ({ id, label: <T id={`Forms.${id}`} /> }));

const makeMapRevenue = ({ setOpenModifier, setRevenueToModify }) => (revenue) => {
  const {
    _id: revenueId,
    createdAt,
    approximation,
    amount,
    type,
    description,
    status,
    organisations = [],
  } = revenue;

  return {
    id: revenueId,
    columns: [
      {
        raw: status,
        label: <T id={`Forms.status.${status}`} />,
      },
      {
        raw: createdAt.getTime(),
        label: moment(createdAt).format('DD MMM YYYY'),
      },
      {
        raw: type,
        label: <T id={`Forms.type.${type}`} />,
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
            <Money value={amount} /> {approximation ? '(Approximé)' : ''}
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
  withProps(({ loan: { revenues = [] }, setOpenModifier, setRevenueToModify }) => ({
    rows: revenues.map(makeMapRevenue({ setOpenModifier, setRevenueToModify })),
    columnOptions,
  })),
);
