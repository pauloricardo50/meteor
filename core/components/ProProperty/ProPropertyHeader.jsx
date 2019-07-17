// @flow
import React from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import { PROPERTY_DOCUMENTS } from 'core/api/constants';
import { Money } from '../Translation';
import Icon from '../Icon';
import ImageCarrousel from '../ImageCarrousel';
import ProPropertyRecap from './ProPropertyRecap';
import ResidenceTypeSetter from '../ResidenceTypeSetter/ResidenceTypeSetter';
import createTheme from '../../config/muiCustom';

type ProPropertyheaderProps = {};

const getImages = (documents = {}, imageUrls = []) => {
  let images = [];
  if (imageUrls.length) {
    images = imageUrls;
  }

  if (
    documents[PROPERTY_DOCUMENTS.PROPERTY_PICTURES]
    && documents[PROPERTY_DOCUMENTS.PROPERTY_PICTURES].length
  ) {
    images = [
      ...images,
      documents[PROPERTY_DOCUMENTS.PROPERTY_PICTURES].map(({ url }) => url),
    ];
  }

  if (images.length === 0) {
    images = ['/img/placeholder.png'];
  }

  return images;
};

const ProPropertyheader = ({ property, loan }: ProPropertyheaderProps) => {
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
  const defaultTheme = createTheme();

  return (
    <div className="header">
      <div className="header-left">
        <div
          className="flex-row"
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <div className="flex-col">
            <h1>{ogTitle || address1}</h1>
            <h2 className="secondary">
              <Money value={totalValue} />
            </h2>
          </div>
          {loan && (
            <MuiThemeProvider
              theme={{
                ...defaultTheme,
                overrides: {
                  ...defaultTheme.overrides,
                  MuiFormControl: {
                    root: {
                      marginTop: '8px !important',
                    },
                  },
                },
              }}
            >
              <ResidenceTypeSetter loan={loan} noIcon />
            </MuiThemeProvider>
          )}
        </div>
        {(ogDescription || description) && (
          <p className="description">{ogDescription || description}</p>
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
