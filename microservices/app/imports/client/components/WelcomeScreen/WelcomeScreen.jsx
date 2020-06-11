import React from 'react';

import Waves from 'core/components/Waves';

import WelcomeScreenContainer from './WelcomeScreenContainer';
import WelcomeScreenLinks from './WelcomeScreenLinks';
import WelcomeScreenTop from './WelcomeScreenTop';

export const WelcomeScreen = ({
  handleClick,
  setDontShowAgain,
  dontShowAgain,
  displayCheckbox,
  buttonProps,
  cta,
  img,
}) => (
  <div className="welcome-screen animated fadeIn">
    <Waves noSlope={false} />
    <div className="welcome-screen-content">
      <WelcomeScreenTop
        handleClick={handleClick}
        setDontShowAgain={setDontShowAgain}
        dontShowAgain={dontShowAgain}
        displayCheckbox={displayCheckbox}
        buttonProps={buttonProps}
        cta={cta}
        img={img}
      />

      <WelcomeScreenLinks />
    </div>
  </div>
);

export default WelcomeScreenContainer(WelcomeScreen);
