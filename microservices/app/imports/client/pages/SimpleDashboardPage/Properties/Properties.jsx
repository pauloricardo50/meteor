// @flow
import React from 'react';
import {
  PROPERTIES_COLLECTION,
  PROMOTIONS_COLLECTION,
} from 'core/api/constants';
import PropertyCard from './PropertyCard';
import PromotionCard from './PropertyCard/PromotionCard';

type PropertiesProps = {
  loan: Object,
};

const Properties = ({ loan }: PropertiesProps) => {
  const { properties = [], promotions = [], _id: loanId, shareSolvency } = loan;

  return (
    <>
      {[
        ...promotions.map(promotion => (
          <PromotionCard
            document={promotion}
            key={promotion._id}
            collection={PROMOTIONS_COLLECTION}
            loanId={loanId}
          />
        )),
        ...properties.map(property => (
          <PropertyCard
            document={property}
            key={property._id}
            collection={PROPERTIES_COLLECTION}
            loanId={loanId}
            shareSolvency={shareSolvency}
          />
        )),
      ]}
    </>
  );
};

export default Properties;
