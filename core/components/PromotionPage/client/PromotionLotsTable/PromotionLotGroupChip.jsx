import React from 'react';

import { removeLotFromPromotionLotGroup } from '../../../../api/promotionLots/methodDefinitions';
import ConfirmMethod from '../../../ConfirmMethod';
import Chip from '../../../Material/Chip';

const PromotionLotGroupChip = ({
  promotionLotGroup: { id, label },
  promotionLotId,
  allowDelete,
}) => (
  <ConfirmMethod
    method={
      allowDelete
        ? () =>
            removeLotFromPromotionLotGroup.run({
              promotionLotId,
              promotionLotGroupId: id,
            })
        : () => null
    }
    buttonProps={{ type: 'close', size: 'small' }}
    noTrigger
  >
    {handleOpen => (
      <Chip
        style={{ marginRight: 8 }}
        onDelete={allowDelete ? handleOpen : null}
        label={label}
        clickable
      />
    )}
  </ConfirmMethod>
);

export default PromotionLotGroupChip;
