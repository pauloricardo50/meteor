import React from 'react';
import PromotionCard from './PromotionCard';

const PromotionDetail = ({ promotion, loanId }) => (
  <div className="promotion-detail">
    <PromotionCard promotion={promotion} loanId={loanId} />
  </div>
);

export default PromotionDetail;
