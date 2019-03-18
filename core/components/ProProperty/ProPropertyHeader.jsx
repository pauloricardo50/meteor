// @flow
import React from 'react';

import { Money } from '../Translation';
import ImageCarrousel from '../ImageCarrousel';

type ProPropertyheaderProps = {};

const getImages = (documents, imageUrls = []) => {
  if (imageUrls.length) {
    return imageUrls;
  }

  return (
    (documents
      && documents.propertyImages
      && documents.propertyImages.length
      && documents.propertyImages.map(({ url }) => url)) || [
      '/img/placeholder.png',
    ]
  );
};

const ProPropertyheader = ({ property }: ProPropertyheaderProps) => {
  const { address1, totalValue, description, documents, imageUrls } = property;

  return (
    <div className="header">
      <div>
        <h1>{address1}</h1>
        <h2 className="secondary">
          <Money value={totalValue} />
        </h2>
        <p className="description">{description}</p>
      </div>
      <ImageCarrousel images={getImages(documents, imageUrls)} />
    </div>
  );
};

export default ProPropertyheader;
