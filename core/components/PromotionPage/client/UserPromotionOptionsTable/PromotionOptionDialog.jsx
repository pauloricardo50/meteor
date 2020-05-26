import React from 'react';

import { promotionOptionRemove } from '../../../../api/promotionOptions/methodDefinitions';
import { PROMOTION_OPTION_STATUS } from '../../../../api/promotionOptions/promotionOptionConstants';
import Checkbox from '../../../Checkbox';
import T from '../../../Translation';
import PromotionLotDetail from '../PromotionLotDetail';
import RequestReservation from './RequestReservation';

const PromotionOptionDialog = ({
  promotionOption = { promotionLots: [{}] },
  handleClose,
  promotion,
}) => {
  const { promotionLots } = promotionOption;
  const [promotionLot] = promotionLots;
  const { name } = promotionLot;
  const { status } = promotionOption;
  const canReserve = status === PROMOTION_OPTION_STATUS.INTERESTED;

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
      {canReserve && (
        <RequestReservation
          promotionOption={promotionOption}
          promotionLotName={name}
          status={status}
        />
      )}
    </div>
  );
};

export default PromotionOptionDialog;
