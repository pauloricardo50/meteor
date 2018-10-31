// @flow
import React from 'react';

import { removeLotLink } from '../../../../api';
import T from '../../../Translation';
import Chip from '../../../Material/Chip';
import Tooltip from '../../../Material/Tooltip';

type LotChipProps = {};

const LotChip = ({
  lot: { type, _id, name },
  promotionLotId,
  allowDelete,
}: LotChipProps) => (
  <Tooltip title={<T id={`Forms.type.${type}`} />} key={_id}>
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
