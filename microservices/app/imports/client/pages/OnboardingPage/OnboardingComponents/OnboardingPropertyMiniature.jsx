import React, { useEffect } from 'react';

import { anonymousProperty } from 'core/api/properties/queries';
import { Money } from 'core/components/Translation';
import useMeteorData from 'core/hooks/useMeteorData';
import { createRoute } from 'core/utils/routerUtils';

import appRoutes from '../../../../startup/client/appRoutes';
import OnboardingMiniature from './OnboardingMiniature';

export const PropertyMiniature = ({ property }) => {
  const { imageUrls, address1, totalValue, _id: propertyId } = property || {};

  return (
    <OnboardingMiniature
      loading={!property}
      title={address1}
      subtitle={<Money value={totalValue} />}
      imageUrl={imageUrls?.[0]}
      link={createRoute(appRoutes.PRO_PROPERTY_PAGE.path, { propertyId })}
    />
  );
};

const OnboardingPropertyMiniature = ({ propertyId, setHasInvalidQuery }) => {
  const { data: proProperty, loading } = useMeteorData({
    query: anonymousProperty,
    params: {
      _id: propertyId,
      $body: { address1: 1, imageUrls: 1, totalValue: 1 },
    },
    refetchOnMethodCall: false,
    type: 'single',
  });

  useEffect(() => {
    if (!loading && !proProperty) {
      setHasInvalidQuery(true);
    }
  }, [loading]);

  return <PropertyMiniature property={proProperty} />;
};

export default OnboardingPropertyMiniature;
