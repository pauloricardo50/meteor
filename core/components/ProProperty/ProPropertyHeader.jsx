import React from 'react';

import { PROPERTY_DOCUMENTS } from '../../api/files/fileConstants';
import Loans from '../../api/loans';
import ExternalUrl from '../ExternalUrl';
import Icon from '../Icon';
import ImageCarrousel from '../ImageCarrousel';
import { Money } from '../Translation';
import UpdateField from '../UpdateField';
import ProPropertyRecap from './ProPropertyRecap';

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
              collection={Loans}
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
        {externalUrl && <ExternalUrl description={ogSiteName} />}
      </div>
      <ImageCarrousel images={getImages(documents, imageUrls)} />
    </div>
  );
};

export default ProPropertyheader;
