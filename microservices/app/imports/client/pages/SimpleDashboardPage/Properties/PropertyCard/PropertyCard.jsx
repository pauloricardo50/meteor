// @flow
import React from 'react';
import Button from 'core/components/Button';

import PropertyCardContainer from './PropertyCardContainer';
import PropertyCardInfos from './PropertyCardInfos';
import PropertyCardPromotionOptions from './PropertyCardPromotionOptions';
import Dialog from 'core/components/Material/Dialog';
import ResidenceTypeSetter from 'core/components/ResidenceTypeSetter';
import T from 'core/components/Translation';

type PropertyCardProps = {
  buttonLabel: Object,
  image: String,
  name: String,
  address: String,
  additionalInfos: String,
  onClick: Function,
};

const PropertyCard = (props: PropertyCardProps) => {
  const {
    buttonLabel,
    onClick,
    loan,
    route,
    showResidenceTypeSetter,
    setShowResidenceTypeSetter,
    image,
    history,
  } = props;

  return (
    <div className="card1 property-card">
      <div className="top">
        <PropertyCardInfos {...props} />
        <div className="property-card-actions">
          <Button className="button" onClick={onClick} secondary raised>
            {buttonLabel}
          </Button>
        </div>
      </div>
      {loan.promotionOptions && loan.promotionOptions.length > 0 && (
        <div className="bottom">
          <PropertyCardPromotionOptions {...props} />
        </div>
      )}
      <Dialog
        open={showResidenceTypeSetter}
        className="residence-type-setter-dialog"
        actions={[
          <Button
            primary
            label={<T id="general.close" />}
            onClick={() => setShowResidenceTypeSetter(false)}
          />,
        ]}
      >
        <ResidenceTypeSetter
          loan={loan}
          image={image}
          onSubmitCallback={() => history.push(route)}
        />
      </Dialog>
    </div>
  );
};

export default PropertyCardContainer(PropertyCard);
