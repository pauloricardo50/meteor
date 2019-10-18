// @flow
import React from 'react';

import { promotionOptionRemove } from 'core/api/methods';
import { PROMOTION_STATUS, PROMOTION_LOT_STATUS } from 'core/api/constants';
import ClickToEditField from '../../../ClickToEditField';
import T from '../../../Translation';
import Checkbox from '../../../Checkbox';
import PromotionLotDetail from '../PromotionLotDetail';
import { isLotAttributedToMe } from '../PromotionLotsTable/PromotionLotsTableContainer';

type PromotionOptionDialogProps = {};

const PromotionOptionDialog = ({
  open,
  promotionOption = { promotionLots: [{}] },
  handleClose,
  promotion,
  setCustom,
}: PromotionOptionDialogProps) => {
  const { promotionLots, custom, attributedToMe } = promotionOption;
  const promotionLot = promotionLots[0];

  return (
    <PromotionLotDetail promotionLot={promotionLot} promotion={promotion}>
      <section className="flex center-align">
        <Checkbox
          label={<T id="PromotionOptionDialog.interested" />}
          value
          disabled={
            isLotAttributedToMe({
              promotionOptions: [promotionOption],
              promotionLotId: promotionLot._id,
            }) || promotionLot.status !== PROMOTION_LOT_STATUS.AVAILABLE
          }
          onChange={() =>
            promotionOptionRemove
              .run({ promotionOptionId: promotionOption._id })
              .then(handleClose)
          }
        />
      </section>

      <section>
        <h4>
          <T id="Forms.promotionOptions.custom" />
        </h4>
        <ClickToEditField
          placeholder={<T id="Forms.promotionOptions.custom.placeholder" />}
          value={custom}
          onSubmit={value => setCustom(promotionOption._id, value)}
          className="custom-edit"
          allowEditing={
            !attributedToMe && promotion.status === PROMOTION_STATUS.OPEN
          }
        />
      </section>
    </PromotionLotDetail>
  );
};

export default PromotionOptionDialog;
