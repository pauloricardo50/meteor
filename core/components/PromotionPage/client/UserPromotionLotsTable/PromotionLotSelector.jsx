// @flow
import React from 'react';
import { withProps, compose, withState } from 'recompose';

import { promotionOptionRemove, promotionOptionInsert } from 'core/api';
import Checkbox from '../../../Checkbox';

type PromotionLotSelectorProps = {};

export const PromotionLotSelector = ({
  promotionLotIsSelected,
  promotionLotId,
  isLoading,
  onChange,
}: PromotionLotSelectorProps) => (
  <div>
    <Checkbox
      onChange={(event) => {
        event.stopPropagation();
        onChange();
      }}
      value={promotionLotIsSelected}
      id={promotionLotId}
      disabled={isLoading}
    />
  </div>
);

export default compose(
  withState('isLoading', 'setLoading', false),
  withProps(({ promotionLotId, promotionOptions, setLoading, loanId }) => {
    const promotionOption = promotionOptions.find(({ promotionLots }) =>
      promotionLots.find(({ _id }) => _id === promotionLotId));

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
          .run({ promotionLotId, loanId })
          .finally(() => setLoading(false));
      },
    };
  }),
)(PromotionLotSelector);
