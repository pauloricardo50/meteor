//
import React from 'react';

import { removeLotLink } from '../../../../api';
import T from '../../../Translation';
import Chip from '../../../Material/Chip';
import Tooltip from '../../../Material/Tooltip';
import { toMoney } from '../../../../utils/conversionFunctions';

const LotChip = ({
  lot: { type, _id, name, value },
  promotionLotId,
  allowDelete,
}) => (
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
      onDelete={
        allowDelete
          ? () => removeLotLink.run({ promotionLotId, lotId: _id })
          : null
      }
      label={name}
      clickable
    />
  </Tooltip>
);

export default LotChip;
