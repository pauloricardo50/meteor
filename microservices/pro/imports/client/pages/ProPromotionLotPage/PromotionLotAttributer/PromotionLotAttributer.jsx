// @flow
import React from 'react';

import ConfirmMethod from 'core/components/ConfirmMethod';
import T from 'core/components/Translation';
import { PROMOTION_LOT_STATUS } from 'imports/core/api/constants';
import { spawn } from 'child_process';
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
  userName,
  lots,
  solvency,
  solvencyClassName,
  promotionLotName,
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
      >
        <div className="book-client-infos">
          <p className="bold">Attribuer {promotionLotName} à</p>
          <table className="book-client-infos-table">
            <tr>
              <td>Nom</td>
              <td>{userName}</td>
            </tr>
            <tr>
              <td>Solvabilité</td>
              <td className={solvencyClassName}>{solvency}</td>
            </tr>
          </table>
        </div>
      </ConfirmMethod>
    )}
    {promotionLotStatus === PROMOTION_LOT_STATUS.BOOKED
      && loanId === attributedToId && (
        <>
          <ConfirmMethod
            buttonProps={{ outlined: true, secondary: true }}
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
    {promotionLotStatus === PROMOTION_LOT_STATUS.SOLD
      && loanId === attributedToId && (
      <span className="sold">
        <T id="PromotionLotAttributer.sold" />
      </span>
    )}
  </div>
);

export default PromotionLotAttributerContainer(PromotionLotAttributer);
