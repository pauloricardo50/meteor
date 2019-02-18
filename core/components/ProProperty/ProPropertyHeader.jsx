// @flow
import React from 'react';

import { Money } from '../Translation';
import ImageCarrousel from '../ImageCarrousel';

type ProPropertyheaderProps = {};

const ProPropertyheader = ({ property }: ProPropertyheaderProps) => {
  const { address1, totalValue, description, documents } = property;

  return (
    <div className="header">
      <div>
        <h1>{address1}</h1>
        <h2 className="secondary">
          <Money value={totalValue} />
        </h2>
        <p className="description">{description}</p>
      </div>
      <ImageCarrousel
        images={
          (documents
            && documents.propertyImages
            && documents.propertyImages.length
            && documents.propertyImages.map(({ url }) => url)) || [
            '/img/placeholder.png',
          ]
        }
      />
    </div>
  );
};

export default ProPropertyheader;
