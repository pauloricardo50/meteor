// @flow
import React from 'react';
import PromotionCard from './PromotionCard';

type PromotionDetailProps = {
  promotion: Object,
  loanId: string,
};

const PromotionDetail = ({ promotion, loanId }: PromotionDetailProps) => (
  <div className="promotion-detail">
    <PromotionCard promotion={promotion} loanId={loanId} />
  </div>
);

export default PromotionDetail;
