import React from 'react';
// import WwwCalculator from '../WwwCalculator';
import Loadable from 'react-loadable';

import Loading from 'core/components/Loading';

import MortgageRateCarousel from '../MortgageRateCarousel';

const customComponents = {
  calculator: Loadable({
    loader: () => import('../WwwCalculator'),
    loading: () => <Loading />,
    delay: 200,
  }),
  mortgageRateCarousel: MortgageRateCarousel,
};

const CustomComponent = ({ primary: { component_name } }) => {
  const Component = customComponents[component_name];
  return <Component />;
};

export default CustomComponent;
