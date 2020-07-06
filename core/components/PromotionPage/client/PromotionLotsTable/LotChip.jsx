import React from 'react';

import { removeLotLink } from '../../../../api/promotionLots/methodDefinitions';
import { toMoney } from '../../../../utils/conversionFunctions';
import ConfirmMethod from '../../../ConfirmMethod';
import Chip from '../../../Material/Chip';
import Tooltip from '../../../Material/Tooltip';
import T from '../../../Translation';

const LotChip = ({
  lot: { type, _id, name, value },
  promotionLotId,
  allowDelete,
}) => (
  <ConfirmMethod
    method={
      allowDelete
        ? () => removeLotLink.run({ promotionLotId, lotId: _id })
        : () => null
    }
    buttonProps={{ type: 'close', size: 'small' }}
    noTrigger
  >
    {handleOpen => (
      <Tooltip
        title={
          <>
            <T id={`Forms.type.${type}`} />
            {value > 0 && ` - CHF ${toMoney(value)}`}
          </>
        }
        key={_id}
      >
        <Chip
          style={{ marginRight: 8 }}
          onDelete={allowDelete ? handleOpen : null}
          label={name}
          clickable
        />
      </Tooltip>
    )}
  </ConfirmMethod>
);

export default LotChip;
