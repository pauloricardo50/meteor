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
  permissions,
  bookPromotionLot,
  promotionLotName,
  userName,
  solvency,
}) => {
  if (
    promotionLotStatus === PROMOTION_LOT_STATUS.AVAILABLE
    && (Meteor.microservice === 'admin' || permissions.canBookLots)
  ) {
    return (
      <ConfirmMethod
        buttonProps={{
          outlined: true,
          primary: true,
          label: <T id="PromotionLotAttributer.book" />,
        }}
        method={bookPromotionLot}
        disabled={Meteor.microservice !== 'admin' && !permissions.canBookLots}
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
  permissions,
  sellPromotionLot,
}) => {
  if (
    promotionLotStatus === PROMOTION_LOT_STATUS.BOOKED
    && loanId === attributedToId
    && (Meteor.microservice === 'admin' || permissions.canSellLots)
  ) {
    return (
      <ConfirmMethod
        buttonProps={{ outlined: true, secondary: true }}
        key="sell"
        method={sellPromotionLot}
        label={<T id="PromotionLotAttributer.sell" />}
        disabled={Meteor.microservice !== 'admin' && !permissions.canSellLots}
      />
    );
  }

  return null;
};

const renderCancelLotBooking = ({
  promotionLotStatus,
  loanId,
  attributedToId,
  permissions,
  cancelPromotionLotBooking,
}) => {
  if (
    promotionLotStatus === PROMOTION_LOT_STATUS.BOOKED
    && loanId === attributedToId
    && (Meteor.microservice === 'admin' || permissions.canBookLots)
  ) {
    return (
      <ConfirmMethod
        buttonProps={{ outlined: true, error: true }}
        key="cancel"
        method={cancelPromotionLotBooking}
        label={<T id="PromotionLotAttributer.cancelBooking" />}
        disabled={Meteor.microservice !== 'admin' && !permissions.canBookLots}
      />
    );
  }

  return null;
};

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
  permissions = {},
}: PromotionLotAttributerProps) => (
  <div className="promotion-lot-attributer">
    {renderLotBooking({
      promotionLotStatus,
      permissions,
      bookPromotionLot,
      promotionLotName,
      userName,
      solvency,
    })}
    {renderLotSelling({
      promotionLotStatus,
      loanId,
      attributedToId,
      permissions,
      sellPromotionLot,
    })}
    {renderCancelLotBooking({
      promotionLotStatus,
      loanId,
      attributedToId,
      permissions,
      cancelPromotionLotBooking,
    })}
    {promotionLotStatus === PROMOTION_LOT_STATUS.SOLD
      && loanId === attributedToId && (
      <span className="sold">
        <T id="PromotionLotAttributer.sold" />
      </span>
    )}
  </div>
);

export default PromotionLotAttributerContainer(PromotionLotAttributer);
