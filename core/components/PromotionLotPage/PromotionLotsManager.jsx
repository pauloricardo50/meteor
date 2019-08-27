// @flow
import React from 'react';

import LotChip from 'core/components/PromotionPage/client/ProPromotionLotsTable/LotChip';
import { addLotToPromotionLot } from 'core/api';
import DropdownMenu from 'core/components/DropdownMenu';
import T from 'core/components/Translation';
import { PROMOTION_LOT_STATUS } from 'core/api/constants';
import { withProps } from 'recompose';

type PromotionLotsManagerProps = {};

const PromotionLotsManager = ({
  lots = [],
  promotionLotId,
  status,
  options,
  canModifyLots,
}: PromotionLotsManagerProps) => {
  const allowEdit = canModifyLots && status === PROMOTION_LOT_STATUS.AVAILABLE;

  if (!allowEdit && lots.length === 0) {
    // Don't display an empty title for users who can't even add a new lot
    return null;
  }

  return (
    <div className="promotion-lots-manager">
      {lots.map(lot => (
        <LotChip
          key={lot._id}
          lot={lot}
          allowDelete={allowEdit}
          promotionLotId={promotionLotId}
        />
      ))}
      {allowEdit && <DropdownMenu iconType="add" options={options} />}
    </div>
  );
};

export default withProps(({ allLots = [], promotionLotId }) => {
  let options;
  const unassignedLots = allLots.filter(lot => lot.promotionLots.length === 0);
  if (unassignedLots.length === 0) {
    options = [{ id: 'empty', label: <T id="PromotionLotsManager.empty" /> }];
  } else {
    options = unassignedLots.map(({ _id: lotId, name }) => ({
      id: lotId,
      label: name,
      onClick: () => addLotToPromotionLot.run({ promotionLotId, lotId }),
    }));
  }

  return { options };
})(PromotionLotsManager);
