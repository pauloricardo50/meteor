// @flow
import React from 'react';
import cx from 'classnames';

import MapWithMarkerWrapper from 'core/components/maps/MapWithMarkerWrapper';
import ProPropertyheader from './ProPropertyHeader';
import DocumentDownloadList from '../DocumentDownloadList';
import ProPropertyContainer from './ProPropertyContainer';

type ProPropertyProps = {};

const ProProperty = ({
  property,
  simple,
  loan,
  documents,
}: ProPropertyProps) => {
  const { address1, city, zipCode } = property;

  return (
    <div className={cx('pro-property card1 card-top', { simple })}>
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
