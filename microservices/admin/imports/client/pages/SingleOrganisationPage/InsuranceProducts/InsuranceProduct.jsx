import React, { useState } from 'react';
import T from 'core/components/Translation';
import InsuranceProductModifier from './InsuranceProductModifier';

const InsuranceProduct = ({ insuranceProduct }) => {
  const { type, category, name, revaluationFactor } = insuranceProduct;
  const [openModifier, setOpenModifier] = useState(false);
  return (
    <>
      <InsuranceProductModifier
        insuranceProduct={insuranceProduct}
        open={openModifier}
        setOpen={setOpenModifier}
      />
      <div
        className="card1 card-hover flex-col mr-16 mt-16"
        onClick={() => setOpenModifier(true)}
        style={{ cursor: 'pointer' }}
      >
        <h3 className="card-header mt-0 mb-0">{name}</h3>
        <div className="p-8">
          <h4>Type de produit</h4>
          <span>
            <T id={`InsuranceProduct.type.${type}`} />
            &nbsp;
            <T id={`InsuranceProduct.category.${category}`} />
          </span>
          <h4>Facteur de revalorisation</h4>
          <span>{revaluationFactor}</span>
        </div>
      </div>
    </>
  );
};

export default InsuranceProduct;
