import React from 'react';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import { insertPromotionProperty, lotInsert } from '../../../../api';
import { toMoney } from '../../../../utils/conversionFunctions';
import T from '../../../Translation';
import PromotionLotsManager from './PromotionLotsManager';
import LotDocumentsManager from './LotDocumentsManager';

const makeMapPromotionLot = ({ history, promotionId, allLots }) => ({
  _id: promotionLotId,
  name,
  status,
  lots,
  promotionOptions,
  value,
  properties,
}) => ({
  id: promotionLotId,
  columns: [
    name,
    { raw: status, label: <T id={`Forms.status.${status}`} key="status" /> },
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
    <LotDocumentsManager
      property={properties && properties[0]}
      key="documents"
    />,
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
  { id: 'documents' },
  { id: 'loans' },
].map(({ id }) => ({ id, label: <T id={`PromotionPage.lots.${id}`} /> }));

export default compose(
  withRouter,
  mapProps(({ promotion: { promotionLots, _id: promotionId, lots }, history }) => ({
    rows: promotionLots.map(makeMapPromotionLot({ history, promotionId, allLots: lots })),
    columnOptions,
    addProperty: property =>
      insertPromotionProperty.run({ promotionId, property }),
    addLot: lot => lotInsert.run({ promotionId, lot }),
  })),
);
