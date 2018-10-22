// @flow
import React from 'react';

import LotChip from 'core/components/PromotionPage/client/ProPromotionLotsTable/LotChip';
import { addLotToPromotionLot } from 'core/api';
import DropdownMenu from 'core/components/DropdownMenu';
import T from 'core/components/Translation';
import {
  PROMOTION_LOT_STATUS,
  PROMOTION_LOT_QUERIES,
} from 'core/api/constants';
import { withProps } from 'recompose';
import ClientEventService from 'core/api/events/ClientEventService';

type PromotionLotsManagerProps = {};

const PromotionLotsManager = ({
  lots = [],
  promotionLotId,
  status,
  options,
}: PromotionLotsManagerProps) => (
  <div className="promotion-lots-manager">
    {lots.map(lot => (
      <LotChip
        key={lot._id}
        lot={lot}
        allowDelete={status === PROMOTION_LOT_STATUS.AVAILABLE}
        promotionLotId={promotionLotId}
      />
    ))}
    {status === PROMOTION_LOT_STATUS.AVAILABLE && (
      <DropdownMenu iconType="add" options={options} />
    )}
  </div>
);

export default withProps(({ allLots, promotionLotId }) => {
  let options;
  const unassignedLots = allLots.filter(lot => lot.promotionLots.length === 0);
  if (unassignedLots.length === 0) {
    options = [{ id: 'empty', label: <T id="PromotionLotsManager.empty" /> }];
  } else {
    options = unassignedLots.map(({ _id: lotId, name }) => ({
      id: lotId,
      label: name,
      onClick: () =>
        addLotToPromotionLot
          .run({ promotionLotId, lotId })
          .then(() =>
            ClientEventService.emit(PROMOTION_LOT_QUERIES.PRO_PROMOTION_LOT)),
    }));
  }

  return { options };
})(PromotionLotsManager);
