import React from 'react';
import InsuranceProduct from './InsuranceProduct';
import InsuranceProductAdder from './InsuranceProductAdder';

const InsuranceProducts = props => {
  const {
    _id: organisationId,
    insuranceProducts = [],
    name: organisationName,
  } = props;
  console.log('insr', insuranceProducts);

  return (
    <div>
      <InsuranceProductAdder
        organisationId={organisationId}
        organisationName={organisationName}
      />
      <div className="flex wrap">
        {insuranceProducts.map(insuranceProduct => (
          <InsuranceProduct
            insuranceProduct={insuranceProduct}
            key={insuranceProduct._id}
          />
        ))}
      </div>
    </div>
  );
};

export default InsuranceProducts;
