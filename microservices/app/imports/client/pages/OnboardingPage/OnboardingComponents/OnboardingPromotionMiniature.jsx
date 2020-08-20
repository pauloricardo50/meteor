import React, { useEffect } from 'react';

const OnboardingPromotionMiniature = ({
  promotionId,
  setHasPropertyOrPromotion,
}) => {
  useEffect(() => {
    setHasPropertyOrPromotion(false);
  }, []);

  // TODO: Prepare anonymous promotions
  return null;
};

export default OnboardingPromotionMiniature;
