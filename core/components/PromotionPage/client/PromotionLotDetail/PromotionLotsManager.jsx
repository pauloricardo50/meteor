import React from 'react';

import { addLotToPromotionLot } from '../../../../api/promotionLots/methodDefinitions';
import { lots as lotsQuery } from '../../../../api/lots/queries';
import { PROMOTION_LOT_STATUS } from '../../../../api/promotionLots/promotionLotConstants';
import useMeteorData from '../../../../hooks/useMeteorData';
import DropdownMenu from '../../../DropdownMenu';
import T from '../../../Translation';
import LotChip from '../PromotionLotsTable/LotChip';
import { usePromotion } from '../PromotionPageContext';
import Box from '../../../Box';

const getOptions = (allLots, promotionLotId) => {
  const unassignedLots = allLots.filter(lot => lot.promotionLots.length === 0);
  if (unassignedLots.length === 0) {
    return [{ id: 'empty', label: <T id="PromotionLotsManager.empty" /> }];
  }
  return unassignedLots.map(({ _id: lotId, name }) => ({
    id: lotId,
    label: name,
    onClick: () => addLotToPromotionLot.run({ promotionLotId, lotId }),
  }));
};

const PromotionLotsManager = ({
  lots = [],
  promotionId,
  promotionLotId,
  status,
}) => {
  const {
    permissions: { canModifyLots },
  } = usePromotion();
  const allowEdit = canModifyLots && status === PROMOTION_LOT_STATUS.AVAILABLE;
  const { data: allLots = [] } = useMeteorData({
    query: allowEdit && lotsQuery,
    params: {
      promotionId,
      $body: { name: 1, promotionLots: { _id: 1 } },
    },
  });

  if (!allowEdit && lots.length === 0) {
    // Don't display an empty title for users who can't even add a new lot
    return null;
  }

  return (
    <Box>
      <h4>
        <T id="PromotionLotPage.manageLot" />
      </h4>
      <div className="promotion-lots-manager">
        {lots.map(lot => (
          <LotChip
            key={lot._id}
            lot={lot}
            allowDelete={allowEdit}
            promotionLotId={promotionLotId}
          />
        ))}
        {allowEdit && (
          <DropdownMenu
            iconType="add"
            options={getOptions(allLots, promotionLotId)}
          />
        )}
      </div>
    </Box>
  );
};

export default PromotionLotsManager;
