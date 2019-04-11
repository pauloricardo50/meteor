// @flow
import React from 'react';

import { Money } from '../Translation';
import Icon from '../Icon';
import ImageCarrousel from '../ImageCarrousel';
import ProPropertyRecap from './ProPropertyRecap';

type ProPropertyheaderProps = {};

const getImages = (documents = {}, imageUrls = []) => {
  let images = [];
  if (imageUrls.length) {
    images = imageUrls;
  }

  if (documents.propertyImages && documents.propertyImages.length) {
    images = [...images, documents.propertyImages.map(({ url }) => url)];
  }

  if (images.length === 0) {
    images = ['/img/placeholder.png'];
  }

  return images;
};

const ProPropertyheader = ({ property }: ProPropertyheaderProps) => {
  const {
    address1,
    totalValue,
    description,
    documents,
    imageUrls,
    openGraphData = {},
    externalUrl,
  } = property;

  const { ogTitle, ogDescription, ogSiteName } = openGraphData;

  return (
    <div className="header">
      <div className="header-left">
        <h1>{ogTitle || address1}</h1>
        <h2 className="secondary">
          <Money value={totalValue} />
        </h2>
        <p className="description">{ogDescription || description}</p>
        <ProPropertyRecap property={property} />
        {externalUrl && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={externalUrl}
            className="card1 card-top card-hover flex-col center external-link"
          >
            <Icon type="openInNew" className="external-link-icon" size={40} />
            {ogSiteName && <h2>{ogSiteName}</h2>}
            <h4 className="secondary">Ouvrir site externe</h4>
          </a>
        )}
      </div>
      <ImageCarrousel images={getImages(documents, imageUrls)} />
    </div>
  );
};

export default ProPropertyheader;
