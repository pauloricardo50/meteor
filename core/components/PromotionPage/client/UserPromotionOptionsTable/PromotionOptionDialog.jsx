// @flow
import React from 'react';

import { promotionOptionRemove } from 'core/api/methods';
import { PROMOTION_LOT_STATUS } from 'core/api/constants';
import T from '../../../Translation';
import Checkbox from '../../../Checkbox';
import PromotionLotDetail from '../PromotionLotDetail';
import RequestReservation from './RequestReservation';

type PromotionOptionDialogProps = {};

const PromotionOptionDialog = ({
  open,
  promotionOption = { promotionLots: [{}] },
  handleClose,
  promotion,
}: PromotionOptionDialogProps) => {
  const { promotionLots } = promotionOption;
  const [promotionLot] = promotionLots;
  const { name } = promotionLot;
  const { status, _id: promotionOptionId } = promotionOption;

  return (
    <div className="flex-col">
      <PromotionLotDetail promotionLot={promotionLot} promotion={promotion}>
        <section className="flex center-align">
          <Checkbox
            label={<T id="PromotionOptionDialog.interested" />}
            value
            onChange={() =>
              promotionOptionRemove
                .run({ promotionOptionId: promotionOption._id })
                .then(handleClose)
            }
          />
        </section>
      </PromotionLotDetail>
      <RequestReservation
        promotionOptionId={promotionOptionId}
        promotionLotName={name}
        status={status}
      />
    </div>
  );
};

export default PromotionOptionDialog;
