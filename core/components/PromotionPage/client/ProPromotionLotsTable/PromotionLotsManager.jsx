// @flow
import React from 'react';

import { removeLotLink, addLotToPromotionLot } from '../../../../api';
import Chip from '../../../Material/Chip';
import Tooltip from '../../../Material/Tooltip';
import DropdownMenu from '../../../DropdownMenu';
import T from '../../../Translation';

type PromotionLotsManagerProps = {};

const PromotionLotsManager = ({
  lots = [],
  promotionLotId,
  allLots,
}: PromotionLotsManagerProps) => {
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

  return (
    <div className="promotion-lots-manager">
      {lots.map(({ _id, name, type }) => (
        <Tooltip title={<T id={`Forms.type.${type}`} />} key={_id}>
          <Chip
            onDelete={() => removeLotLink.run({ promotionLotId, lotId: _id })}
            label={name}
          />
        </Tooltip>
      ))}
      <DropdownMenu iconType="add" options={options} />
    </div>
  );
};

export default PromotionLotsManager;
