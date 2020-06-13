import React from 'react';

import { PROMOTION_OPTION_STATUS } from '../../../../api/promotionOptions/promotionOptionConstants';
import PromotionLotDetail from '../PromotionLotDetail';
import RequestReservation from './RequestReservation';

const PromotionOptionDialog = ({
  promotionOption = { promotionLots: [{}] },
  promotion,
}) => {
  const { promotionLots } = promotionOption;
  const [promotionLot] = promotionLots;
  const { name } = promotionLot;
  const { status } = promotionOption;
  const canReserve = status === PROMOTION_OPTION_STATUS.INTERESTED;

  return (
    <div className="flex-col">
      <PromotionLotDetail promotionLot={promotionLot} promotion={promotion} />
      <div className="m-8" />
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
