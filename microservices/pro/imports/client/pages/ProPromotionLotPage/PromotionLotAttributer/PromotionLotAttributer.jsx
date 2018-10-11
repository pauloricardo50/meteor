// @flow
import React from 'react';

import ConfirmMethod from 'core/components/ConfirmMethod';
import T from 'core/components/Translation';
import { PROMOTION_LOT_STATUS } from 'imports/core/api/constants';
import PromotionLotAttributerContainer from './PromotionLotAttributerContainer';

type PromotionLotAttributerProps = {};

const PromotionLotAttributer = ({
  bookPromotionLot,
  cancelPromotionLotBooking,
  sellPromotionLot,
  isLoading,
  promotionLotStatus,
  loanId,
  attributedToId,
}: PromotionLotAttributerProps) => (
  <div className="promotion-lot-attributer">
    {promotionLotStatus === PROMOTION_LOT_STATUS.AVAILABLE && (
      <ConfirmMethod
        buttonProps={{ outlined: true, primary: true }}
        method={bookPromotionLot}
      >
        <T id="PromotionLotAttributer.book" />
      </ConfirmMethod>
    )}
    {promotionLotStatus === PROMOTION_LOT_STATUS.BOOKED
      && loanId === attributedToId && (
        <>
          <ConfirmMethod
            buttonProps={{ outlined: true, success: true }}
            key="sell"
            method={sellPromotionLot}
          >
            <T id="PromotionLotAttributer.sell" />
          </ConfirmMethod>
          <ConfirmMethod
            buttonProps={{ outlined: true, error: true }}
            key="cancel"
            method={cancelPromotionLotBooking}
          >
            <T id="PromotionLotAttributer.cancelBooking" />
          </ConfirmMethod>
        </>
    )}
  </div>
);

export default PromotionLotAttributerContainer(PromotionLotAttributer);
