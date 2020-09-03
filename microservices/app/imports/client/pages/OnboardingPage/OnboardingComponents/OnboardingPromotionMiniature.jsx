import React, { useEffect } from 'react';

import { anonymousPromotion } from 'core/api/promotions/queries';
import T from 'core/components/Translation';
import useMeteorData from 'core/hooks/useMeteorData';
import { createRoute } from 'core/utils/routerUtils';

import appRoutes from '../../../../startup/client/appRoutes';
import OnboardingMiniature from './OnboardingMiniature';

export const PromotionMiniature = ({ promotion, loan = {} }) => {
  const {
    name,
    city,
    canton,
    lotsCount,
    documents: { promotionImage: images } = {},
    _id: promotionId,
  } = promotion || {};
  const { _id: loanId, anonymous } = loan;

  const link =
    loanId && !anonymous
      ? createRoute(appRoutes.APP_PROMOTION_PAGE.path, {
          promotionId,
          loanId,
          tabId: 'overview',
        })
      : createRoute(appRoutes.PROMOTION_PAGE.path, { promotionId });

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
      link={link}
    />
  );
};

const OnboardingPromotionMiniature = ({ promotionId, setHasInvalidQuery }) => {
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

  useEffect(() => {
    if (!loading && !promotion) {
      setHasInvalidQuery(true);
    }
  }, []);

  return <PromotionMiniature promotion={promotion} />;
};

export default OnboardingPromotionMiniature;
