import React from 'react';
import { injectIntl } from 'react-intl';
import { scroller } from 'react-scroll';
import { compose, withProps } from 'recompose';

import withHider from 'core/containers/withHider';

import { PROMOTION_LOTS_COLLECTION } from '../../../../api/promotionLots/promotionLotConstants';
import Chip from '../../../Material/Chip';
import StatusLabel from '../../../StatusLabel';
import T, { Money } from '../../../Translation';

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

const makeMapAdditionalLot = ({ canModifyLots }) => lot => {
  const { _id, name, type, value, description, promotionLots, status } = lot;
  return {
    id: _id,
    doc: {
      ...lot,
      promotionLot:
        lot.promotionLots.length > 0 ? lot.promotionLots[0]._id : null,
    },
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
  };
};

const scrollToAdditionalLotsTable = () => {
  scroller.scrollTo('additional-lots-table', {
    smooth: true,
    delay: 200,
    duration: 500,
    offset: -50,
  });
};

export default compose(
  withHider(hide => ({
    style: { alignSelf: 'center' },
    label: hide ? 'Afficher lots annexes' : 'Masquer lots annexes',
    primary: true,
    callback: nextHide => {
      if (!nextHide) {
        scrollToAdditionalLotsTable();
      }
    },
  })),
  withProps(({ promotion: { lots = [] }, canModifyLots }) => ({
    rows: lots.map(makeMapAdditionalLot({ canModifyLots })),
    columnOptions,
  })),
  injectIntl,
);
