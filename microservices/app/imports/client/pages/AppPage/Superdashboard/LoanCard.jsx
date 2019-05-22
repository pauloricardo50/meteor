// @flow
import React from 'react';
import BorrowersSummary from 'core/components/BorrowersSummary';
import T from 'core/components/Translation';
import LoanRenamer from '../LoanRenamer';
import LoanProgress from './LoanProgress';

type LoanCardProps = {
  loan: Object,
};

const getLoanTitle = (name, customName) => {
  if (customName) {
    return `${name} - ${customName}`;
  }

  return name;
};

const getAddress = ({ promotions, properties, hasPromotion }) =>
  (hasPromotion
    ? promotions[0].address
    : properties.length
      ? properties[0].address
      : '');

const getImage = ({ promotions, properties, hasPromotion, hasProProperty }) => {
  if (hasPromotion) {
    const promotion = promotions[0];
    const { documents: { promotionImage = [] } = {} } = promotion;
    return promotionImage.length ? promotionImage[0].url : null;
  }
  if (hasProProperty) {
    const property = properties[0];
    const { documents: { propertyImages = [] } = {} } = property;
    return propertyImages.length ? propertyImages[0].url : null;
  }

  return null;
};

const LoanCard = ({ loan = {} }: LoanCardProps) => {
  const {
    _id: loanId,
    borrowers = [],
    customName,
    name,
    hasPromotion,
    hasProProperty,
    promotions = [],
    properties = [],
    purchaseType,
    step,
  } = loan;

  const image = getImage({
    promotions,
    properties,
    hasPromotion,
    hasProProperty,
  });

  return (
    <div className="loancard">
      <div className="loancard-header">
        {image && (
          <div className="loancard-header-cover">
            <div className="gradient" />
            <img src={image} />
          </div>
        )}
        <div className="loancard-header-title">
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
        />
      </div>
      <div className="loancard-body">
        <div className="borrowers">
          <h4 className="secondary">Emprunteurs</h4>
          <BorrowersSummary borrowers={borrowers} showTitle={false} />
        </div>
        <LoanProgress step={step} />
      </div>
    </div>
  );
};

export default LoanCard;
