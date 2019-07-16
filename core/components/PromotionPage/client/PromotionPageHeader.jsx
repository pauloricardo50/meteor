// @flow
import React from 'react';

type PromotionPageHeaderProps = {};

const PromotionPageHeader = ({ promotion }: PromotionPageHeaderProps) => {
  const { documents: { promotionImage = [] } = {} } = promotion;
  return (
    <div
      className="promotion-page-header"
      style={{ backgroundImage: `url("${promotionImage[0].url}")` }}
    >
      Hello from PromotionPageHeader
    </div>
  );
};

export default PromotionPageHeader;
