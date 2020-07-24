import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

const PromotionItemSkeleton = ({ w }) => {
  const { isMed, isWide, windowWidth } = w;
  const width = isMed
    ? windowWidth * 0.9
    : isWide
    ? windowWidth * 0.45
    : '100%';

  return (
    <div className="promotion-item">
      <div className="promotion-item-images">
        <Skeleton variant="rect" height="100%" width={width} />
      </div>
      <div className="promotion-item-title">
        <Skeleton variant="text" width="50%" />
      </div>
      <span className="promotion-item-lots-count text-l">
        <Skeleton variant="text" width="40%" />
      </span>
      <p className="promotion-item-description">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </p>
    </div>
  );
};

export default PromotionItemSkeleton;
