//      
import React from 'react';

import T from 'core/components/Translation';
import { PROPERTY_DOCUMENTS } from 'core/api/constants';
import LoanRenamer from '../LoanRenamer';

                            
               
                        
  

const getLoanTitle = (name, customName) => {
  if (customName) {
    return `${name} - ${customName}`;
  }

  return name;
};

const getAddress = ({ promotions, properties, hasPromotion }) =>
  hasPromotion
    ? promotions[0].address
    : properties.length
    ? properties[0].address
    : '';

const getImage = ({ promotions, properties, hasPromotion, hasProProperty }) => {
  if (hasPromotion) {
    const promotion = promotions[0];
    const { documents: { promotionImage = [] } = {} } = promotion;
    return promotionImage.length ? promotionImage[0].url : null;
  }
  if (hasProProperty) {
    const property = properties[0];
    const {
      documents: {
        [PROPERTY_DOCUMENTS.PROPERTY_PICTURES]: propertyImages = [],
      } = {},
    } = property;
    return propertyImages.length ? propertyImages[0].url : null;
  }

  return null;
};

const LoanCardHeader = ({ loan, disableLink }                     ) => {
  const {
    _id: loanId,
    customName,
    name,
    hasPromotion,
    hasProProperty,
    promotions = [],
    properties = [],
    purchaseType,
  } = loan;

  const image = getImage({
    promotions,
    properties,
    hasPromotion,
    hasProProperty,
  });

  return (
    <div className="loan-card-header">
      {image && (
        <div className="loan-card-header-cover">
          <div className="gradient" />
          <img src={image} alt="property" />
        </div>
      )}
      <div className="loan-card-header-title">
        <h4>
          <small>
            <T id={`Forms.purchaseType.${purchaseType}`} />
          </small>
        </h4>
        <h2>{getLoanTitle(name, customName)}</h2>
        <p>{getAddress({ promotions, properties, hasPromotion })}</p>
      </div>
      <LoanRenamer
        loanId={loanId}
        customName={customName}
        className="loan-renamer"
        onEnter={() => disableLink(true)}
        onExited={() => disableLink(false)}
      />
    </div>
  );
};

export default LoanCardHeader;
