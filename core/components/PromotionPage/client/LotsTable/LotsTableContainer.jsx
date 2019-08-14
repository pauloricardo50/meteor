import React from 'react';
import { compose, withProps } from 'recompose';

import withHider from 'core/containers/withHider';
import T, { Money } from '../../../Translation';
import Chip from '../../../Material/Chip';
import StatusLabel from '../../../StatusLabel';
import {
  PROMOTION_LOTS_COLLECTION,
  PROMOTION_LOT_STATUS,
} from '../../../../api/constants';

const columnOptions = [
  { id: 'name' },
  { id: 'status' },
  {
    id: 'value',
    style: { whiteSpace: 'nowrap' },
    align: 'right',
    format: value => (
      <b>
        <Money value={value} />
      </b>
    ),
  },
  { id: 'allocatedToLot' },
  { id: 'type' },
  { id: 'description' },
].map(column => ({
  ...column,
  label: <T id={`PromotionPage.AdditionalLotsTable.${column.id}`} />,
}));

const makeMapAdditionalLot = ({ canModifyLots }) => (lot) => {
  const { _id, name, type, value, description, promotionLots, status } = lot;
  return {
    id: _id,
    columns: [
      name,
      {
        raw: status,
        label: status && (
          <StatusLabel collection={PROMOTION_LOTS_COLLECTION} status={status} />
        ),
      },
      value,
      promotionLots && promotionLots.length > 0 ? (
        promotionLots.map(({ name: promotionLotName, _id: promotionLotId }) => (
          <Chip label={promotionLotName} key={promotionLotId} />
        ))
      ) : (
        <T id="PromotionPage.AdditionalLotsTable.nonAllocated" />
      ),
      { raw: type, label: <T id={`Forms.type.${type}`} /> },
      description,
    ],
    handleClick: () => {
      const isAllowedToModifyLots = canModifyLots && (!status || status === PROMOTION_LOT_STATUS.AVAILABLE);
      if (isAllowedToModifyLots) {
        console.log('modify!');
      }
    },
  };
};

export default compose(
  withHider(hide => ({
    style: { alignSelf: 'center' },
    label: hide ? 'Afficher lots annexes' : 'Masquer lots annexes',
    primary: true,
  })),
  withProps(({ promotion: { lots }, canModifyLots }) => ({
    rows: lots.map(makeMapAdditionalLot({ canModifyLots })),
    columnOptions,
  })),
);
