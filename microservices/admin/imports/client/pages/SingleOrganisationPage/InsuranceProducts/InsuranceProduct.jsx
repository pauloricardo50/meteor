import React, { useState } from 'react';
import T from 'core/components/Translation';
import { formatMessage } from 'core/utils/intl';
import InsuranceProductModifier from './InsuranceProductModifier';

const InsuranceProduct = ({ insuranceProduct }) => {
  const { features = [], category, name, revaluationFactor } = insuranceProduct;
  const [openModifier, setOpenModifier] = useState(false);
  return (
    <div
      className="card1 card-hover flex-col mr-16 mt-16"
      onClick={() => setOpenModifier(true)}
      style={{ cursor: 'pointer' }}
    >
      <InsuranceProductModifier
        insuranceProduct={insuranceProduct}
        open={openModifier}
        setOpen={setOpenModifier}
      />
      <h3 className="card-header mt-0 mb-0">{name}</h3>
      <div className="p-8">
        <h4>Catégorie</h4>
        <T id={`InsuranceProduct.category.${category}`} />
        <h4>Prestations</h4>
        <span>
          {features
            .map(feature =>
              formatMessage({
                id: `InsuranceProduct.features.${feature}`,
              }),
            )
            .join(' + ')}
        </span>
        <h4>Facteur de revalorisation</h4>
        <span>{revaluationFactor}</span>
      </div>
    </div>
  );
};

export default InsuranceProduct;
