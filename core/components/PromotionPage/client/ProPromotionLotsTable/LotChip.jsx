// @flow
import React from 'react';

import ClientEventService from 'core/api/events/ClientEventService';
import { PROMOTION_LOT_QUERIES } from 'core/api/constants';
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
          ? () =>
            removeLotLink
              .run({ promotionLotId, lotId: _id })
              .then(() =>
                ClientEventService.emit(PROMOTION_LOT_QUERIES.PRO_PROMOTION_LOT))
          : null
      }
      label={name}
    />
  </Tooltip>
);

export default LotChip;
