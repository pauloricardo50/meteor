// @flow
import React from 'react';

import MapWithMarkerWrapper from 'core/components/maps/MapWithMarkerWrapper';
import ProPropertyheader from './ProPropertyHeader';
import DocumentDownloadList from '../DocumentDownloadList';
import ProPropertyContainer from './ProPropertyContainer';

type ProPropertyProps = {};

const ProProperty = ({ property }: ProPropertyProps) => {
  const { documents, address1, city, zipCode } = property;

  return (
    <div className="pro-property card1 card-top">
      <ProPropertyheader property={property} />
      <MapWithMarkerWrapper
        address1={address1}
        city={city}
        zipCode={zipCode}
        options={{ zoom: 15 }}
        showIncompleteAddress={false}
      />
      <DocumentDownloadList files={documents && documents.propertyDocuments} />
    </div>
  );
};

export default ProPropertyContainer(ProProperty);
