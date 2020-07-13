import React from 'react';

import WwwCalculator from '../WwwCalculator';

const customComponents = {
  calculator: WwwCalculator,
};

const CustomComponent = ({ primary: { component_name } }) => {
  const Component = customComponents[component_name];
  return <Component />;
};

export default CustomComponent;
