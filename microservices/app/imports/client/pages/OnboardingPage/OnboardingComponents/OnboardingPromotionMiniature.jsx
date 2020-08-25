import React, { useEffect } from 'react';

import { anonymousPromotion } from 'core/api/promotions/queries';
import T from 'core/components/Translation';
import useMeteorData from 'core/hooks/useMeteorData';
import { createRoute } from 'core/utils/routerUtils';

import appRoutes from '../../../../startup/client/appRoutes';
import OnboardingMiniature from './OnboardingMiniature';

export const PromotionMiniature = ({ promotion }) => {
  const {
    name,
    city,
    canton,
    lotsCount,
    documents: { promotionImage: images } = {},
    _id: promotionId,
  } = promotion || {};

  return (
    <OnboardingMiniature
      loading={!promotion}
      title={
        <>
          {name},&nbsp;
          <small>
            {city} {canton}
          </small>
        </>
      }
      subtitle={
        <T
          id="PromotionPage.subtitle"
          values={{ promotionLotCount: lotsCount }}
        />
      }
      imageUrl={images?.[0]?.url}
      link={createRoute(appRoutes.PROMOTION_PAGE.path, { promotionId })}
    />
  );
};

const OnboardingPromotionMiniature = ({
  promotionId,
  setHasPropertyOrPromotion,
}) => {
  const { data: promotion, loading } = useMeteorData({
    query: anonymousPromotion,
    params: {
      _id: promotionId,
      $body: {
        name: 1,
        city: 1,
        canton: 1,
        lotsCount: 1,
        documents: { promotionImage: 1 },
      },
    },
    refetchOnMethodCall: false,
    type: 'single',
  });
  console.log('promotion:', promotion);

  useEffect(() => {
    if (!loading && !promotion) {
      setHasPropertyOrPromotion(false);
    }
  }, []);

  return <PromotionMiniature promotion={promotion} />;
};

export default OnboardingPromotionMiniature;
