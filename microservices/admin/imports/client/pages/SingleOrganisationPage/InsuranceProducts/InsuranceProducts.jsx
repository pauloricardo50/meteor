import React from 'react';
import InsuranceProduct from './InsuranceProduct';
import InsuranceProductAdder from './InsuranceProductAdder';

const InsuranceProducts = ({
  _id: organisationId,
  insuranceProducts = [],
  name: organisationName,
}) => (
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

export default InsuranceProducts;
