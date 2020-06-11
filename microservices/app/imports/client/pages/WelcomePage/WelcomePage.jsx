import React from 'react';

import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';

import WelcomeScreen from '../../components/WelcomeScreen';

const WelcomePage = props => {
  const { loan } = props;
  const progress = Calculator.personalInfoPercentSimple({ loan });

  return (
    <WelcomeScreen
      page
      buttonProps={{
        label: progress > 0 ? <T id="general.continue" /> : undefined,
      }}
      {...props}
    />
  );
};

export default WelcomePage;
