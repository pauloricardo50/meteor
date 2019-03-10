// @flow
import React from 'react';

import ProPropertyheader from './ProPropertyHeader';
import DocumentDownloadList from '../DocumentDownloadList';

type ProPropertyProps = {};

const ProProperty = ({ property }: ProPropertyProps) => {
  const { documents } = property;

  return (
    <div className="pro-property card1 card-top">
      <ProPropertyheader property={property} />
      <DocumentDownloadList files={documents && documents.propertyDocuments} />
    </div>
  );
};

export default ProProperty;
