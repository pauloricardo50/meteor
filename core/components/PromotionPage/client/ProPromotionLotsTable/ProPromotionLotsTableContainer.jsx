import React from 'react';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import { insertPromotionProperty, lotInsert } from '../../../../api';
import { toMoney } from '../../../../utils/conversionFunctions';
import T from '../../../Translation';
import PromotionLotsManager from './PromotionLotsManager';

const makeMapPromotionLot = (history, promotionId, allLots) => ({
  _id: promotionLotId,
  name,
  status,
  lots,
  promotionOptions,
  value,
}) => ({
  id: promotionLotId,
  columns: [
    name,
    status,
    { raw: value, label: toMoney(value) },
    {
      raw: lots && lots.length,
      label: (
        <PromotionLotsManager
          key="lots"
          lots={lots}
          promotionLotId={promotionLotId}
          allLots={allLots}
        />
      ),
    },
    promotionOptions.length,
  ],
  // handleClick: () =>
  //   history.push(createRoute('/promotions/:promotionId/:promotionLotId', {
  //     promotionId,
  //     promotionLotId,
  //   })),
});

const columnOptions = [
  { id: 'name' },
  { id: 'status' },
  { id: 'totalValue' },
  { id: 'lots' },
  { id: 'loans' },
].map(({ id }) => ({ id, label: <T id={`PromotionPage.lots.${id}`} /> }));

export default compose(
  withRouter,
  mapProps(({ promotion: { promotionLots, _id: promotionId, lots }, history }) => ({
    rows: promotionLots.map(makeMapPromotionLot(history, promotionId, lots)),
    columnOptions,
    addProperty: property =>
      insertPromotionProperty.run({ promotionId, property }),
    addLot: lot => lotInsert.run({ promotionId, lot }),
  })),
);
