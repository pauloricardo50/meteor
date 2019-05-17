// @flow
import React from 'react';

import {
  PROPERTIES_COLLECTION,
  PROMOTIONS_COLLECTION,
} from 'core/api/constants';
import T from 'core/components/Translation';
import PropertyCard from './PropertyCard';
import PromotionCard from './PropertyCard/PromotionCard';
import PropertyCardSubtitle from './PropertyCard/PropertyCardSubtitle';

type PropertiesProps = {
  loan: Object,
};

const Properties = ({ loan }: PropertiesProps) => {
  const {
    properties = [],
    promotions = [],
    _id: loanId,
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
            subtitle={(
              <PropertyCardSubtitle
                property={property}
                maxPropertyValue={maxPropertyValue}
                residenceType={residenceType}
              />
            )}
          />
        )),
      ]}
    </>
  );
};

export default Properties;
