import React from 'react';
import { compose, withProps, withState } from 'recompose';

import {
  promotionOptionInsert,
  promotionOptionRemove,
} from '../../../../api/promotionOptions/methodDefinitions';
import Checkbox from '../../../Checkbox';

export const PromotionLotSelector = ({
  promotionLotIsSelected,
  promotionLotId,
  isLoading,
  onChange,
  disabled,
}) => (
  <Checkbox
    onChange={event => {
      event.preventDefault();
      event.stopPropagation();
      onChange();
    }}
    value={promotionLotIsSelected}
    id={promotionLotId}
    disabled={isLoading || (!promotionLotIsSelected && disabled)}
  />
);

export default compose(
  withState('isLoading', 'setLoading', false),
  withProps(
    ({ promotionLotId, promotionOptions, setLoading, loanId, promotionId }) => {
      const promotionOption = promotionOptions.find(({ promotionLots }) =>
        promotionLots.find(({ _id }) => _id === promotionLotId),
      );

      return {
        promotionLotIsSelected: !!promotionOption,
        onChange: () => {
          setLoading(true);
          if (promotionOption) {
            return promotionOptionRemove
              .run({ promotionOptionId: promotionOption._id })
              .finally(() => setLoading(false));
          }

          return promotionOptionInsert
            .run({ promotionLotId, loanId, promotionId })
            .finally(() => setLoading(false));
        },
      };
    },
  ),
)(PromotionLotSelector);
