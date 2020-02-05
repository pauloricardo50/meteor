//
import React from 'react';

import { PROPERTY_DOCUMENTS, COLLECTIONS } from 'core/api/constants';
import { Money } from '../Translation';
import Icon from '../Icon';
import ImageCarrousel from '../ImageCarrousel';
import ProPropertyRecap from './ProPropertyRecap';
import UpdateField from '../UpdateField';

const getImages = (documents = {}, imageUrls = []) => {
  let images = [];
  if (imageUrls.length) {
    images = imageUrls;
  }

  if (
    documents[PROPERTY_DOCUMENTS.PROPERTY_PICTURES] &&
    documents[PROPERTY_DOCUMENTS.PROPERTY_PICTURES].length
  ) {
    images = [
      ...images,
      ...documents[PROPERTY_DOCUMENTS.PROPERTY_PICTURES].map(({ url }) => url),
    ];
  }

  if (images.length === 0) {
    images = ['/img/placeholder.png'];
  }

  return images;
};

const ProPropertyheader = ({ property, loan }) => {
  const {
    address1,
    totalValue,
    description,
    documents,
    imageUrls,
    openGraphData = {},
    externalUrl,
    useOpenGraph,
  } = property;

  const {
    ogTitle = address1,
    ogDescription = description,
    ogSiteName,
  } = openGraphData;

  return (
    <div className="header">
      <div className="header-left">
        <div
          className="flex-row"
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <div className="flex-col">
            <h1>{useOpenGraph ? ogTitle : address1}</h1>
            <h2 className="secondary">
              <Money value={totalValue} />
            </h2>
          </div>
          {loan && (
            <UpdateField
              doc={loan}
              fields={['residenceType']}
              collection={COLLECTIONS.LOANS_COLLECTION}
              className="residence-type-setter"
            />
          )}
        </div>
        {(ogDescription || description) && (
          <p className="description">
            {useOpenGraph ? ogDescription : description}
          </p>
        )}
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
