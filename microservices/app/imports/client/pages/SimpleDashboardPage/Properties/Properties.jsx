import React from 'react';

import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { PROPERTIES_COLLECTION } from 'core/api/properties/propertyConstants';
import { withPromotionPageContext } from 'core/components/PromotionPage/client/PromotionPageContext';
import T from 'core/components/Translation';

import PropertyCard from './PropertyCard';
import PromotionCard from './PropertyCard/PromotionCard';
import PropertyCardSubtitle from './PropertyCard/PropertyCardSubtitle';

const Properties = ({ loan }) => {
  const {
    properties = [],
    promotions = [],
    shareSolvency,
    maxPropertyValue,
    residenceType,
  } = loan;

  return (
    <>
      {[
        ...promotions.map(promotion => (
          <PromotionCard
            document={promotion}
            key={promotion._id}
            collection={PROMOTIONS_COLLECTION}
            loan={loan}
            title={promotion.name}
            subtitle={promotion.address}
          />
        )),
        ...properties.map(property => (
          <PropertyCard
            document={property}
            key={property._id}
            collection={PROPERTIES_COLLECTION}
            loan={loan}
            shareSolvency={shareSolvency}
            title={
              property.address1 || (
                <T id="FinancingPropertyPicker.placeholder" />
              )
            }
            subtitle={
              <PropertyCardSubtitle
                property={property}
                maxPropertyValue={maxPropertyValue}
                residenceType={residenceType}
              />
            }
          />
        )),
      ]}
    </>
  );
};

export default withPromotionPageContext(({ loan }) => ({
  promotion: loan.promotions[0],
}))(Properties);
