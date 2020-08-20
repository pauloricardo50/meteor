import React from 'react';

import DocumentDownloadList from '../DocumentDownloadList';
import MapWithMarkerWrapper from '../maps/MapWithMarkerWrapper';
import ProPropertyContainer from './ProPropertyContainer';
import ProPropertyheader from './ProPropertyHeader';

const ProProperty = ({ property, loan, documents }) => {
  const { address1, city, zipCode } = property;

  return (
    <div className="pro-property card1 card-top animated fadeIn">
      <ProPropertyheader property={property} loan={loan} />
      <MapWithMarkerWrapper
        address1={address1}
        city={city}
        zipCode={zipCode}
        options={{ zoom: 15 }}
        showIncompleteAddress={false}
      />
      <DocumentDownloadList files={documents} />
    </div>
  );
};

export default ProPropertyContainer(ProProperty);
