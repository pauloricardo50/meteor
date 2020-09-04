import React from 'react';

import ExternalUrl from '../../../ExternalUrl';
import MapWithMarkerWrapper from '../../../maps/MapWithMarkerWrapper';

const PromotionDescription = ({
  promotion: { name, address1, city, zipCode, description, externalUrl },
}) => (
  <div className="promotion-page-description">
    {(description || externalUrl) && (
      <div className="flex-col mt-16 mb-16 center" style={{ flexGrow: 1 }}>
        {externalUrl && (
          <div className="flex center mb-16" style={{ flexGrow: 1 }}>
            <ExternalUrl description={name} style={{ maxWidth: '250px' }} />
          </div>
        )}
        {description && (
          <div
            className="card1 flex-col center-align"
            style={{ flexGrow: 1, padding: '16px 0', width: '100%' }}
          >
            <h2 className="mt-0">Description</h2>
            <p className="description">{description}</p>
          </div>
        )}
      </div>
    )}
    <MapWithMarkerWrapper
      address1={address1}
      city={city}
      zipCode={zipCode}
      options={{ zoom: 12 }}
      className="animated fadeIn"
    />
  </div>
);

export default PromotionDescription;
