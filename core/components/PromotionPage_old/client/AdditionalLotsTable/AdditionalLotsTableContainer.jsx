import React from 'react';
import { withState, compose, withProps } from 'recompose';
import { scroller as scroll } from 'react-scroll';

import Chip from '../../../Material/Chip';
import T from '../../../Translation';
import StatusLabel from '../../../StatusLabel';
import { toMoney } from '../../../../utils/conversionFunctions';
import {
  PROMOTION_LOTS_COLLECTION,
  PROMOTION_LOT_STATUS,
} from '../../../../api/constants';

const makeMapAdditionalLot = ({
  setAdditionalLotToModify,
  setShowDialog,
  canModifyLots,
}) => (lot) => {
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
      { raw: type, label: <T id={`Forms.type.${type}`} /> },
      { raw: value, label: toMoney(value) },
      description,
      promotionLots && promotionLots.length > 0 ? (
        promotionLots.map(({ name: promotionLotName, _id: promotionLotId }) => (
          <Chip label={promotionLotName} key={promotionLotId} />
        ))
      ) : (
        <T id="PromotionPage.AdditionalLotsTable.nonAllocated" />
      ),
    ],
    handleClick: () => {
      const isAllowedToModifyLots = canModifyLots && (!status || status === PROMOTION_LOT_STATUS.AVAILABLE);
      if (isAllowedToModifyLots) {
        setAdditionalLotToModify(lot);
        setShowDialog(true);
      }
    },
  };
};

const columnOptions = [
  { id: 'name' },
  { id: 'status' },
  { id: 'type' },
  { id: 'value', style: { whiteSpace: 'nowrap' } },
  { id: 'description' },
  { id: 'allocatedToLot' },
].map(({ id }) => ({
  id,
  label: <T id={`PromotionPage.AdditionalLotsTable.${id}`} />,
}));

const scrollToAdditionalLotsTable = () => {
  scroll.scrollTo('additional-lots-table', {
    smooth: true,
    delay: 100,
    duration: 600,
    offset: -50,
  });
};

export default compose(
  withState('showTable', 'setShowTable', false),
  withState('additionalLotToModify', 'setAdditionalLotToModify', null),
  withState('showDialog', 'setShowDialog', false),
  withProps(({
    promotion,
    setShowDialog,
    setAdditionalLotToModify,
    setShowTable,
    showTable,
    canModifyLots,
  }) => {
    const { lots = [] } = promotion;
    return {
      rows: lots.map(makeMapAdditionalLot({
        setAdditionalLotToModify,
        setShowDialog,
        canModifyLots,
      })),
      columnOptions,
      handleClick: () => {
        setShowTable(!showTable);
        scrollToAdditionalLotsTable();
      },
    };
  }),
);
