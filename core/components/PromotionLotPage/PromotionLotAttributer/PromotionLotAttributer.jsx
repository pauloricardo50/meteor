// @flow
import React from 'react';

import ConfirmMethod from 'core/components/ConfirmMethod';
import T from 'core/components/Translation';
import { PROMOTION_LOT_STATUS } from 'imports/core/api/constants';
import PromotionLotAttributerContainer from './PromotionLotAttributerContainer';
import PromotionLotAttributerContent from './PromotionLotAttributerContent';

type PromotionLotAttributerProps = {};

const PromotionLotAttributer = ({
  bookPromotionLot,
  cancelPromotionLotBooking,
  sellPromotionLot,
  isLoading,
  promotionLotStatus,
  loanId,
  attributedToId,
  userName,
  lots,
  solvency,
  promotionLotName,
  canModify,
}: PromotionLotAttributerProps) => (
  <div className="promotion-lot-attributer">
    {promotionLotStatus === PROMOTION_LOT_STATUS.AVAILABLE && (
      <ConfirmMethod
        buttonProps={{
          outlined: true,
          primary: true,
          label: <T id="PromotionLotAttributer.book" />,
        }}
        method={bookPromotionLot}
        disabled={!canModify}
      >
        <PromotionLotAttributerContent
          promotionLotName={promotionLotName}
          userName={userName}
          solvency={solvency}
        />
      </ConfirmMethod>
    )}
    {promotionLotStatus === PROMOTION_LOT_STATUS.BOOKED
      && loanId === attributedToId && (
        <>
          <ConfirmMethod
            buttonProps={{ outlined: true, secondary: true }}
            key="sell"
            method={sellPromotionLot}
            label={<T id="PromotionLotAttributer.sell" />}
            disabled={!canModify}
          />
          <ConfirmMethod
            buttonProps={{ outlined: true, error: true }}
            key="cancel"
            method={cancelPromotionLotBooking}
            label={<T id="PromotionLotAttributer.cancelBooking" />}
            disabled={!canModify}
          />
        </>
    )}
    {promotionLotStatus === PROMOTION_LOT_STATUS.SOLD
      && loanId === attributedToId && (
      <span className="sold">
        <T id="PromotionLotAttributer.sold" />
      </span>
    )}
  </div>
);

export default PromotionLotAttributerContainer(PromotionLotAttributer);
