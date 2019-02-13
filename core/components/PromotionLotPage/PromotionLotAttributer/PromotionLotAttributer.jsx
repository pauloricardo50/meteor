// @flow
import { Meteor } from 'meteor/meteor';
import React from 'react';

import ConfirmMethod from 'core/components/ConfirmMethod';
import T from 'core/components/Translation';
import { PROMOTION_LOT_STATUS } from 'imports/core/api/constants';
import PromotionLotAttributerContainer from './PromotionLotAttributerContainer';
import PromotionLotAttributerContent from './PromotionLotAttributerContent';

const renderLotBooking = ({
  promotionLotStatus,
  bookPromotionLot,
  promotionLotName,
  userName,
  solvency,
  canBookLot,
  isAdmin,
}) => {
  if (
    promotionLotStatus === PROMOTION_LOT_STATUS.AVAILABLE
    && (isAdmin || canBookLot)
  ) {
    return (
      <ConfirmMethod
        buttonProps={{
          outlined: true,
          primary: true,
          label: <T id="PromotionLotAttributer.book" />,
        }}
        method={bookPromotionLot}
        disabled={!isAdmin && !canBookLot}
      >
        <PromotionLotAttributerContent
          promotionLotName={promotionLotName}
          userName={userName}
          solvency={solvency}
        />
      </ConfirmMethod>
    );
  }
  return null;
};

const renderLotSelling = ({
  promotionLotStatus,
  loanId,
  attributedToId,
  sellPromotionLot,
  canSellLot,
  isAdmin,
}) => {
  if (
    promotionLotStatus === PROMOTION_LOT_STATUS.BOOKED
    && loanId === attributedToId
    && (isAdmin || canSellLot)
  ) {
    return (
      <ConfirmMethod
        buttonProps={{ outlined: true, secondary: true }}
        key="sell"
        method={sellPromotionLot}
        label={<T id="PromotionLotAttributer.sell" />}
        disabled={!isAdmin && !canSellLot}
      />
    );
  }

  return null;
};

const renderCancelLotBooking = ({
  promotionLotStatus,
  loanId,
  attributedToId,
  cancelPromotionLotBooking,
  canBookLot,
  isAdmin,
}) => {
  if (
    promotionLotStatus === PROMOTION_LOT_STATUS.BOOKED
    && loanId === attributedToId
    && (isAdmin || canBookLot)
  ) {
    return (
      <ConfirmMethod
        buttonProps={{ outlined: true, error: true }}
        key="cancel"
        method={cancelPromotionLotBooking}
        label={<T id="PromotionLotAttributer.cancelBooking" />}
        disabled={!isAdmin && !canBookLot}
      />
    );
  }

  return null;
};

type PromotionLotAttributerProps = {
  bookPromotionLot: Function,
  cancelPromotionLotBooking: Function,
  sellPromotionLot: Function,
  promotionLotStatus: String,
  loanId: String,
  attributedToId: String,
  userName: String,
  solvency: String,
  promotionLotName: String,
  canBookLot: boolean,
  canSellLot: boolean,
};

const PromotionLotAttributer = ({
  bookPromotionLot,
  cancelPromotionLotBooking,
  sellPromotionLot,
  promotionLotStatus,
  loanId,
  attributedToId,
  userName,
  solvency,
  promotionLotName,
  canBookLot,
  canSellLot,
}: PromotionLotAttributerProps) => {
  const isAdmin = Meteor.microservice === 'admin';
  return (
    <div className="promotion-lot-attributer">
      {renderLotBooking({
        promotionLotStatus,
        bookPromotionLot,
        promotionLotName,
        userName,
        solvency,
        canBookLot,
        isAdmin,
      })}
      {renderLotSelling({
        promotionLotStatus,
        loanId,
        attributedToId,
        sellPromotionLot,
        canSellLot,
        isAdmin,
      })}
      {renderCancelLotBooking({
        promotionLotStatus,
        loanId,
        attributedToId,
        cancelPromotionLotBooking,
        canBookLot,
        isAdmin,
      })}
      {promotionLotStatus === PROMOTION_LOT_STATUS.SOLD
        && loanId === attributedToId && (
        <span className="sold">
          <T id="PromotionLotAttributer.sold" />
        </span>
      )}
    </div>
  );
};

export default PromotionLotAttributerContainer(PromotionLotAttributer);
