import React from 'react';

import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';

export const InsuranceRequestBoardCardTopLeft = ({
  data: insuranceRequest,
}) => <CollectionIconLink relatedDoc={insuranceRequest} />;

export const InsuranceRequestBoardCardTopRight = () => null;
