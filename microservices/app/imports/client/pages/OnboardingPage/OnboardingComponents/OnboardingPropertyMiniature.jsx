import React, { useEffect } from 'react';
import { faHome } from '@fortawesome/pro-light-svg-icons/faHome';

import { anonymousProperty } from 'core/api/properties/queries';
import FaIcon from 'core/components/Icon/FaIcon';
import Link from 'core/components/Link';
import Loading from 'core/components/Loading';
import { Money } from 'core/components/Translation';
import useMeteorData from 'core/hooks/useMeteorData';
import { createRoute } from 'core/utils/routerUtils';

import appRoutes from '../../../../startup/client/appRoutes';

const MiniatureImage = ({ url }) => {
  if (url) {
    return <div className="img" style={{ backgroundImage: `url("${url}")` }} />;
  }

  return <FaIcon icon={faHome} />;
};

export const PropertyMiniature = ({ property }) => {
  const { imageUrls, address1, totalValue, _id: propertyId } = property;

  return (
    <Link
      to={createRoute(appRoutes.PRO_PROPERTY_PAGE.path, { propertyId })}
      className="onboarding-miniature flex"
    >
      <MiniatureImage url={imageUrls?.[0]} />
      <div className="flex-col sa p-16">
        <h4 className="m-0">{address1}</h4>
        <span className="secondary font-size-3">
          <Money value={totalValue} />
        </span>
      </div>
    </Link>
  );
};

const OnboardingPropertyMiniature = ({
  propertyId,
  setHasPropertyOrPromotion,
}) => {
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
      setHasPropertyOrPromotion(false);
    }
  }, [loading]);

  if (!proProperty) {
    return (
      <div className="onboarding-miniature">
        <Loading small />
      </div>
    );
  }

  return <PropertyMiniature property={proProperty} />;
};

export default OnboardingPropertyMiniature;
