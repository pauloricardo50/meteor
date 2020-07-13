import React from 'react';

import MortgageRateCarousel from '../MortgageRateCarousel';
import WwwCalculator from '../WwwCalculator';

const customComponents = {
  calculator: WwwCalculator,
  mortgageRateCarousel: MortgageRateCarousel,
};

const CustomComponent = ({ primary: { component_name } }) => {
  const Component = customComponents[component_name];
  return <Component />;
};

export default CustomComponent;
