// @flow
import { Meteor } from 'meteor/meteor';
import React from 'react';

import ConfirmMethod from '../../ConfirmMethod';
import T from '../../Translation';
import { PROMOTION_LOT_STATUS } from '../../../api/constants';
import PromotionLotAttributerContainer from './PromotionLotAttributerContainer';
import PromotionLotAttributerContent from './PromotionLotAttributerContent';

const lotBooking = ({
  bookPromotionLot,
  promotionLotName,
  userName,
  solvency,
  canBookLot,
  isAdmin,
}) => {
  const isAllowedToBookLot = isAdmin || canBookLot;

  if (isAllowedToBookLot) {
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

const lotSelling = ({
  loanId,
  attributedToId,
  sellPromotionLot,
  canSellLot,
  isAdmin,
}) => {
  const isAllowedToSellLot = loanId === attributedToId && (isAdmin || canSellLot);

  if (isAllowedToSellLot) {
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

const cancelLotBooking = ({
  loanId,
  attributedToId,
  cancelPromotionLotBooking,
  canBookLot,
  isAdmin,
}) => {
  const isAllowedToCancelLotBooking = loanId === attributedToId && (isAdmin || canBookLot);

  if (isAllowedToCancelLotBooking) {
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

const lotSold = ({ loanId, attributedToId }) =>
  loanId === attributedToId && (
    <span className="sold">
      <T id="PromotionLotAttributer.sold" />
    </span>
  );

const selectComponent = (props) => {
  const { promotionLotStatus } = props;

  switch (promotionLotStatus) {
  case PROMOTION_LOT_STATUS.AVAILABLE:
    return lotBooking(props);
  case PROMOTION_LOT_STATUS.BOOKED:
    return [lotSelling(props), cancelLotBooking(props)];
  case PROMOTION_LOT_STATUS.SOLD:
    return lotSold(props);
  default:
    return null;
  }
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

const PromotionLotAttributer = (props: PromotionLotAttributerProps) => {
  const isAdmin = Meteor.microservice === 'admin';
  return (
    <div className="promotion-lot-attributer">
      {selectComponent({ ...props, isAdmin })}
    </div>
  );
};

export default PromotionLotAttributerContainer(PromotionLotAttributer);
