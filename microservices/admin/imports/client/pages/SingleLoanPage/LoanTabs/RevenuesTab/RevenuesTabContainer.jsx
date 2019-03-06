import React from 'react';
import { withProps, compose, withState } from 'recompose';
import moment from 'moment';

import T, { Money } from 'core/components/Translation';

const columnOptions = [
  { id: 'status' },
  { id: 'createdAt' },
  { id: 'type' },
  { id: 'description' },
  { id: 'approximation' },
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
  } = revenue;

  return {
    id: revenueId,
    columns: [
      {
        raw: status,
        label: <T id={`Forms.status.${status}`} />,
      },
      {
        raw: createdAt,
        label: moment(createdAt).format('DD MMM YYYY'),
      },
      {
        raw: type,
        label: <T id={`Forms.type.${type}`} />,
      },
      description,
      {
        raw: approximation,
        label: approximation ? 'Approximé' : 'Exact',
      },
      {
        raw: amount,
        label: <Money value={amount} />,
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
